#!/bin/bash
echo "=== Adding Custom Domain to Netlify ==="
echo ""

# Find Netlify auth token
TOKEN=""
CONFIG_FILE="$HOME/.netlify/config.json"
STATE_FILE="$HOME/.config/netlify/config.json"

if [ -f "$CONFIG_FILE" ]; then
    TOKEN=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE')).get('users',{}).get(list(json.load(open('$CONFIG_FILE')).get('users',{}).keys())[0],{}).get('auth',{}).get('token',''))" 2>/dev/null)
fi

if [ -z "$TOKEN" ] && [ -f "$STATE_FILE" ]; then
    TOKEN=$(python3 -c "import json; print(json.load(open('$STATE_FILE')).get('users',{}).get(list(json.load(open('$STATE_FILE')).get('users',{}).keys())[0],{}).get('auth',{}).get('token',''))" 2>/dev/null)
fi

if [ -z "$TOKEN" ]; then
    # Try to find token in any netlify config
    TOKEN=$(find "$HOME" -path "*/netlify*config*" -name "*.json" 2>/dev/null | head -5 | while read f; do
        python3 -c "
import json
d = json.load(open('$f'))
def find_token(obj):
    if isinstance(obj, dict):
        if 'token' in obj and isinstance(obj['token'], str) and len(obj['token']) > 20:
            print(obj['token'])
            return
        for v in obj.values():
            find_token(v)
find_token(d)
" 2>/dev/null
    done | head -1)
fi

if [ -z "$TOKEN" ]; then
    echo "ERROR: Could not find Netlify auth token."
    echo "Please run: netlify login"
    echo ""
    echo "Press any key to close..."
    read -n 1
    exit 1
fi

echo "Found Netlify token."
SITE_ID="8f502b09-a269-48d6-9510-e7ace0c6e398"

echo ""
echo "Adding ancfcglobal.org..."
RESULT=$(curl -s -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/domain_aliases" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"domain": "ancfcglobal.org"}')
echo "Response: $RESULT"

echo ""
echo "Adding www.ancfcglobal.org..."
RESULT2=$(curl -s -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/domain_aliases" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"domain": "www.ancfcglobal.org"}')
echo "Response: $RESULT2"

echo ""
echo "Checking site domains..."
SITE_INFO=$(curl -s "https://api.netlify.com/api/v1/sites/$SITE_ID" \
    -H "Authorization: Bearer $TOKEN")
echo "$SITE_INFO" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('Site URL:', data.get('url', 'N/A'))
print('Custom domain:', data.get('custom_domain', 'N/A'))
aliases = data.get('domain_aliases', [])
if aliases:
    print('Domain aliases:', ', '.join(aliases))
ssl = data.get('ssl', {})
print('SSL:', 'enabled' if data.get('ssl_url') else 'not yet')
" 2>/dev/null

echo ""
echo "=========================================="
echo "Domain added to Netlify!"
echo ""
echo "NOW UPDATE GODADDY DNS:"
echo "1. Go to GoDaddy DNS tab for ancfcglobal.org"
echo "2. Delete any existing A records"
echo "3. Add A record:  @ -> 75.2.60.5"
echo "4. Add CNAME:     www -> ancfc-church.netlify.app"
echo "=========================================="
echo ""
echo "Press any key to close..."
read -n 1
