@echo off
REM Quick GitHub Push Script for Windows
REM This script helps you push your project to GitHub

echo ========================================================================
echo              🚀 GitHub Push Helper Script
echo ========================================================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install git first.
    pause
    exit /b 1
)

echo ✓ Git is installed
echo.

REM Prompt for GitHub username
set /p github_username="Enter your GitHub username: "

REM Prompt for repository name
set /p repo_name="Enter repository name (default: accident-report-system): "
if "%repo_name%"=="" set repo_name=accident-report-system

echo.
echo Repository will be created at: https://github.com/%github_username%/%repo_name%
echo.

REM Initialize git if not already initialized
if not exist .git (
    echo 📦 Initializing git repository...
    git init
    echo ✓ Git repository initialized
) else (
    echo ✓ Git repository already exists
)

echo.
echo 📝 Adding files to git...
git add .

echo.
echo 💾 Creating commit...
git commit -m "Initial commit: Accident Report System with multimedia support"

echo.
echo 🌿 Ensuring branch is named 'main'...
git branch -M main

echo.
echo 🔗 Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/%github_username%/%repo_name%.git

echo.
echo ✓ Remote added successfully
echo.
echo ========================================================================
echo                     📤 READY TO PUSH
echo ========================================================================
echo.
echo Next steps:
echo 1. Go to https://github.com/new
echo 2. Create a repository named: %repo_name%
echo 3. DO NOT initialize with README, .gitignore, or license
echo 4. Then run: git push -u origin main
echo.
echo Or run the following command now if repository already exists:
echo   git push -u origin main
echo.
pause
