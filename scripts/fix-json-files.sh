#!/bin/bash

# Script to fix common JSON issues in the project
# 1. Removes Git merge conflict markers
# 2. Fixes @ symbol references in vercel.json
# 3. Validates JSON syntax
# 4. Regenerates package-lock.json if needed

# Function to validate JSON file
validate_json() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo "Error: $file not found"
        return 1
    fi

    # Try to parse JSON using node
    if ! node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'));" 2>/dev/null; then
        echo "Error: Invalid JSON in $file"
        # Check for common issues
        if grep -n "<<<<<<< HEAD\|=======\|>>>>>>> " "$file" > /dev/null; then
            echo "Found Git merge conflict markers in $file"
            echo "Lines containing merge conflicts:"
            grep -n "<<<<<<< HEAD\|=======\|>>>>>>> " "$file"
        fi
        return 1
    fi
    echo "✓ Valid JSON: $file"
    return 0
}

# Function to fix merge conflicts
fix_merge_conflicts() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    # Remove Git merge conflict markers and keep HEAD version
    sed '/^<<<<<<< HEAD$/,/^=======$/!d;/^<<<<<<< HEAD$/d;/^=======$/d' "$file" > "$temp_file"
    sed '/^=======$/,/^>>>>>>> /d' "$file" >> "$temp_file"
    
    mv "$temp_file" "$file"
    
    # Remove any empty lines at the end except the last one
    sed -i -e :a -e '/^\n*$/{$d;N;ba' -e '}' "$file"
}

# Function to fix vercel env references
fix_vercel_env() {
    local file="$1"
    
    # Replace @variable_name with ${VARIABLE_NAME}
    sed -i.bak -E 's/@([a-z_]+)/\${\U\1}/g' "$file"
}

# Function to regenerate package-lock.json
regenerate_package_lock() {
    echo "Regenerating package-lock.json..."
    if [ -f "package-lock.json" ]; then
        mv package-lock.json package-lock.json.backup
    fi
    npm install --package-lock-only
    if [ $? -eq 0 ]; then
        echo "✓ Successfully regenerated package-lock.json"
        rm -f package-lock.json.backup
        return 0
    else
        echo "Error: Failed to regenerate package-lock.json"
        if [ -f "package-lock.json.backup" ]; then
            mv package-lock.json.backup package-lock.json
        fi
        return 1
    fi
}

# Main execution
echo "Fixing JSON files..."

# Process package.json
if [ -f "package.json" ]; then
    echo "Processing package.json..."
    cp package.json package.json.backup
    fix_merge_conflicts "package.json"
    if ! validate_json "package.json"; then
        echo "Error: Failed to fix package.json"
        cp package.json.backup package.json
        exit 1
    fi
fi

# Process vercel.json
if [ -f "vercel.json" ]; then
    echo "Processing vercel.json..."
    cp vercel.json vercel.json.backup
    fix_vercel_env "vercel.json"
    if ! validate_json "vercel.json"; then
        echo "Error: Failed to fix vercel.json"
        cp vercel.json.backup vercel.json
        exit 1
    fi
fi

# Process package-lock.json
if [ -f "package-lock.json" ]; then
    echo "Processing package-lock.json..."
    if ! validate_json "package-lock.json"; then
        echo "Invalid package-lock.json detected, attempting to regenerate..."
        if ! regenerate_package_lock; then
            echo "Error: Failed to fix package-lock.json"
            exit 1
        fi
    fi
fi

echo "Done! Backups created with .backup extension" 