#!/bin/bash
echo "=== Deploying ANCFC Church Website to Netlify ==="
echo ""

# Find the Netlify auth token
TOKEN=$(python3 << 'PYEOF'
import json, os, glob
search_paths = [
    os.path.expanduser("~/.netlify/config.json"),
    os.path.expanduser("~/.config/netlify/config.json"),
    os.path.expanduser("~/Library/Preferences/netlify/config.json"),
]
for pattern in ["~/.netlify/**/*.json", "~/.config/netlify/**/*.json"]:
    search_paths.extend(glob.glob(os.path.expanduser(pattern), recursive=True))
for p in search_paths:
    try:
        with open(p) as f:
            data = json.load(f)
            if isinstance(data, dict):
                if 'token' in data:
                    print(data['token']); exit()
                if 'users' in data:
                    for uid, udata in data['users'].items():
                        if isinstance(udata, dict):
                            if 'auth' in udata and 'token' in udata['auth']:
                                print(udata['auth']['token']); exit()
                            if 'token' in udata:
                                print(udata['token']); exit()
                if 'userId' in data:
                    uid = data['userId']
                    if 'users' in data and uid in data['users']:
                        t = data['users'][uid].get('auth',{}).get('token','')
                        if t: print(t); exit()
    except:
        pass
PYEOF
)

if [ -z "$TOKEN" ]; then
    echo "ERROR: Could not find Netlify auth token."
    echo "Please run: npx -y netlify-cli login"
    echo "Then try again."
    echo ""
    echo "Press any key to close..."
    read -n 1
    exit 1
fi

echo "Found Netlify auth token."

SITE_ID="8f502b09-a269-48d6-9510-e7ace0c6e398"

# Zip the site
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$SCRIPT_DIR/site"
ZIP_PATH="/tmp/ancfc-deploy.zip"

echo "Zipping site files..."
cd "$SITE_DIR"
zip -r "$ZIP_PATH" . -x "*.DS_Store" -x "test-*" -x "site-deploy.zip" -x "zimFWkvg" > /dev/null 2>&1

# Deploy
echo "Deploying to Netlify..."
DEPLOY_RESPONSE=$(curl -s -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/zip" \
    --data-binary "@$ZIP_PATH")

DEPLOY_URL=$(echo "$DEPLOY_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('ssl_url',''))")
DEPLOY_STATE=$(echo "$DEPLOY_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('state',''))")

echo ""
echo "==================================="
echo "Deployment complete!"
echo "URL: $DEPLOY_URL"
echo "State: $DEPLOY_STATE"
echo "==================================="
echo ""
echo "Press any key to close..."
read -n 1
