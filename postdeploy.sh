#!/bin/bash
# post deploy setup
cp ../.env .
bun install
bun run build
pm2 reload ecosystem.config.cjs