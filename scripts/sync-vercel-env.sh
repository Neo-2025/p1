#!/bin/bash

# Function to log messages
log() {
    echo "[Vercel Sync] $1"
}

# Check for required tools
if ! command -v vercel &> /dev/null; then
    log "Error: Vercel CLI is not installed. Please run: npm install -g vercel"
    exit 1
fi

if ! command -v gh &> /dev/null; then
    log "Error: GitHub CLI is not installed. Please run: npm install -g gh"
    exit 1
fi

# Verify logged in status
vercel whoami &> /dev/null || {
    log "Error: Not logged into Vercel. Please run: vercel login"
    exit 1
}

gh auth status &> /dev/null || {
    log "Error: Not logged into GitHub. Please run: gh auth login"
    exit 1
}

# Fetch environment variables from Vercel
log "Fetching environment variables from Vercel..."
vercel env pull .env.vercel.tmp

# Read and process each line
while IFS= read -r line || [[ -n "$line" ]]; do
    # Skip empty lines and comments
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    
    # Split into key and value
    if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        
        # Remove quotes if present
        value="${value#\"}"
        value="${value%\"}"
        
        # Skip if empty value
        [[ -z "$value" ]] && continue
        
        log "Syncing $key to GitHub secrets..."
        echo "$value" | gh secret set "$key"
    fi
done < .env.vercel.tmp

# Cleanup
rm .env.vercel.tmp

log "Successfully synced all environment variables to GitHub secrets!"
log "Please verify the secrets in your GitHub repository settings" 