# Project Transfer Guide

This guide provides comprehensive instructions for transferring and setting up the entire project on a new computer.

## Prerequisites

### Development Tools
1. Python 3.x
2. Node.js (v16 or higher)
3. Java Development Kit (JDK) 11 or higher
4. Android Studio
5. Git
6. VSCode (recommended) or preferred IDE

## Step 1: GitHub Setup

1. Push existing project to GitHub (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [your-github-repo-url]
   git push -u origin main
   ```

2. Clone on new computer:
   ```bash
   git clone [your-github-repo-url]
   cd excited
   ```

## Step 2: Backend Setup

1. Create Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   
   # Activate on Windows:
   venv\Scripts\activate
   # OR on macOS/Linux:
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment:
   - Copy `.env.example` to `.env`
   - Update the following in `.env`:
     * OpenWeather API key
     * Cache settings
     * Redis settings (if using Redis)
     * Other environment-specific settings

## Step 3: Mobile Setup

1. Install Node.js dependencies:
   ```bash
   cd mobile
   npm install
   ```

2. Android Setup:
   - Install Android Studio
   - Install required SDK components (detailed in mobile/userInstructions/setup.md):
     * Android SDK Platform 33
     * Android SDK Build-Tools
     * Android Virtual Device
   
   - Create `mobile/android/local.properties`:
     ```properties
     # Windows
     sdk.dir=C:\\Users\\[YourUsername]\\AppData\\Local\\Android\\Sdk
     # macOS
     sdk.dir=/Users/[YourUsername]/Library/Android/sdk
     ```

3. Configure Environment Variables:
   ```bash
   # Windows (System Environment Variables)
   ANDROID_HOME=C:\Users\[YourUsername]\AppData\Local\Android\Sdk
   Path=%ANDROID_HOME%\platform-tools

   # macOS/Linux (~/.bash_profile or ~/.zshrc)
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

4. Weather API Setup:
   - Create `.env.local` in mobile directory with API keys:
     ```
     TOMORROW_API_KEY=your_key_here
     OPENWEATHER_API_KEY=your_key_here
     MAPS_API_KEY=your_key_here
     ```

## Step 4: IDE Setup

1. VSCode Extensions (recommended):
   - Python
   - React Native Tools
   - ESLint
   - Prettier
   - GitLens

2. Android Studio Setup:
   - Import android project from mobile/android
   - Sync gradle files
   - Create Android Virtual Device (AVD)

## Running the Project

1. Backend:
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   python main.py
   ```

2. Mobile:
   ```bash
   cd mobile
   # Terminal 1: Start Metro
   npm start
   
   # Terminal 2: Run Android
   npm run android
   ```

## Troubleshooting

See the following documentation for common issues:
- mobile/userInstructions/setup.md
- mobile/android/README.md
- cline_docs/android_build_fixes.md

## Files Not in Git (Need Manual Transfer/Setup)

1. Environment Files:
   - backend/.env
   - mobile/.env.local

2. Build/Cache Directories (will be regenerated):
   - node_modules/
   - android/build/
   - ios/Pods/
   - __pycache__/
   - venv/

3. IDE Settings:
   - .vscode/
   - .idea/

4. Local Configuration:
   - mobile/android/local.properties

## Version Control

The project uses multiple .gitignore files:
- Root .gitignore: Project-wide exclusions
- mobile/.gitignore: React Native specific exclusions
- backend/.gitignore: Python specific exclusions

Refer to these files when troubleshooting missing files after transfer.
