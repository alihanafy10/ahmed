#!/bin/bash

# Quick GitHub Push Script
# This script helps you push your project to GitHub

echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║              🚀 GitHub Push Helper Script                              ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

echo "✓ Git is installed"
echo ""

# Prompt for GitHub username
read -p "Enter your GitHub username: " github_username

# Prompt for repository name
read -p "Enter repository name (default: accident-report-system): " repo_name
repo_name=${repo_name:-accident-report-system}

echo ""
echo "Repository will be created at: https://github.com/$github_username/$repo_name"
echo ""

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✓ Git repository initialized"
else
    echo "✓ Git repository already exists"
fi

echo ""
echo "📝 Adding files to git..."
git add .

echo ""
echo "💾 Creating commit..."
git commit -m "Initial commit: Accident Report System with multimedia support"

echo ""
echo "🌿 Ensuring branch is named 'main'..."
git branch -M main

echo ""
echo "🔗 Adding GitHub remote..."
git remote remove origin 2>/dev/null  # Remove if exists
git remote add origin https://github.com/$github_username/$repo_name.git

echo ""
echo "✓ Remote added successfully"
echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║                     📤 READY TO PUSH                                   ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Create a repository named: $repo_name"
echo "3. DO NOT initialize with README, .gitignore, or license"
echo "4. Then run: git push -u origin main"
echo ""
echo "Or run the following command now if repository already exists:"
echo "  git push -u origin main"
echo ""
