#!/usr/bin/env bash
# Deploy script for GitHub Pages
echo "==================================================="
echo " Deploying Sahla Sharmeen Portfolio to GitHub Pages"
echo "==================================================="

git add .
git commit -m "Deploy Resume & Bio-Data website to GitHub Pages"

read -p "Enter GitHub Repository URL (or press Enter if origin is set): " REPO_URL

if [ -n "$REPO_URL" ]; then
    git remote remove origin 2>/dev/null
    git remote add origin "$REPO_URL"
fi

git push -u origin main
echo "Deployment push finished!"
