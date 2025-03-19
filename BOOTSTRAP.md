# Project Bootstrap Guide

## Environment Setup

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

### Common Environment Variable Issues

1. **@ Symbol Reference Error**
   - Error: `Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "next_public_supabase_url"`
   - Solution: Use ${VARIABLE_NAME} format instead of @variable_name

2. **Missing Environment Variables**
   - Ensure all required variables are set in Vercel dashboard
   - Required variables for Supabase:
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY

3. **Local Development**
   - Run `vercel link` to connect local environment
   - Use `vercel env pull .env.local` to sync variables

## Script Details

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