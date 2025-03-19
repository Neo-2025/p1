# S4 Project Setup Guide

## Project Overview
- **Project Name**: `p1`
- **GitHub Repository**: `https://github.com/Neo-2025/p1`
- **Vercel Project**: `https://vercel.com/smart-scale/p1`
- **Development Branch**: `feat/s4-integration`

## Prerequisites

### 1. GitHub Enterprise SSO Setup
1. Ensure GitHub Enterprise OAuth is configured for SSO
2. Verify your account has access to the organization
3. Set up personal access token with required scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `write:packages` (Upload packages to GitHub Package Registry)
   - `delete:packages` (Delete packages from GitHub Package Registry)

### 2. Vercel Setup
1. Log in to Vercel with GitHub SSO
2. Ensure access to the `smart-scale` organization
3. Verify project `p1` exists and is accessible

## Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/Neo-2025/p1.git
cd p1

# Run the bootstrap script
./scripts/bootstrap-s4.sh
```

### 2. Vercel Configuration
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to existing project
vercel link --yes --project p1

# Get Vercel IDs
node scripts/get-vercel-ids.js
```

### 3. GitHub Secrets Setup
Add the following secrets to your GitHub repository:
- `VERCEL_TOKEN`: Your Vercel access token
- `ORG_ID`: Vercel organization ID
- `PROJECT_ID`: Vercel project ID
- `CODECOV_TOKEN`: Codecov.io token for coverage reporting

#### Automatic Environment Variables Sync
To automatically sync all environment variables from Vercel to GitHub secrets:
```bash
# Make the script executable
chmod +x S4/scripts/sync-vercel-env.sh

# Run the sync script
./S4/scripts/sync-vercel-env.sh
```

This will:
1. Fetch all environment variables from Vercel
2. Add them as GitHub secrets
3. Skip empty values and comments
4. Clean up temporary files

Note: Make sure you're logged into both Vercel and GitHub CLI before running the script.

## GitHub Actions Workflows

### 1. Branch-First Development Workflow
```yaml
# Trigger: Pull requests to main and pushes to feature branches
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main, 'feat/*', 'fix/*', 'docs/*' ]

# Jobs:
# 1. validate: Type checking, linting, testing, and building
# 2. preview: Deploys to Vercel preview environment
```

### 2. Automated Testing Workflow
```yaml
# Trigger: Pull requests to main and pushes to feature branches
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main, 'feat/*', 'fix/*' ]

# Jobs:
# 1. test: Runs unit, integration, and E2E tests
# 2. coverage: Uploads coverage reports to Codecov
```

## Prompt Engineering Guide

### 1. Feature Implementation
```yaml
prompt: |
  Implement {feature_name} with the following requirements:
  
  Context:
  - Business goal: {goal}
  - Target users: {users}
  - Technical stack: {stack}
  
  Requirements:
  - Architecture: {architecture}
  - Data model: {model}
  - UI components: {components}
  
  Constraints:
  - Performance: {metrics}
  - Security: {requirements}
  - Accessibility: {standards}
  
  Validation:
  - Test coverage: {percentage}
  - Performance benchmarks: {metrics}
  - Security checks: {requirements}
```

### 2. Code Review
```yaml
prompt: |
  Review the following code for {component_name}:
  
  Code:
  {code_snippet}
  
  Focus areas:
  - Business logic correctness
  - Performance optimization
  - Security vulnerabilities
  - Code maintainability
  
  Provide:
  - Issue list with severity
  - Suggested improvements
  - Performance optimizations
  - Security recommendations
```

### 3. Architecture Decision
```yaml
prompt: |
  Evaluate architecture options for {feature_name}:
  
  Requirements:
  - Scalability: {requirements}
  - Performance: {metrics}
  - Cost: {constraints}
  - Maintenance: {considerations}
  
  Options:
  - Option 1: {description}
  - Option 2: {description}
  
  Analysis:
  - Pros and cons
  - Implementation complexity
  - Maintenance overhead
  - Cost implications
  
  Recommendation:
  - Preferred option
  - Implementation plan
  - Migration strategy
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feat/feature-name

# Make changes and commit
git add .
git commit -m "feat: description"

# Push changes
git push origin feat/feature-name

# Create pull request
gh pr create --title "feat: description" --body "Detailed description"
```

### 2. Preview Deployment
- Pull requests automatically trigger preview deployments
- Preview URL: `https://p1-git-feat-feature-name-smart-scale.vercel.app`
- Environment variables are automatically configured

### 3. Production Deployment
```bash
# Merge to main
git checkout main
git merge feat/feature-name
git push origin main

# Vercel automatically deploys to production
```

## Troubleshooting

### 1. GitHub Actions Issues
- Check workflow logs in GitHub Actions tab
- Verify secrets are properly configured
- Ensure branch protection rules are set up

### 2. Vercel Deployment Issues
- Check deployment logs in Vercel dashboard
- Verify environment variables
- Ensure project settings are correct

### 3. Local Development Issues
- Run `vercel link` to verify project connection
- Check `.env` file configuration
- Verify Node.js version matches project requirements

## Additional Resources
- [Bootstrap Script Documentation](./scripts/bootstrap-s4.sh)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Project Structure Guide](./docs/project-structure.md) 