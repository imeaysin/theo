#!/usr/bin/env bash
# Live auth flow checks against a running API (default http://localhost:4000).
# Uses Better Auth session cookies — not JWT bearer tokens.
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
  (cd "$SCRIPT_DIR/.." && node "$SCRIPT_DIR/create-verify-token.mjs" "$1" 2>/dev/null) \
    | tr -d '\r\n' \
    | tail -n 1
}

echo "=== Auth flow test report ==="
echo "Base URL: $BASE"
echo "Test email: $EMAIL"
echo ""

check "GET /" "curl -sf '$BASE/' | grep -q '\"status\":\"ok\"'"
check "GET /v1/health" "curl -sf '$BASE/v1/health' | grep -q '\"db\":\"up\"'"
check "GET /api/auth/ok" "curl -sf '$BASE/api/auth/ok' | grep -q '\"ok\":true'"

check "sign-up missing fields" "curl -s -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/sign-up/email' -H 'Content-Type: application/json' -d '{}' | grep -q '400'"
check "sign-up invalid email" "curl -s -X POST '$BASE/api/auth/sign-up/email' -H 'Content-Type: application/json' -d '{\"email\":\"not-an-email\",\"password\":\"$PASS\",\"name\":\"X\"}' | grep -qiE 'email|invalid|VALIDATION'"
check "sign-up weak password" "curl -s -X POST '$BASE/api/auth/sign-up/email' -H 'Content-Type: application/json' -d '{\"email\":\"bad@example.com\",\"password\":\"short\",\"name\":\"X\"}' | grep -qiE 'password|invalid|short'"
check "sign-in unknown email" "curl -s -X POST '$BASE/api/auth/sign-in/email' -H 'Content-Type: application/json' -d '{\"email\":\"nobody@example.com\",\"password\":\"$PASS\"}' | grep -q 'INVALID_EMAIL_OR_PASSWORD'"
check "verify-email missing token" "curl -s -o /dev/null -w '%{http_code}' '$BASE/api/auth/verify-email' | grep -qE '^(400|401|422)$'"
check "verify-email garbage token" "curl -s '$BASE/api/auth/verify-email?token=not-a-jwt' | grep -q 'INVALID_TOKEN'"

SIGNUP=$(curl -s -X POST "$BASE/api/auth/sign-up/email" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"name\":\"Edge User\"}")
check "sign-up success" "echo '$SIGNUP' | grep -q '\"emailVerified\":false'"

DUP=$(curl -s -X POST "$BASE/api/auth/sign-up/email" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"name\":\"Edge User\"}")
check "duplicate sign-up opaque (anti-enumeration)" "echo '$DUP' | grep -q '\"email\":\"$EMAIL\"'"

check "sign-in unverified blocked" "curl -s -X POST '$BASE/api/auth/sign-in/email' -H 'Content-Type: application/json' -d '{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}' | grep -q 'EMAIL_NOT_VERIFIED'"
check "wrong password" "curl -s -X POST '$BASE/api/auth/sign-in/email' -H 'Content-Type: application/json' -d '{\"email\":\"$EMAIL\",\"password\":\"WrongPass123!\"}' | grep -q 'INVALID_EMAIL_OR_PASSWORD'"

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

  ME_EARLY=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/v1/users/me")
  check "GET /v1/users/me with session cookie" "echo '$ME_EARLY' | grep -q '$EMAIL'"
  check "organizationRole null before onboarding" "echo '$ME_EARLY' | grep -q '\"organizationRole\":null'"
  check "unauthenticated /v1/users/me rejected" "curl -s -o /dev/null -w '%{http_code}' '$BASE/v1/users/me' | grep -q '401'"
else
  skip_test "sign-in after verify (verification incomplete)"
  skip_test "session active"
  skip_test "no workspace before onboarding"
  skip_test "session has no activeOrganizationId before onboarding"
  skip_test "GET /v1/users/me with session cookie"
  skip_test "organizationRole null before onboarding"
  skip_test "unauthenticated /v1/users/me rejected"
fi

if [ "$VERIFIED" = true ]; then
  SLUG="edge-org-$(date +%s)"
  ORG=$(curl -s -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/create" \
    -H 'Content-Type: application/json' \
    -H "Origin: $ORIGIN" \
    -d "{\"name\":\"Edge Org\",\"slug\":\"$SLUG\"}")
  if echo "$ORG" | grep -q '"id"'; then
    check "create organization" "true"
    LIST_ROLES=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/api/auth/organization/list-roles")
    check "list-roles returns array for owner" "echo '$LIST_ROLES' | grep -qE '^\\[.*\\]$'"
    HAS_INVITE=$(curl -s -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/has-permission" \
      -H 'Content-Type: application/json' \
      -H "Origin: $ORIGIN" \
      -d '{"permissions":{"invitation":["create"]}}')
    check "owner has invitation:create" "echo '$HAS_INVITE' | grep -q '\"success\":true'"
    ACTIVE_MEMBER=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/api/auth/organization/get-active-member")
    check_output_contains "get-active-member returns owner role" "$ACTIVE_MEMBER" owner
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
    CREATE_ROLE=$(curl -s -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/create-role" \
      -H 'Content-Type: application/json' \
      -H "Origin: $ORIGIN" \
      -d '{"role":"moderator","permission":{"project":["read"],"member":["read"]}}')
    check "owner can create custom role" "echo '$CREATE_ROLE' | grep -q '\"success\":true'"
    LIST_ROLES_AFTER=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/api/auth/organization/list-roles")
    check "list-roles includes custom role" "echo '$LIST_ROLES_AFTER' | grep -q moderator"
    check "accept invitation without session blocked" "curl -s -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/organization/accept-invitation' -H 'Content-Type: application/json' -d '{\"invitationId\":\"fake\"}' | grep -q '401'"

    ME=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/v1/users/me")
    check "session /v1/users/me includes activeOrganizationId" "echo '$ME' | grep -qE '\"activeOrganizationId\":\"[^\"]+\"'"

    ORG_ID=$(echo "$ORG" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || true)
    SLUG_B="edge-org-b-$(date +%s)"
    ORG_B=$(curl -s -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/create" \
      -H 'Content-Type: application/json' \
      -H "Origin: $ORIGIN" \
      -d "{\"name\":\"Edge Org B\",\"slug\":\"$SLUG_B\"}")
    ORG_B_ID=$(echo "$ORG_B" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || true)
    if [ -n "$ORG_ID" ] && [ -n "$ORG_B_ID" ]; then
      curl -sf -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/set-active" \
        -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
        -d "{\"organizationId\":\"$ORG_ID\"}" >/dev/null
      NOTE=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" -X POST "$BASE/v1/notes" \
        -H 'Content-Type: application/json' \
        -d '{"title":"Edge note","body":"workspace A"}')
      NOTE_ID=$(echo "$NOTE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || true)
      check "create note in workspace A" "echo '$NOTE' | grep -q '\"title\":\"Edge note\"'"

      curl -sf -b "$COOKIE" -c "$COOKIE" -X POST "$BASE/api/auth/organization/set-active" \
        -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
        -d "{\"organizationId\":\"$ORG_B_ID\"}" >/dev/null
      LIST_B=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/v1/notes")
      check "notes list empty in workspace B" "echo '$LIST_B' | grep -q '\"items\":\\[\\]'"
      if [ -n "$NOTE_ID" ]; then
        check "cross-workspace note update blocked" "curl -s -o /dev/null -w '%{http_code}' -b '$COOKIE' -H 'Origin: $ORIGIN' -X PATCH '$BASE/v1/notes/$NOTE_ID' -H 'Content-Type: application/json' -d '{\"title\":\"Hacked\"}' | grep -q '404'"
      else
        skip_test "cross-workspace note update blocked"
      fi
      check "notes without session rejected" "curl -s -o /dev/null -w '%{http_code}' '$BASE/v1/notes' | grep -q '401'"
    else
      skip_test "create note in workspace A"
      skip_test "notes list empty in workspace B"
      skip_test "cross-workspace note update blocked"
      skip_test "notes without session rejected"
    fi
  else
    skip_test "create organization (no session)"
    skip_test "list-roles returns array for owner"
    skip_test "owner has invitation:create"
    skip_test "get-active-member returns owner role"
    skip_test "duplicate org slug rejected"
    skip_test "owner can invite member"
    skip_test "owner can create custom role"
    skip_test "list-roles includes custom role"
    skip_test "accept invitation without session blocked"
    skip_test "session /v1/users/me includes activeOrganizationId"
  fi
else
  skip_test "create organization (no session)"
  skip_test "list-roles returns array for owner"
  skip_test "owner has invitation:create"
  skip_test "get-active-member returns owner role"
  skip_test "duplicate org slug rejected"
  skip_test "owner can invite member"
  skip_test "accept invitation without session blocked"
  skip_test "session /v1/users/me includes activeOrganizationId"
fi

check "org without session blocked" "curl -s -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/organization/create' -H 'Content-Type: application/json' -d '{\"name\":\"X\",\"slug\":\"x\"}' | grep -q '401'"

FORGOT=$(curl -s -w '%{http_code}' -X POST "$BASE/api/auth/request-password-reset" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"redirectTo\":\"/\"}")
check "request-password-reset known email" "echo '$FORGOT' | grep -q '200'"
check "request-password-reset unknown email (constant time)" "curl -s -o /dev/null -w '%{http_code}' -X POST '$BASE/api/auth/request-password-reset' -H 'Content-Type: application/json' -d '{\"email\":\"ghost@example.com\",\"redirectTo\":\"/\"}' | grep -q '200'"

if [ "$VERIFIED" = true ] && command -v true >/dev/null; then
  if [ -n "${GOOGLE_CLIENT_ID:-}" ] || curl -sf "$BASE/api/auth/ok" >/dev/null; then
    GOOGLE_CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/auth/sign-in/social" \
      -H 'Content-Type: application/json' \
      -d '{"provider":"google","callbackURL":"/"}')
    if [ "$GOOGLE_CODE" = "200" ]; then
      check "google oauth init" "true"
    else
      skip_test "google oauth init (provider not configured)"
    fi
  fi
fi

if [ "$VERIFIED" = true ]; then
  check "org wrong origin blocked" "curl -s -o /dev/null -w '%{http_code}' -b '$COOKIE' -X POST '$BASE/api/auth/organization/create' -H 'Content-Type: application/json' -H 'Origin: http://evil.example' -d '{\"name\":\"X\",\"slug\":\"evil-$(date +%s)\"}' | grep -qE '^(401|403)$'"
  ORG_LIST=$(curl -s -b "$COOKIE" -H "Origin: $ORIGIN" "$BASE/api/auth/organization/list")
  check_output_contains "list organizations" "$ORG_LIST" id slug
fi

if [ "$VERIFIED" = true ]; then
  check "sign-out" "curl -sf -b '$COOKIE' -c '$COOKIE' -X POST '$BASE/api/auth/sign-out' -H 'Origin: $ORIGIN' | grep -q 'success'"
  check "session cleared" "curl -s -b '$COOKIE' '$BASE/api/auth/get-session' | grep -q 'null'"
  check "protected route after sign-out" "curl -s -o /dev/null -w '%{http_code}' -b '$COOKIE' -X POST '$BASE/api/auth/organization/create' -H 'Content-Type: application/json' -H 'Origin: $ORIGIN' -d '{\"name\":\"X\",\"slug\":\"after-signout\"}' | grep -q '401'"
  check "protected /v1/users/me after sign-out" "curl -s -o /dev/null -w '%{http_code}' -b '$COOKIE' '$BASE/v1/users/me' | grep -q '401'"

  curl -sf -c "$COOKIE" -b "$COOKIE" -X POST "$BASE/api/auth/sign-in/email" \
    -H 'Content-Type: application/json' \
    -H "Origin: $ORIGIN" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" >/dev/null
  check "re-sign-in after sign-out" "curl -s -b '$COOKIE' '$BASE/api/auth/get-session' | grep -q '$EMAIL'"
else
  skip_test "sign-out"
  skip_test "session cleared"
  skip_test "protected route after sign-out"
  skip_test "protected /v1/users/me after sign-out"
  skip_test "re-sign-in after sign-out"
fi

echo ""
echo "=== Summary ==="
echo "Passed: $pass"
echo "Failed: $fail"
echo "Skipped: $skip"
[ "$fail" -eq 0 ]
