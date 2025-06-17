#!/bin/bash
set -e

echo "Deployment started..."

expect <<EOF
spawn git pull origin bsc-mainnet-config
expect "Enter passphrase for key '/***/.ssh/id_ed25519':"
send "helloooooooooooooo\n"
expect eof
EOF
echo "New changes copied to server !"

# Checkout the branch explicitly
echo "Checking out to 'bsc-mainnet-config' branch..."
git checkout bsc-mainnet-config

export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

echo "Installing Dependencies..."
pnpm install 

echo "Creating Production Build..."
pnpm run build

echo "PM2 Reload"
pm2 reload gemlaunch-interface

echo "Deployment Finished!"
