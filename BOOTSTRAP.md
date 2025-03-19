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