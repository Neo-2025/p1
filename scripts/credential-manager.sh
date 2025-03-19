#!/bin/bash

# Function to store credentials in Windows Credential Manager
store_windows_credential() {
    local key=$1
    local value=$2
    local user=$3
    
    # Use cmdkey to store in Windows Credential Manager
    cmd.exe /c "cmdkey /generic:$key /user:$user /pass:$value"
}

# Function to retrieve credentials from Windows Credential Manager
get_windows_credential() {
    local key=$1
    
    # Use cmdkey to retrieve from Windows Credential Manager
    cmd.exe /c "cmdkey /generic:$key"
}

# Function to store Vercel token
store_vercel_token() {
    local token=$1
    store_windows_credential "vercel-token" "$token" "oauth"
}

# Function to store GitHub token
store_github_token() {
    local token=$1
    store_windows_credential "github-token" "$token" "token"
}

# Function to verify credential storage
verify_credentials() {
    echo "Verifying stored credentials..."
    
    # Check Vercel token
    if cmd.exe /c "cmdkey /generic:vercel-token" > /dev/null 2>&1; then
        echo "✓ Vercel token stored"
    else
        echo "✗ Vercel token not found"
    fi
    
    # Check GitHub token
    if cmd.exe /c "cmdkey /generic:github-token" > /dev/null 2>&1; then
        echo "✓ GitHub token stored"
    else
        echo "✗ GitHub token not found"
    fi
}

# Main execution
case "$1" in
    "store-vercel")
        if [ -z "$2" ]; then
            echo "Error: Vercel token required"
            exit 1
        fi
        store_vercel_token "$2"
        ;;
    "store-github")
        if [ -z "$2" ]; then
            echo "Error: GitHub token required"
            exit 1
        fi
        store_github_token "$2"
        ;;
    "verify")
        verify_credentials
        ;;
    *)
        echo "Usage: $0 {store-vercel|store-github|verify} [token]"
        exit 1
        ;;
esac 