#!/bin/bash
# cronjob script for periodically updating the list
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

export NVM_DIR="/home/node/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

cd /var/www/wokedetector/current
pm2 stop ecosystem.config.cjs
bun run build
pm2 reload ecosystem.config.cjs