# Project Bootstrap Guide

## Environment Setup

### Common JSON Issues

If you encounter JSON-related errors during deployment, use the fix-json-files script:

```bash
cd scripts
./fix-json-files.sh
```

This script handles:
1. Git merge conflict markers in JSON files
2. @ symbol references in vercel.json
3. JSON syntax validation

Common JSON errors:
1. **Merge Conflict Markers**
   - Error: `Can't parse json file: Expected double-quoted property name in JSON`
   - Solution: Run fix-json-files.sh to remove merge conflict markers

2. **@ Symbol References**
   - Error: `Environment Variable references Secret`
   - Solution: Script converts @variable_name to ${VARIABLE_NAME}

### Vercel Environment Variables

If you encounter issues with Vercel environment variables not being recognized (especially with @ symbol references), follow these steps:

1. Run the fix-vercel-env script:
```bash
cd scripts
./fix-vercel-env.sh
```

This script will:
- Create a backup of your vercel.json
- Replace any @variable_name references with ${VARIABLE_NAME}
- Show you the updated environment variables section

2. After running the script, commit and push the changes:
```bash
git add vercel.json
git commit -m "fix: update environment variable references"
git push
```

3. Verify the deployment in Vercel:
- Check your PR for a new Vercel deployment
- Inspect the deployment logs for environment variable issues
- Confirm that Supabase preview branch is created

## Deployment Troubleshooting Log

### 1. JSON Configuration Issues

#### Problem: Package JSON Merge Conflicts
Error: `Can't parse json file /vercel/path0/package.json: Expected double-quoted property name in JSON`
Solution:
```bash
# Clean and regenerate dependencies
rm -rf .next node_modules package-lock.json
npm install

# Commit changes
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
git push
```

#### Problem: Vercel JSON Environment Variables
Error: `Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret`
Solution:
```json
// vercel.json - Simplified configuration
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 2. Build Configuration Issues

#### Problem: PostCSS Configuration
Error: `Your custom PostCSS configuration must export a plugins key`
Solution:
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### Problem: Missing Dependencies
Error: `Cannot find module 'dotenv'`
Solution:
```bash
# Install development dependencies
npm install dotenv --save-dev

# Commit changes
git add package.json package-lock.json
git commit -m "fix: add dotenv dependency"
git push
```

Error: `Cannot find module '@vercel/postgres'`
Solution:
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Commit changes
git add package.json package-lock.json
git commit -m "fix: add @vercel/postgres dependency"
git push
```

### 3. Deployment Recovery Steps

If deployment fails, follow these steps in order:

1. Clean local environment:
```bash
rm -rf .next node_modules package-lock.json
```

2. Reinstall dependencies:
```bash
npm install
```

3. Verify local build:
```bash
npm run build
```

4. If build succeeds locally but fails on Vercel:
```bash
# Force a clean deployment
vercel deploy --prod
```

### 4. Vercel Project Linking

If Vercel CLI commands fail:

1. Link project:
```bash
vercel link
```

2. Pull environment variables:
```bash
vercel env pull .env.local
```

3. Verify project status:
```bash
vercel ls
```

## Script Details

### fix-json-files.sh

The script handles multiple JSON-related issues:
- Removes Git merge conflict markers
- Fixes @ symbol references in vercel.json
- Validates JSON syntax
- Creates backups before making changes
- Example merge conflict fix:
  ```json
  // Before
  {
  <<<<<<< HEAD
    "version": "1.0.0"
  =======
    "version": "2.0.0"
  >>>>>>> main
  }
  
  // After
  {
    "version": "1.0.0"
  }
  ```

### fix-vercel-env.sh

The script uses `sed` to transform environment variable references:
- Matches @variable_name pattern
- Converts to ${VARIABLE_NAME} format
- Creates backup before making changes
- Example transformation:
  ```json
  // Before
  "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url"
  
  // After
  "NEXT_PUBLIC_SUPABASE_URL": "${NEXT_PUBLIC_SUPABASE_URL}"
  ``` 

## SS4 Project Bootstrap

This document outlines the steps to bootstrap the SS4 project from scratch and includes successful fixes for common issues.

### Prerequisites

- Node.js >= 18.17.0
- npm
- git
- Vercel CLI

### Initial Setup

1. Clone the repository
```bash
git clone https://github.com/your-org/p1.git
cd p1
```

2. Set up the development branch
```bash
git checkout -b feat/saas-template-setup
```

3. Initialize the project
```bash
npm init -y
```

4. Install core dependencies
```bash
npm install next@14.1.0 react@18.2.0 react-dom@18.2.0 @supabase/auth-helpers-nextjs @supabase/supabase-js @stripe/stripe-js stripe zod @tanstack/react-query clsx tailwind-merge
```

5. Install development dependencies
```bash
npm install -D typescript @types/react @types/node @types/react-dom eslint eslint-config-next prettier prettier-plugin-tailwindcss husky lint-staged @typescript-eslint/eslint-plugin @typescript-eslint/parser tailwindcss postcss autoprefixer jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom drizzle-kit dotenv
```

### Environment Configuration

1. Create `.env.local` file
```bash
cp .env.example .env.local
```

2. Set up environment variables
```bash
vercel env pull .env.local
```

### Project Structure Creation

1. Set up Next.js configuration
```bash
mkdir -p app/{auth/login,dashboard} components/auth lib types public
```

2. Create TypeScript configuration
```bash
npx tsc --init
```

3. Set up Tailwind CSS
```bash
npx tailwindcss init -p
```

### Database and Authentication Setup

1. Create database seed script at `scripts/seed-db.js`

2. Run the seed script to create the single user
```bash
node scripts/seed-db.js
```

### Dashboard & Subscription Implementation

1. Create directory structure for dashboard and subscription
```bash
mkdir -p "app/(dashboard)/dashboard" "app/(dashboard)/subscription" components/dashboard components/subscription lib/subscription types/subscription
```

2. Create subscription data models
```bash
# Create subscription type definitions
touch types/subscription/index.ts

# Create subscription service and plans
touch lib/subscription/index.ts lib/subscription/plans.ts lib/subscription/subscription-service.ts
```

3. Create UI components
```bash
# Create dashboard navigation
touch components/dashboard/DashboardNav.tsx

# Create subscription components
touch components/subscription/SubscriptionPlanCard.tsx components/subscription/SubscriptionFeatureTable.tsx
```

4. Create route pages
```bash
# Create dashboard main page
touch app/(dashboard)/dashboard/page.tsx

# Create subscription management page
touch app/(dashboard)/subscription/page.tsx

# Create signout functionality
touch app/auth/signout/route.ts
```

5. Create subscription database table
```bash
# Create database migration script
touch scripts/create-subscription-table.js
chmod +x scripts/create-subscription-table.js

# Run the migration script
node scripts/create-subscription-table.js
```

### Common Fixes and Solutions

#### JSON Formatting Issues

If you encounter JSON formatting issues in package.json or other JSON files:

```bash
# Fix package.json formatting
./scripts/fix-json-files.sh package.json

# Verify JSON is valid
cat package.json | jq empty
```

#### Route Structure Issues

If routes aren't working properly:

1. Ensure proper route structure
```bash
# For /auth/login route, create the proper directory structure
mkdir -p app/auth/login
```

2. Create page and layout files in the appropriate directories
```bash
# Create auth layout
touch app/auth/layout.tsx

# Create login page
touch app/auth/login/page.tsx
```

#### Route Protection Issues

If routes are not being properly protected:

1. Update middleware.ts to include all protected routes
```bash
# Example fix for adding subscription route protection
# In middleware.ts config.matcher add:
'/subscription/:path*',
```

2. Fix redirect logic in middleware and root page
```bash
# Update root page to redirect based on authentication
# Check app/page.tsx to ensure proper redirection
```

#### Build Errors

For module resolution errors:

```bash
# Install missing dependencies
npm install zod

# Fix tsconfig.json path resolution
# Change from "@/*": ["./src/*"] to "@/*": ["./*"]
```

#### Deployment Issues

For Vercel deployment:

```bash
# Update vercel.json configuration
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}

# Deploy to Vercel
vercel deploy --prod -y
```

### Successful Commands for Feature Branch Workflow

```bash
# Commit changes
git add package.json
git commit -m "fix(build): correct package.json formatting"

# Push to feature branch
git push origin feat/saas-template-setup

# Create PR with template
gh pr create --title "feat: implement feature name" --body-file .github/pr-description.md

# Merge to main
git checkout main
git pull origin main
git merge feat/saas-template-setup
git push origin main
```

### Troubleshooting

If you encounter 404 errors with route groups:
- Check that you're not mixing regular routes with route groups (parentheses)
- Ensure middleware is properly configured with the correct matchers
- Verify that redirects are pointing to the correct routes

For authentication issues:
- Check that Supabase environment variables are correctly set
- Ensure the database seed script has been run to create the initial user
- Verify the login form is using the correct credentials 