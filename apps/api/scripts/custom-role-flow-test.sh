#!/usr/bin/env bash
# End-to-end custom (dynamic) organization roles against a running API.
# Covers: create role → invite → accept → assign → allow/deny via hasPermission.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="${API_URL:-http://localhost:4000}"
ORIGIN="${AUTH_ORIGIN:-http://localhost:5173}"
STAMP="$(date +%s)"
OWNER_EMAIL="owner-${STAMP}@example.com"
MEMBER_EMAIL="contractor-${STAMP}@example.com"
PASS="TestPass123!"
OWNER_COOKIE="$(mktemp)"
MEMBER_COOKIE="$(mktemp)"
trap 'rm -f "$OWNER_COOKIE" "$MEMBER_COOKIE"' EXIT

pass=0
fail=0

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

mint_verify_token() {
  (cd "$SCRIPT_DIR/.." && node "$SCRIPT_DIR/create-verify-token.mjs" "$1" 2>/dev/null) \
    | tr -d '\r\n' \
    | tail -n 1
}

signup_verify_signin() {
  local email="$1"
  local cookie="$2"
  curl -sf -X POST "$BASE/api/auth/sign-up/email" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$email\",\"password\":\"$PASS\",\"name\":\"User\"}" >/dev/null
  local token
  token="$(mint_verify_token "$email")"
  curl -sf -c "$cookie" -b "$cookie" "$BASE/api/auth/verify-email?token=$token" >/dev/null
  curl -sf -c "$cookie" -b "$cookie" -X POST "$BASE/api/auth/sign-in/email" \
    -H 'Content-Type: application/json' \
    -H "Origin: $ORIGIN" \
    -d "{\"email\":\"$email\",\"password\":\"$PASS\"}" >/dev/null
}

echo "=== Custom role flow ==="
echo "Owner:  $OWNER_EMAIL"
echo "Member: $MEMBER_EMAIL"
echo ""

signup_verify_signin "$OWNER_EMAIL" "$OWNER_COOKIE"
signup_verify_signin "$MEMBER_EMAIL" "$MEMBER_COOKIE"

ORG=$(curl -s -b "$OWNER_COOKIE" -c "$OWNER_COOKIE" -X POST "$BASE/api/auth/organization/create" \
  -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
  -d "{\"name\":\"Role Org\",\"slug\":\"role-org-${STAMP}\"}")
ORG_ID=$(printf '%s' "$ORG" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
check "owner creates organization" "test -n '$ORG_ID'"

CREATE_ROLE=$(curl -s -b "$OWNER_COOKIE" -c "$OWNER_COOKIE" -X POST \
  "$BASE/api/auth/organization/create-role" \
  -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
  -d '{"role":"contractor","permission":{"project":["read","update"],"report":["create","read"],"member":["read"]}}')
check "owner creates contractor role" "echo '$CREATE_ROLE' | grep -q '\"success\":true'"
check "list-roles includes contractor" \
  "curl -s -b '$OWNER_COOKIE' -H 'Origin: $ORIGIN' '$BASE/api/auth/organization/list-roles' | grep -q contractor"

# Creator cannot invent permissions outside the AC statement
INVALID_ROLE=$(curl -s -b "$OWNER_COOKIE" -c "$OWNER_COOKIE" -X POST \
  "$BASE/api/auth/organization/create-role" \
  -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
  -d '{"role":"hacker","permission":{"project":["teleport"]}}')
check "invalid permission action rejected" \
  "echo '$INVALID_ROLE' | grep -qiE 'invalid|VALIDATION|not allowed|permission'"

INVITE=$(curl -s -b "$OWNER_COOKIE" -c "$OWNER_COOKIE" -X POST \
  "$BASE/api/auth/organization/invite-member" \
  -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
  -d "{\"email\":\"$MEMBER_EMAIL\",\"role\":\"contractor\"}")
INVITE_ID=$(printf '%s' "$INVITE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
check "owner invites user as contractor" "test -n '$INVITE_ID'"

ACCEPT=$(curl -s -b "$MEMBER_COOKIE" -c "$MEMBER_COOKIE" -X POST \
  "$BASE/api/auth/organization/accept-invitation" \
  -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
  -d "{\"invitationId\":\"$INVITE_ID\"}")
check "member accepts contractor invitation" "echo '$ACCEPT' | grep -qiE 'member|success|organization|contractor|id'"

curl -sf -b "$MEMBER_COOKIE" -c "$MEMBER_COOKIE" -X POST \
  "$BASE/api/auth/organization/set-active" \
  -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
  -d "{\"organizationId\":\"$ORG_ID\"}" >/dev/null

ACTIVE=$(curl -s -b "$MEMBER_COOKIE" -H "Origin: $ORIGIN" \
  "$BASE/api/auth/organization/get-active-member")
check "active member role is contractor" "echo '$ACTIVE' | grep -q contractor"

ALLOW_READ=$(curl -s -b "$MEMBER_COOKIE" -H "Origin: $ORIGIN" -X POST \
  "$BASE/api/auth/organization/has-permission" \
  -H 'Content-Type: application/json' \
  -d '{"permissions":{"project":["read"]}}')
check "contractor can project:read" "echo '$ALLOW_READ' | grep -q '\"success\":true'"

ALLOW_UPDATE=$(curl -s -b "$MEMBER_COOKIE" -H "Origin: $ORIGIN" -X POST \
  "$BASE/api/auth/organization/has-permission" \
  -H 'Content-Type: application/json' \
  -d '{"permissions":{"project":["update"]}}')
check "contractor can project:update" "echo '$ALLOW_UPDATE' | grep -q '\"success\":true'"

DENY_DELETE=$(curl -s -b "$MEMBER_COOKIE" -H "Origin: $ORIGIN" -X POST \
  "$BASE/api/auth/organization/has-permission" \
  -H 'Content-Type: application/json' \
  -d '{"permissions":{"project":["delete"]}}')
check "contractor cannot project:delete" "echo '$DENY_DELETE' | grep -q '\"success\":false'"

DENY_INVITE=$(curl -s -b "$MEMBER_COOKIE" -H "Origin: $ORIGIN" -X POST \
  "$BASE/api/auth/organization/has-permission" \
  -H 'Content-Type: application/json' \
  -d '{"permissions":{"invitation":["create"]}}')
check "contractor cannot invitation:create" "echo '$DENY_INVITE' | grep -q '\"success\":false'"

DENY_AC=$(curl -s -b "$MEMBER_COOKIE" -H "Origin: $ORIGIN" -X POST \
  "$BASE/api/auth/organization/has-permission" \
  -H 'Content-Type: application/json' \
  -d '{"permissions":{"ac":["create"]}}')
check "contractor cannot ac:create (no custom roles)" \
  "echo '$DENY_AC' | grep -q '\"success\":false'"

MEMBER_CREATE_ROLE=$(curl -s -b "$MEMBER_COOKIE" -c "$MEMBER_COOKIE" -X POST \
  "$BASE/api/auth/organization/create-role" \
  -H 'Content-Type: application/json' -H "Origin: $ORIGIN" \
  -d '{"role":"rogue","permission":{"project":["read"]}}')
check "contractor blocked from create-role" \
  "echo '$MEMBER_CREATE_ROLE' | grep -qiE 'not allowed|YOU_ARE_NOT|FORBIDDEN|permission'"

# Owner still has full org admin capabilities
OWNER_INVITE=$(curl -s -b "$OWNER_COOKIE" -H "Origin: $ORIGIN" -X POST \
  "$BASE/api/auth/organization/has-permission" \
  -H 'Content-Type: application/json' \
  -d '{"permissions":{"invitation":["create"]}}')
check "owner still has invitation:create" "echo '$OWNER_INVITE' | grep -q '\"success\":true'"

echo ""
echo "=== Summary ==="
echo "Passed: $pass"
echo "Failed: $fail"
[ "$fail" -eq 0 ]
