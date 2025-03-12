#!/usr/bin/env python3

import sys
import paramiko
import time
from rich import print

# Ensure exactly one argument is provided
if len(sys.argv) != 2:
    print("[bold red]Usage:[/] deploy.py production|staging")
    sys.exit(1)

# Set environment
ENV = sys.argv[1]

if ENV == "production":
    DOCKER_SERVICES = "server client"
elif ENV == "staging":
    DOCKER_SERVICES = "server-staging client-staging"
else:
    print(f"[bold red]❌ Invalid environment:[/] {ENV}")
    print("Usage: deploy.py production|staging")
    sys.exit(1)

# SSH connection details
SSH_KEY = "/home/patrick/.ssh/github-actions"
SSH_USER = "patrick"
SSH_HOST = "raspberrypi.local"
PROJECT_DIR = "/home/patrick/eraiyomi"
GIT_REPO = "https://github.com/patrickchennn/eraiyomi.git"

def run_ssh_command(client, command, description):
    """Executes an SSH command with a flushing progress output."""

    # Show in-progress message without a newline
    # print(f"[cyan][*] {description}...[/]", end="\r", flush=True)
    print(f"[cyan][*] {description}...[/]")

    stdin, stdout, stderr = client.exec_command(command)
    exit_status = stdout.channel.recv_exit_status()

    # Capture output
    stdout_lines = stdout.readlines()
    print(stdout_lines)
    print(exit_status)

    stderr_lines = stderr.readlines()

    # Clear previous progress line
    print(" " * 80, end="\r")

    # If the command fails, show the error and exit
    if exit_status != 0:
        print(f"[bold red][-] ❌ {description} failed![/]")
        for line in stderr_lines:
            print(f"[bold red]Error:[/] {line}")
        sys.exit(exit_status)

    # Print success message
    print(f"[bold green][+] {description}[/]")

def main():
    """Main function to handle deployment."""
    try:
        print(f"[bold cyan]🔗 Connecting to {SSH_HOST} as {SSH_USER}...[/]")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SSH_HOST, username=SSH_USER, key_filename=SSH_KEY)

        steps = [
            (f"mkdir -p {PROJECT_DIR}", "Ensuring project directory exists"),
            (f"if [ ! -d '{PROJECT_DIR}/.git' ]; then git clone {GIT_REPO} {PROJECT_DIR}; fi", "Checking & Cloning repository if needed"),
            (f"cd {PROJECT_DIR} && git pull", "Updating repository"),
            (f"cd {PROJECT_DIR} && sudo docker compose up -d {DOCKER_SERVICES}", f"Starting Docker services ({DOCKER_SERVICES})"),
        ]

        for command, description in steps:
            run_ssh_command(ssh, command, description)

        print("[bold green]✅ Deployment complete![/]")

    except paramiko.SSHException as e:
        print(f"[bold red]❌ SSH connection error:[/] {e}")
        sys.exit(1)

    finally:
        ssh.close()

if __name__ == "__main__":
    main()
