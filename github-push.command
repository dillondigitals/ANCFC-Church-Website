#!/bin/bash
echo "=== Pushing ANCFC-Church-Website to GitHub ==="
echo ""

cd "$(dirname "$0")"

# Remove LFS config that might cause issues
git lfs uninstall --local 2>/dev/null
git config --local --remove-section lfs 2>/dev/null

# Check if repo exists on GitHub, create if needed
if command -v gh &> /dev/null; then
    echo "Checking if GitHub repo exists..."
    if ! gh repo view dillondigitals/ANCFC-Church-Website &>/dev/null; then
        echo "Creating GitHub repo..."
        gh repo create ANCFC-Church-Website --public --source=. --remote=origin
    else
        echo "GitHub repo already exists."
    fi
fi

# Ensure remote is set
git remote get-url origin &>/dev/null || git remote add origin https://github.com/dillondigitals/ANCFC-Church-Website.git

echo "Pushing to GitHub..."
git push -u origin main 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "==================================="
    echo "Push successful!"
    echo "Repo: https://github.com/dillondigitals/ANCFC-Church-Website"
    echo "==================================="
else
    echo ""
    echo "Push failed. Trying with force..."
    git push -u origin main --force 2>&1
    if [ $? -eq 0 ]; then
        echo ""
        echo "==================================="
        echo "Push successful (forced)!"
        echo "Repo: https://github.com/dillondigitals/ANCFC-Church-Website"
        echo "==================================="
    else
        echo ""
        echo "==================================="
        echo "ERROR: Push failed."
        echo "You may need to run: gh auth login"
        echo "Then try again."
        echo "==================================="
    fi
fi

echo ""
echo "Press any key to close..."
read -n 1
