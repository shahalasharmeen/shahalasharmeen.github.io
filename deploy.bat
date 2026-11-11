@echo off
echo ===================================================
echo  Deploying Sahla Sharmeen Portfolio to GitHub Pages
echo ===================================================
echo.

git add .
git commit -m "Deploy Resume & Bio-Data website to GitHub Pages"

echo.
echo Please confirm your GitHub remote repository URL.
echo Example 1: https://github.com/shahalasharmeen/shahalasharmeen.github.io.git
echo Example 2: https://github.com/shahalasharmeen/portfolio.git
echo.
set /p REPO_URL="Enter GitHub Repository URL (or press Enter if remote origin is already set): "

if not "%REPO_URL%"=="" (
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
)

echo.
echo Pushing branch 'main' to GitHub...
git push -u origin main

echo.
echo Deployment command completed!
echo If your repository is named username.github.io, your site will be live at:
echo https://shahalasharmeen.github.io/
echo.
pause
