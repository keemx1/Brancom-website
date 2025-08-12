#!/bin/bash

echo "🚀 Brancom Website Deployment Script"
echo "====================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Check if git repository exists
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "⚠️  Please add your GitHub remote origin:"
    echo "   git remote add origin https://github.com/yourusername/brancom-website.git"
    echo "   git push -u origin main"
else
    echo "✅ Git repository already exists"
    echo "📤 Pushing latest changes..."
    git add .
    git commit -m "Update for deployment"
    git push
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Deploy backend to Railway: https://railway.app/"
echo "2. Deploy frontend to Vercel: https://vercel.com/"
echo "3. Update API URLs in frontend files"
echo "4. Configure environment variables"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "�� Happy deploying!"
