#!/bin/bash
# I-Trex Automated Deployment Wrapper for Linux / macOS / Bash
set -e

echo -e "\033[1;36m=====================================================\033[0m"
echo -e "\033[1;32m   I-TREX INNOVATIONS // LINUX & MAC DEPLOYMENT      \033[0m"
echo -e "\033[1;36m=====================================================\033[0m"

if [ -n "$1" ]; then
    node scripts/deploy.js "$1"
else
    node scripts/deploy.js
fi
