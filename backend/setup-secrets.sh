#!/bin/bash

# Define services and secrets directory
SERVICES=("backend" "backend-staging")
SECRETS_DIR="secrets"
SECRETS_FILE=".env.secrets"

# Ensure the secrets file exists
if [[ ! -f "$SECRETS_FILE" ]]; then
  echo "❌ Error: Secrets file '$SECRETS_FILE' not found!"
  exit 1
fi

# Ensure secrets directory exists
mkdir -p "$SECRETS_DIR"

# Create missing secrets
echo "🔒 Setting up secrets..."

while IFS='=' read -r key value; do
  # Ignore commented lines or empty lines
  if [[ ! "$key" =~ ^#.* && ! -z "$key" ]]; then
    echo "Generating secret for: $key..."
    SECRET_FILE="$SECRETS_DIR/$key"
    echo "$value" > "$SECRET_FILE"
  fi
done < "$SECRETS_FILE"

echo "✅ Secrets setup complete."
