#!/bin/bash

# Script to fix Vercel environment variable references and validate JSON files
# Removes @ symbols and updates to ${VAR_NAME} format

# Function to validate JSON file
validate_json() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo "Error: $file not found"
        return 1
    }

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
    echo "$file is valid JSON"
    return 0
}

# Paths relative to script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
VERCEL_JSON_PATH="$PROJECT_ROOT/vercel.json"
PACKAGE_JSON_PATH="$PROJECT_ROOT/package.json"

# Validate package.json first
echo "Validating package.json..."
if ! validate_json "$PACKAGE_JSON_PATH"; then
    echo "Please fix package.json before continuing"
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "$VERCEL_JSON_PATH" ]; then
    echo "Error: vercel.json not found at $VERCEL_JSON_PATH"
    exit 1
fi

# Validate vercel.json before making changes
echo "Validating vercel.json..."
if ! validate_json "$VERCEL_JSON_PATH"; then
    echo "Please fix vercel.json before continuing"
    exit 1
fi

# Create backup
cp "$VERCEL_JSON_PATH" "${VERCEL_JSON_PATH}.backup"

# Use sed to replace @variable_name with ${VARIABLE_NAME}
# This handles the conversion in two steps:
# 1. Replace @name with ${name}
# 2. Convert the variable name to uppercase
sed -i.bak -E 's/@([a-z_]+)/\${\U\1}/g' "$VERCEL_JSON_PATH"

# Validate the modified vercel.json
echo "Validating modified vercel.json..."
if ! validate_json "$VERCEL_JSON_PATH"; then
    echo "Error: Failed to validate modified vercel.json"
    echo "Restoring from backup..."
    cp "${VERCEL_JSON_PATH}.backup" "$VERCEL_JSON_PATH"
    exit 1
fi

echo "Updated vercel.json environment variables:"
grep -A 5 '"env":' "$VERCEL_JSON_PATH"

echo -e "\nBackup saved as ${VERCEL_JSON_PATH}.backup" 