#!/bin/bash

# Ensure exactly one argument is provided
if [[ $# -ne 1 ]]; then
  echo "Usage: $0 production|staging"
  exit 1
fi

# Set environment
ENV="$1"

if [[ "$ENV" == "production" ]]; then
  DOCKER_SERVICES="server client"
elif [[ "$ENV" == "staging" ]]; then
  DOCKER_SERVICES="server-staging client-staging"
else
  echo "Invalid environment: $ENV"
  echo "Usage: $0 production|staging"
  exit 1
fi

SSH_KEY="$HOME/.ssh/github-actions"  # Expand tilde (~) properly
SSH_USER="patrick"
SSH_HOST="raspberrypi.local"

echo "Connecting to Raspberry Pi..."
ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" << EOF
    set -e  # Exit immediately if any command fails

    echo "📁 Changing to project directory..."
    cd /env/eraiyomi

    echo "🔄 Pulling latest changes..."
    git pull

    echo "🔑 Running setup-secrets.sh..."
    ./setup-secrets.sh
    if [[ \$? -ne 0 ]]; then
      echo "❌ setup-secrets.sh failed. Aborting deployment."
      exit 1
    fi

    echo "🚀 Starting Docker services: $DOCKER_SERVICES"
    docker compose up -d $DOCKER_SERVICES

    echo "✅ Deployment complete!"
EOF
