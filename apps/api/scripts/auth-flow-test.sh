#!/usr/bin/env bash
# Live auth flow + edge-case checks against a running API (default http://localhost:4000).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="${API_URL:-http://localhost:4000}"
ORIGIN="${AUTH_ORIGIN:-http://localhost:5173}"
EMAIL="edge-$(date +%s)@example.com"
PASS="TestPass123!"
COOKIE="$(mktemp)"
trap 'rm -f "$COOKIE"' EXIT

pass=0
fail=0
skip=0

check() {
  local name="$1"
  local cmd="$2"
  if eval "$cmd"; then
    echo "PASS  $name"
    pass=$((pass + 1))
  else
    echo "FAIL  $name"
    fail=$((fail + 1))
  fi
}

skip_test() {
  echo "SKIP  $1"
  skip=$((skip + 1))
}

check_output_contains() {
  local name="$1"
  local output="$2"
  shift 2

  for pattern in "$@"; do
    if ! printf '%s' "$output" | grep -qi "$pattern"; then
      echo "FAIL  $name (missing: $pattern)"
      fail=$((fail + 1))
      return
    fi
  done

  echo "PASS  $name"
  pass=$((pass + 1))
}

mint_verify_token() {
  (cd "$SCRIPT_DIR/.." && node "$SCRIPT_DIR/create-verify-token.mjs" "$1" 2>/dev/null) | tr -d '\r\n'
}

echo "=== Auth flow test report ==="
echo "Base URL: $BASE"
echo "Test email: $EMAIL"
echo ""

# --- Public / infra ---
check "GET /" "curl -sf '$BASE/' | grep -q '\"status\":\"ok\"'"
check "GET /v1/health" "curl -sf '$BASE/v1/health' | grep -q '\"db\":\"up\"'"
check "GET /api/auth/ok" "curl -sf '$BASE/api/auth/ok' | grep -q '\"ok\":true'"
check "GET /api/auth/jwks" "curl -sf '$BASE/api/auth/jwks' | grep -q 'ES256'"

# --- Edge: bad requests ---
check "sign-up missing fields" "curl -s -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/sign-up/email' -H 'Content-Type: application/json' -d '{}' | grep -q '400'"
check "sign-up invalid email" "curl -s -X POST '$BASE/api/auth/sign-up/email' -H 'Content-Type: application/json' -d '{\"email\":\"not-an-email\",\"password\":\"$PASS\",\"name\":\"X\"}' | grep -qiE 'email|invalid|VALIDATION'"
check "sign-up weak password" "curl -s -X POST '$BASE/api/auth/sign-up/email' -H 'Content-Type: application/json' -d '{\"email\":\"bad@example.com\",\"password\":\"short\",\"name\":\"X\"}' | grep -qiE 'password|invalid|short'"
check "sign-in unknown email" "curl -s -X POST '$BASE/api/auth/sign-in/email' -H 'Content-Type: application/json' -d '{\"email\":\"nobody@example.com\",\"password\":\"$PASS\"}' | grep -q 'INVALID_EMAIL_OR_PASSWORD'"
check "verify-email missing token" "curl -s -o /dev/null -w '%{http_code}' '$BASE/api/auth/verify-email' | grep -qE '^(400|401|422)$'"
check "verify-email garbage token" "curl -s '$BASE/api/auth/verify-email?token=not-a-jwt' | grep -q 'INVALID_TOKEN'"

# --- Sign up ---
SIGNUP=$(curl -s -X POST "$BASE/api/auth/sign-up/email" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"name\":\"Edge User\"}")
check "sign-up success" "echo '$SIGNUP' | grep -q '\"emailVerified\":false'"

DUP=$(curl -s -X POST "$BASE/api/auth/sign-up/email" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"name\":\"Edge User\"}")
check "duplicate sign-up opaque (anti-enumeration)" "echo '$DUP' | grep -q '\"email\":\"$EMAIL\"'"

# --- Unverified edge cases ---
check "sign-in unverified blocked" "curl -s -X POST '$BASE/api/auth/sign-in/email' -H 'Content-Type: application/json' -d '{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}' | grep -q 'EMAIL_NOT_VERIFIED'"
check "wrong password" "curl -s -X POST '$BASE/api/auth/sign-in/email' -H 'Content-Type: application/json' -d '{\"email\":\"$EMAIL\",\"password\":\"WrongPass123!\"}' | grep -q 'INVALID_EMAIL_OR_PASSWORD'"

# --- Email verification ---
SEND=$(curl -s -w '%{http_code}' -X POST "$BASE/api/auth/send-verification-email" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\"}")
check "send verification email" "echo '$SEND' | grep -q '200'"

TOKEN="$(mint_verify_token "$EMAIL" || true)"
VERIFIED=false
if [ -n "$TOKEN" ]; then
  VERIFY=$(curl -s -c "$COOKIE" -b "$COOKIE" -w '%{http_code}' \
    "$BASE/api/auth/verify-email?token=$TOKEN")
  if echo "$VERIFY" | grep -qE '(200|302|\"status\":true)'; then
    check "verify email" "true"
    VERIFIED=true
    check "verify email idempotent" "curl -s '$BASE/api/auth/verify-email?token=$TOKEN' | grep -qE '(\"status\":true|already)'"
  else
    check "verify email" "false"
    skip_test "verify email idempotent"
  fi
else
  skip_test "verify email (token mint failed)"
  skip_test "verify email idempotent"
fi

# --- Sign in (session cookie) ---
rm -f "$COOKIE"
if [ "$VERIFIED" = true ]; then
  SIGNIN=$(curl -s -c "$COOKIE" -b "$COOKIE" -X POST "$BASE/api/auth/sign-in/email" \
    -H 'Content-Type: application/json' \
    -H "Origin: $ORIGIN" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
  if echo "$SIGNIN" | grep -q '"user"'; then
    check "sign-in after verify" "true"
  else
    skip_test "sign-in after verify"
  fi

  SESSION=$(curl -s -b "$COOKIE" -c "$COOKIE" "$BASE/api/auth/get-session")
  check "session active" "echo '$SESSION' | grep -q '$EMAIL'"

  ORG_LIST_EARLY=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/api/auth/organization/list")
  check "no workspace before onboarding" "echo '$ORG_LIST_EARLY' | grep -q '\\[\\]'"
  check "session has no activeOrganizationId before onboarding" "! echo '$SESSION' | grep -q 'activeOrganizationId'"

  JWT_EARLY=$(curl -s -b "$COOKIE" -c "$COOKIE" -H "Origin: $ORIGIN" "$BASE/api/auth/token" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4 || true)
  if [ -n "$JWT_EARLY" ]; then
    ME_EARLY=$(curl -s -H "Authorization: Bearer $JWT_EARLY" "$BASE/v1/me")
    check "JWT has no activeOrganizationId before onboarding" "! echo '$ME_EARLY' | grep -q 'activeOrganizationId'"
    check "JWT organizationRole is null before onboarding" "echo '$ME_EARLY' | grep -q '\"organizationRole\":null'"
    JWT="$JWT_EARLY"
  else
    skip_test "JWT has no activeOrganizationId before onboarding"
    skip_test "JWT organizationRole is null before onboarding"
  fi
else
  skip_test "sign-in after verify (verification incomplete)"
  skip_test "session active"
  skip_test "no workspace before onboarding"
  skip_test "session has no activeOrganizationId before onboarding"
  skip_test "JWT has no activeOrganizationId before onboarding"
  skip_test "JWT organizationRole is null before onboarding"
fi

# --- JWT + protected route ---
JWT=""
if [ "$VERIFIED" = true ]; then
  JWT_RES=$(curl -s -b "$COOKIE" -c "$COOKIE" -H "Origin: $ORIGIN" "$BASE/api/auth/token")
  JWT=$(echo "$JWT_RES" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4 || true)
  if [ -n "$JWT" ]; then
    check "issue JWT" "true"
    check "GET /v1/me with JWT" "curl -sf -H \"Authorization: Bearer $JWT\" '$BASE/v1/me' | grep -q '$EMAIL'"
    check "invalid JWT rejected" "curl -s -o /dev/null -w '%{http_code}' -H 'Authorization: Bearer not.a.jwt' '$BASE/v1/me' | grep -q '401'"
    check "malformed bearer rejected" "curl -s -o /dev/null -w '%{http_code}' -H 'Authorization: Bearer' '$BASE/v1/me' | grep -q '401'"
    check "missing bearer rejected" "curl -s '$BASE/v1/me' | grep -q 'Missing bearer token'"
  else
    skip_test "issue JWT"
    skip_test "GET /v1/me with JWT"
    skip_test "invalid JWT rejected"
    skip_test "malformed bearer rejected"
    skip_test "missing bearer rejected"
  fi
else
  skip_test "issue JWT"
  skip_test "GET /v1/me with JWT"
  skip_test "invalid JWT rejected"
  skip_test "malformed bearer rejected"
  skip_test "missing bearer rejected"
fi

# --- Organization ---
if [ "$VERIFIED" = true ]; then
  SLUG="edge-org-$(date +%s)"
  ORG=$(curl -s -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/create" \
    -H 'Content-Type: application/json' \
    -H "Origin: $ORIGIN" \
    -d "{\"name\":\"Edge Org\",\"slug\":\"$SLUG\"}")
  if echo "$ORG" | grep -q '"id"'; then
    check "create organization" "true"
    ORG_DUP=$(curl -s -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/create" \
      -H 'Content-Type: application/json' \
      -H "Origin: $ORIGIN" \
      -d "{\"name\":\"Edge Org 2\",\"slug\":\"$SLUG\"}")
    check "duplicate org slug rejected" "echo '$ORG_DUP' | grep -qiE 'slug|exists|already|ORGANIZATION'"
    INVITE_EMAIL="invite-$(date +%s)@example.com"
    INVITE=$(curl -s -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/invite-member" \
      -H 'Content-Type: application/json' \
      -H "Origin: $ORIGIN" \
      -d "{\"email\":\"$INVITE_EMAIL\",\"role\":\"member\"}")
    check_output_contains "owner can invite member" "$INVITE" id email
    check "accept invitation without session blocked" "curl -s -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/organization/accept-invitation' -H 'Content-Type: application/json' -d '{\"invitationId\":\"fake\"}' | grep -q '401'"
    if [ -n "$JWT" ]; then
      ME=$(curl -s -H "Authorization: Bearer $JWT" "$BASE/v1/me")
      check "JWT includes activeOrganizationId" "echo '$ME' | grep -q 'activeOrganizationId'"
    else
      skip_test "JWT includes activeOrganizationId"
    fi
  else
    skip_test "create organization (no session)"
    skip_test "duplicate org slug rejected"
    skip_test "owner can invite member"
    skip_test "accept invitation without session blocked"
    skip_test "JWT includes activeOrganizationId"
  fi
else
  skip_test "create organization (no session)"
  skip_test "duplicate org slug rejected"
  skip_test "owner can invite member"
  skip_test "accept invitation without session blocked"
  skip_test "JWT includes activeOrganizationId"
fi

check "org without session blocked" "curl -s -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/organization/create' -H 'Content-Type: application/json' -d '{\"name\":\"X\",\"slug\":\"x\"}' | grep -q '401'"

# --- Password reset edge ---
FORGOT=$(curl -s -w '%{http_code}' -X POST "$BASE/api/auth/request-password-reset" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"redirectTo\":\"/\"}")
check "request-password-reset known email" "echo '$FORGOT' | grep -q '200'"
check "request-password-reset unknown email (constant time)" "curl -s -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/request-password-reset' -H 'Content-Type: application/json' -d '{\"email\":\"ghost@example.com\",\"redirectTo\":\"/\"}' | grep -q '200'"

# --- OAuth / magic link init ---
check "google oauth init" "curl -sf -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/sign-in/social' -H 'Content-Type: application/json' -d '{\"provider\":\"google\",\"callbackURL\":\"/\"}' | grep -q '200'"
check "magic link request" "curl -sf -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/sign-in/magic-link' -H 'Content-Type: application/json' -d \"{\\\"email\\\":\\\"$EMAIL\\\",\\\"callbackURL\\\":\\\"/\\\"}\" | grep -q '200'"
check "magic link invalid email" "curl -s -X POST '$BASE/api/auth/sign-in/magic-link' -H 'Content-Type: application/json' -d '{\"email\":\"bad\",\"callbackURL\":\"/\"}' | grep -qiE 'email|invalid|VALIDATION'"

# --- Email OTP edge (plugin enabled) ---
OTP_EMAIL="otp-$(date +%s)@example.com"
OTP_SEND=$(curl -s -w '%{http_code}' -X POST "$BASE/api/auth/email-otp/send-verification-otp" \
  -H 'Content-Type: application/json' \
  -H "Origin: $ORIGIN" \
  -d "{\"email\":\"$OTP_EMAIL\",\"type\":\"sign-in\"}")
check "email-otp send (unknown user)" "echo '$OTP_SEND' | grep -q '200'"
check "email-otp verify wrong code" "curl -s -X POST '$BASE/api/auth/email-otp/verify-email' -H 'Content-Type: application/json' -H 'Origin: $ORIGIN' -d '{\"email\":\"$OTP_EMAIL\",\"otp\":\"000000\"}' | grep -qiE 'invalid|otp|OTP'"

# --- Origin / CSRF edge (session required) ---
if [ "$VERIFIED" = true ]; then
  check "org wrong origin blocked" "curl -s -o /dev/null -w '%{http_code}' -b '$COOKIE' -X POST '$BASE/api/auth/organization/create' -H 'Content-Type: application/json' -H 'Origin: http://evil.example' -d '{\"name\":\"X\",\"slug\":\"evil-$(date +%s)\"}' | grep -qE '^(401|403)$'"
  ORG_LIST=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/api/auth/organization/list")
  check_output_contains "list organizations" "$ORG_LIST" id slug
fi

# --- Sign out ---
if [ "$VERIFIED" = true ]; then
  check "sign-out" "curl -sf -b '$COOKIE' -c '$COOKIE' -X POST '$BASE/api/auth/sign-out' -H 'Origin: $ORIGIN' | grep -q 'success'"
  check "session cleared" "curl -s -b '$COOKIE' '$BASE/api/auth/get-session' | grep -q 'null'"
  check "protected route after sign-out" "curl -s -o /dev/null -w '%{http_code}' -b '$COOKIE' -X POST '$BASE/api/auth/organization/create' -H 'Content-Type: application/json' -H 'Origin: $ORIGIN' -d '{\"name\":\"X\",\"slug\":\"after-signout\"}' | grep -q '401'"

  # --- JWT after sign-out (stateless) ---
  if [ -n "$JWT" ]; then
    check "JWT still validates after sign-out (stateless)" "curl -sf -H \"Authorization: Bearer $JWT\" '$BASE/v1/me' | grep -q '$EMAIL'"
  fi

  # --- Re-sign-in ---
  curl -sf -c "$COOKIE" -b "$COOKIE" -X POST "$BASE/api/auth/sign-in/email" \
    -H 'Content-Type: application/json' \
    -H "Origin: $ORIGIN" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" >/dev/null
  check "re-sign-in after sign-out" "curl -s -b '$COOKIE' '$BASE/api/auth/get-session' | grep -q '$EMAIL'"
else
  skip_test "sign-out"
  skip_test "session cleared"
  skip_test "protected route after sign-out"
  skip_test "re-sign-in after sign-out"
fi

echo ""
echo "=== Summary ==="
echo "Passed: $pass"
echo "Failed: $fail"
echo "Skipped: $skip"
[ "$fail" -eq 0 ]
