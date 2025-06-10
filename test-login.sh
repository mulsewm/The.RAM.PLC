#!/bin/bash

# Clean up any existing cookie file
rm -f /tmp/auth_cookies.txt

# Test login with invalid credentials
echo "1. Testing with invalid credentials..."
curl -v -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com","password":"wrongpassword"}'

# Test login with invalid password
echo -e "\n\n2. Testing with invalid password..."
curl -v -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'

# Test login with valid credentials and save cookies
echo -e "\n\n3. Testing with valid credentials..."
LOGIN_RESPONSE=$(curl -v -X POST http://localhost:3001/api/auth/login \
  -c /tmp/auth_cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' 2>&1)

echo "Login response:"
echo "$LOGIN_RESPONSE" | grep -E '^<|^\{|^\['



if [ -z "$AUTH_TOKEN" ]; then
  echo -e "\n❌ Failed to extract auth token from login response"
  echo "Full response headers:"
  echo "$LOGIN_RESPONSE" | grep -i '^<'
  exit 1
fi

# Test session endpoint with valid session
echo -e "\n\n4. Testing session endpoint with valid session..."
SESSION_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -b "auth_token=$AUTH_TOKEN" http://localhost:3001/api/auth/session)

if [ "$SESSION_RESPONSE" = "200" ]; then
  echo "✅ Success: Session endpoint returned 200 OK with valid auth token"
  # Get the full response for the valid session
  echo "Session data:"
  curl -s -b "auth_token=$AUTH_TOKEN" http://localhost:3001/api/auth/session | jq .
else
  echo "❌ Error: Session endpoint returned $SESSION_RESPONSE with valid auth token"
  # Get the full response for debugging
  echo "Response:"
  curl -v -b "auth_token=$AUTH_TOKEN" http://localhost:3001/api/auth/session
fi

# Test session endpoint without session
echo -e "\n\n5. Testing session endpoint without session..."
NO_SESSION_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/auth/session)

if [ "$NO_SESSION_RESPONSE" = "401" ] || [ "$NO_SESSION_RESPONSE" = "403" ]; then
  echo "✅ Success: Session endpoint returned $NO_SESSION_RESPONSE without auth token (as expected)"
else
  echo "❌ Error: Expected 401 or 403 without auth token, got $NO_SESSION_RESPONSE"
  # Get the full response for debugging
  echo "Response:"
  curl -v http://localhost:3001/api/auth/session
fi

# Clean up
rm -f /tmp/auth_cookies.txt
