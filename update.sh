#!/bin/bash
# cronjob script for periodically updating the list
cd /var/www/wokedetector/current
bun run build
pm2 reload ecosystem.config.cjs --env production