#!/bin/bash

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install global npm packages
sudo npm install -g supabase@3.2.1 vercel typescript@5.3.3 ts-node

# Verify installations
node --version
npm --version
supabase --version 