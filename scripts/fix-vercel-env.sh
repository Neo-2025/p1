#!/bin/bash

# Script to fix Vercel environment variable references
# Removes @ symbols and updates to ${VAR_NAME} format

VERCEL_JSON_PATH="../vercel.json"

# Check if vercel.json exists
if [ ! -f "$VERCEL_JSON_PATH" ]; then
    echo "Error: vercel.json not found at $VERCEL_JSON_PATH"
    exit 1
fi

# Create backup
cp "$VERCEL_JSON_PATH" "${VERCEL_JSON_PATH}.backup"

# Use sed to replace @variable_name with ${VARIABLE_NAME}
# This handles the conversion in two steps:
# 1. Replace @name with ${name}
# 2. Convert the variable name to uppercase
sed -i.bak -E 's/@([a-z_]+)/\${\U\1}/g' "$VERCEL_JSON_PATH"

echo "Updated vercel.json environment variables:"
grep -A 5 '"env":' "$VERCEL_JSON_PATH"

echo -e "\nBackup saved as ${VERCEL_JSON_PATH}.backup" 