#!/usr/bin/env python3

import os
from rich import print
from rich.progress import Progress

# Get the directory of the script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SECRETS_FILE = os.path.join(SCRIPT_DIR, ".env.secrets")
SECRETS_DIR = os.path.join(SCRIPT_DIR, "secrets")

# Ensure the secrets file exists
if not os.path.isfile(SECRETS_FILE):
    print(f"[bold red]❌ Error: Secrets file '{SECRETS_FILE}' not found![/]")
    exit(1)

# Ensure the secrets directory exists
os.makedirs(SECRETS_DIR, exist_ok=True)

# Read and process the secrets file
print("[bold cyan]🔒 Setting up secrets...[/]")
with open(SECRETS_FILE, "r") as file:
    for line in file:
        line = line.strip()
        # Ignore commented lines or empty lines
        if line.startswith("#") or not line:
            continue
        
        key, value = line.split("=", 1)  # Split at the first '='
        secret_file = os.path.join(SECRETS_DIR, key)
        
        print(f"[cyan]Generating secret for: {key}...[/]")
        with open(secret_file, "w") as secret:
            secret.write(value)


print("[bold green]✅ Secrets setup complete.[/]")
