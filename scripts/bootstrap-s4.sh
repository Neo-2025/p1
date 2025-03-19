#!/bin/bash

# S4 Bootstrap Script
# This script sets up the development environment for SmartStack v4 (S4)

set -e  # Exit on error

# Environment variables
WINDOWS_USER="luke"
WINDOWS_HOME="/mnt/c/Users/$WINDOWS_USER"
WSL_USER="neo"
WSL_HOME="/home/$WSL_USER"
S4_ROOT="$WSL_HOME/S4"

# Log function
log() {
    echo "[S4 Bootstrap] $1"
}

# Error handling
handle_error() {
    log "Error: $1"
    exit 1
}

# Check WSL version and status
check_wsl() {
    log "Checking WSL environment..."
    uname -a || handle_error "Failed to get system info"
    lsb_release -a || handle_error "Failed to get distribution info"
}

# Configure WSL for optimal performance
configure_wsl() {
    log "Configuring WSL for optimal performance..."
    
    # Create WSL config
    log "Creating WSL config..."
    sudo bash -c 'cat > /etc/wsl.conf << EOF
[wsl2]
memory=6GB
processors=4
localhostForwarding=true

[automount]
enabled = true
root = /mnt/
options = "metadata,umask=22,fmask=11"
mountFsTab = true

[interop]
enabled = true
appendWindowsPath = true

[network]
generateResolvConf = true
EOF'

    # Optimize system settings
    log "Optimizing system settings..."
    sudo bash -c 'cat >> /etc/sysctl.conf << EOF
vm.swappiness=10
vm.dirty_ratio=40
fs.inotify.max_user_watches=524288
EOF'

    sudo sysctl -p || log "Note: Some sysctl settings may require a WSL restart"
}

# Configure path mappings
configure_paths() {
    log "Configuring path mappings..."
    
    # Set up environment variables
    log "Setting up environment variables..."
    cat >> "$WSL_HOME/.bashrc" << EOF

# S4 Path Mappings
export WINDOWS_USER="$WINDOWS_USER"
export WINDOWS_HOME="$WINDOWS_HOME"
export WSL_USER="$WSL_USER"
export WSL_HOME="$WSL_HOME"
export S4_ROOT="$S4_ROOT"
EOF

    # Create Windows path mappings
    log "Creating Windows path mappings..."
    mkdir -p "$WSL_HOME/win"
    ln -sf "$WINDOWS_HOME" "$WSL_HOME/win/home"
    mkdir -p "$WSL_HOME/win/{projects,downloads,documents}"
    ln -sf "$WINDOWS_HOME/Projects" "$WSL_HOME/win/projects"
    ln -sf "$WINDOWS_HOME/Downloads" "$WSL_HOME/win/downloads"
    ln -sf "$WINDOWS_HOME/Documents" "$WSL_HOME/win/documents"
}

# Install essential development tools
install_dev_tools() {
    log "Installing development tools..."
    
    # Update and install packages
    sudo apt-get update 
    sudo apt-get install -y \
        curl \
        git \
        nodejs \
        postgresql-client \
        redis-tools \
        build-essential \
        python3 \
        python3-pip \
        docker.io \
        docker-compose || handle_error "Failed to install development tools"
}

# Install global npm packages
install_npm_globals() {
    log "Installing global npm packages..."
    # Note: Using Supabase CLI v1.13.1 as v3.2.1 specified in .cursor.rules is not available in npm registry
    # TODO: Verify if v3.2.1 is a typo in .cursor.rules or if there's a specific installation method
    npm install -g \
        supabase@1.13.1 \
        vercel \
        typescript@5.3.3 \
        ts-node || handle_error "Failed to install npm packages"
}

# Configure Git for WSL
configure_git() {
    log "Configuring Git for WSL..."
    git config --global core.fileMode false
    git config --global core.autocrlf input
    git config --global core.eol lf || handle_error "Failed to configure Git"
    
    # Configure GitHub credentials if not already set
    if [ -z "$(git config --global user.name)" ]; then
        git config --global user.name "Neo"
        git config --global user.email "neo@smartscale.co"
    fi
}

# Create project structure
create_project_structure() {
    log "Creating project structure..."
    mkdir -p "$S4_ROOT/p1" || handle_error "Failed to create p1 directory"
    mkdir -p "$S4_ROOT/kb" || handle_error "Failed to create kb directory"
    mkdir -p "$S4_ROOT/scripts" || handle_error "Failed to create scripts directory"
    
    # Set up VS Code workspace settings
    log "Setting up VS Code workspace settings..."
    mkdir -p "$S4_ROOT/.vscode"
    cat > "$S4_ROOT/.vscode/settings.json" << EOF
{
    "terminal.integrated.defaultProfile.windows": "WSL",
    "terminal.integrated.profiles.windows": {
        "WSL": {
            "path": "wsl.exe",
            "args": ["-d", "Ubuntu-20.04"]
        }
    },
    "files.eol": "\n",
    "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/.git/**": true
    }
}
EOF

    # Verify Cursor AI setup
    log "Verifying Cursor AI setup..."
    if [ ! -d "$WSL_HOME/.cursor-server" ]; then
        log "Warning: Cursor AI server not found at $WSL_HOME/.cursor-server"
        log "Please ensure Cursor is properly installed and configured"
    else
        log "Cursor AI setup verified"
    fi
}

# Set up Next.js app structure
setup_nextjs_app() {
    log "Setting up Next.js app structure..."
    
    # Create app directory structure
    mkdir -p "$S4_ROOT/p1/src/app"
    
    # Create layout.tsx
    cat > "$S4_ROOT/p1/src/app/layout.tsx" << EOF
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'S4 Project',
  description: 'S4 Development Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

    # Create page.tsx
    cat > "$S4_ROOT/p1/src/app/page.tsx" << EOF
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to S4 Project</h1>
    </main>
  )
}
EOF

    # Create globals.css
    cat > "$S4_ROOT/p1/src/app/globals.css" << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

    # Create tailwind.config.js
    cat > "$S4_ROOT/p1/tailwind.config.js" << EOF
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

    # Create postcss.config.js
    cat > "$S4_ROOT/p1/postcss.config.js" << EOF
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

    # Create vercel.json
    cat > "$S4_ROOT/p1/vercel.json" << EOF
{
    "buildCommand": "npm run build",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "nextjs",
    "regions": ["iad1"]
}
EOF

    log "Next.js app structure created successfully"
}

# Configure Vercel and Supabase integration
configure_vercel_supabase() {
    log "Configuring Vercel and Supabase integration..."
    
    # Create Supabase configuration
    log "Creating Supabase configuration..."
    mkdir -p "$S4_ROOT/p1/supabase"
    cat > "$S4_ROOT/p1/supabase/config.toml" << EOF
# A string used to distinguish different Supabase projects on the same host. Defaults to the working
# directory name when running `supabase init`.
project_id = "s4-project"

[api]
# Port to use for the API URL.
port = 54321
# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
# endpoints. public is always included.
schemas = ["public", "storage", "graphql_public"]
# Extra schemas to add to the search_path of every request. public is always included.
extra_search_path = ["public", "extensions"]
# The maximum number of rows returns from a view, table, or stored procedure. Limits payload size
# for accidental or malicious requests.
max_rows = 1000

[db]
# Port to use for the local database URL.
port = 54322
# The database major version to use. This has to be the same as your remote database's. Run `SHOW
# server_version;` on the remote database to check.
major_version = 15

[studio]
# Port to use for Supabase Studio.
port = 54323

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
# are monitored, and you can view the emails that would have been sent from the dashboard.
[inbucket]
# Port to use for the email testing server API.
port = 54324
# Port to use for the email testing server SMTP port.
smtp_port = 54325
# Port to use for the email testing server POP3 port.
pop3_port = 54326

[storage]
# The maximum file size allowed (e.g. "5MB", "500KB").
file_size_limit = "50MiB"

[auth]
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails.
site_url = "http://localhost:3000"
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://localhost:3000"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 seconds (one
# week).
jwt_expiry = 86400
# Allow/disallow new user signups to your project.
enable_signup = true

[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = true
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false
EOF

    # Create token rotation workflow
    log "Creating token rotation workflow..."
    mkdir -p "$S4_ROOT/.github/workflows"
    cat > "$S4_ROOT/.github/workflows/token-rotation.yml" << EOF
name: Token Rotation

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Rotate GitHub Token
        run: |
          gh auth refresh -h github.com
        env:
          GH_TOKEN: \${{ secrets.GH_TOKEN }}
          
      - name: Rotate Vercel Token
        run: |
          vercel tokens rotate
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
          
      - name: Rotate Supabase Token
        run: |
          supabase login --token \$(supabase token rotate)
        env:
          SUPABASE_ACCESS_TOKEN: \${{ secrets.SUPABASE_ACCESS_TOKEN }}
          
      - name: Update Environment Variables
        run: |
          vercel env pull .env.production
          supabase secrets set --env-file .env.production
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
          SUPABASE_ACCESS_TOKEN: \${{ secrets.SUPABASE_ACCESS_TOKEN }}
EOF

    # Create environment variables template
    log "Creating environment variables template..."
    cat > "$S4_ROOT/p1/.env.example" << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key
STRIPE_SECRET_KEY=your-secret-key

# Database
DATABASE_URL=your-database-url

# Vercel
VERCEL_PROJECT_ID=your-project-id
VERCEL_ORG_ID=your-org-id
EOF

    log "Vercel and Supabase integration configured."
    log "IMPORTANT: Manual steps required:"
    log "1. Create a new project on Vercel (https://vercel.com/new)"
    log "2. Create a new project on Supabase (https://supabase.com/dashboard)"
    log "3. Link the projects in Vercel dashboard:"
    log "   - Go to Project Settings > Environment Variables"
    log "   - Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    log "   - Enable 'Automatically expose System Environment Variables'"
    log "   - IMPORTANT: Do NOT use the 'STORAGE_' prefix for environment variables"
    log "     as it can cause confusion in the integration"
    log "4. Configure preview deployments:"
    log "   - In Vercel, go to Project Settings > Git"
    log "   - Enable 'Preview Deployment Checks'"
    log "   - Add Supabase preview URL and key mappings"
    log "5. Set up token rotation:"
    log "   - Add GH_TOKEN, VERCEL_TOKEN, and SUPABASE_ACCESS_TOKEN to GitHub Secrets"
    log "   - Token rotation is scheduled for daily at midnight"
    log ""
    log "IMPORTANT: The tight integration between Vercel and Supabase provides all environment"
    log "variables in one place, making it viable to create preview branches that coordinate"
    log "Vercel and Supabase environments. To get your environment variables:"
    log "1. Link your project: vercel link"
    log "2. Pull environment variables: vercel env pull .env.development.local"
    log "3. The .env.development.local file will contain all necessary variables for both"
    log "   Vercel and Supabase, enabling seamless preview branch creation and testing."
}

# Function to set up database with Drizzle ORM
setup_database() {
    log "Setting up database with Drizzle ORM..."
    
    # Install Drizzle dependencies
    log "Installing Drizzle dependencies..."
    npm install drizzle-orm @vercel/postgres pg
    npm install -D drizzle-kit dotenv
    
    # Create necessary directories
    log "Creating database directories..."
    mkdir -p src/lib/db
    
    # Create configuration files
    log "Creating database configuration files..."
    
    # Create drizzle.config.ts
    cat > drizzle.config.ts << 'EOL'
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development.local' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DATABASE!,
    port: 5432,
    ssl: true,
  },
} satisfies Config;
EOL
    
    # Create schema.ts
    cat > src/lib/db/schema.ts << 'EOL'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
EOL
    
    # Create index.ts
    cat > src/lib/db/index.ts << 'EOL'
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
EOL
    
    # Add database scripts to package.json
    log "Adding database scripts to package.json..."
    npm pkg set scripts.db:generate="drizzle-kit generate"
    npm pkg set scripts.db:push="drizzle-kit push"
    npm pkg set scripts.db:studio="drizzle-kit studio"
    
    # Create feature branch for database setup
    log "Creating feature branch for database setup..."
    git checkout -b feat/drizzle-setup
    
    # Add and commit changes
    log "Committing database setup changes..."
    git add .
    git commit -m "feat: add drizzle orm setup with schema"
    
    log "Database setup complete! Next steps:"
    log "1. Push changes to GitHub: git push origin feat/drizzle-setup"
    log "2. Deploy to Vercel to trigger preview environment"
    log "3. Verify Supabase preview branch creation"
}

# Usage information
usage() {
    echo "Usage: $0 [command]"
    echo "Commands:"
    echo "  check        - Check WSL environment"
    echo "  configure    - Configure WSL settings"
    echo "  paths        - Configure path mappings"
    echo "  tools        - Install development tools"
    echo "  npm          - Install global npm packages"
    echo "  git          - Configure Git settings"
    echo "  structure    - Create project structure"
    echo "  nextjs       - Set up Next.js app structure"
    echo "  vercel       - Configure Vercel and Supabase integration"
    echo "  all          - Run all steps"
    echo ""
}

# Main execution
main() {
    case "$1" in
        "check")
            check_wsl
            ;;
        "configure")
            configure_wsl
            ;;
        "paths")
            configure_paths
            ;;
        "tools")
            install_dev_tools
            ;;
        "npm")
            install_npm_globals
            ;;
        "git")
            configure_git
            ;;
        "structure")
            create_project_structure
            ;;
        "nextjs")
            setup_nextjs_app
            ;;
        "vercel")
            configure_vercel_supabase
            ;;
        "all")
            check_wsl
            configure_wsl
            configure_paths
            install_dev_tools
            install_npm_globals
            configure_git
            create_project_structure
            setup_nextjs_app
            configure_vercel_supabase
            setup_database
            ;;
        *)
            usage
            exit 1
            ;;
    esac
}

# Execute main function with all arguments
main "$@" 