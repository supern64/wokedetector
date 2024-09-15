#!/bin/bash
# cronjob script for periodically updating the list
cd /var/www/wokedetector/current
pm2 stop ecosystem.config.cjs
bun run build
pm2 reload ecosystem.config.cjs