# SmartScale GT2 Project

This project is built with Next.js, Supabase, and Vercel, implementing a modern web application with GitOps practices.

## Prerequisites

- Node.js 18.x
- npm 9.x or later
- Git
- GitHub account with access to SmartScale-co organization
- Vercel account
- Supabase account

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/SmartScale-co/gt2.git
   cd gt2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## GitOps Workflow

This project uses GitHub Actions for automated deployment to Vercel and Supabase. The workflow is triggered on:
- Push to `main` branch
- Pull requests to `main` branch

### Required Secrets

The following secrets need to be configured in GitHub repository settings:

- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_ACCESS_TOKEN`: Supabase access token for database migrations

### Deployment Process

1. Code is pushed to GitHub
2. GitHub Actions workflow is triggered
3. Dependencies are installed
4. Vercel environment is pulled
5. Project is built
6. Built artifacts are deployed to Vercel
7. Supabase database migrations are run
8. Deployment is verified

## Vercel Integration

1. Create a new project on Vercel
2. Connect to GitHub repository
3. Configure environment variables in Vercel dashboard
4. Enable automatic deployments

## Supabase Integration

1. Create a new project on Supabase
2. Configure database schema
3. Set up authentication
4. Configure environment variables

## Security

- All sensitive information is stored as GitHub secrets
- Environment variables are managed through Vercel and Supabase dashboards
- Database migrations are automated through GitHub Actions

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for CI/CD pipeline to complete
5. Get code review approval
6. Merge to main

## License

Proprietary - All rights reserved 