#!/bin/bash

# Print message to console
echo "Aguarde a que se buildee el proyecto..."

# Run npm install with force flag and pipe to a log file
npm --force --quiet install > npm-install.log

# Run npm run dev
npm run dev
