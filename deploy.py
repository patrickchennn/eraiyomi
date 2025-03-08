#!/usr/bin/env python3

import sys
import paramiko
from rich import print
from rich.progress import Progress

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
PROJECT_DIR = "/home/patrick/env/eraiyomi"

def run_ssh_command(client, command, description):
    """Executes an SSH command with colored status updates."""
    
    # Show in-progress message
    print(f"[cyan][*] {description}...[/]")

    stdin, stdout, stderr = client.exec_command(command)
    exit_status = stdout.channel.recv_exit_status()

    for line in stdout:
        print(f"[green]{line.strip()}[/]")

    for line in stderr:
        print(f"[bold red]❌ Error:[/] {line.strip()}")

    if exit_status != 0:
        print(f"[bold red]❌ Command failed:[/] {command}")
        sys.exit(exit_status)

    # Show success message
    print(f"[bold green][+] {description}[/]")

def main():
    """Main function to handle deployment."""
    try:
        print(f"[bold cyan]🔗 Connecting to {SSH_HOST} as {SSH_USER}...[/]")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SSH_HOST, username=SSH_USER, key_filename=SSH_KEY)

        with Progress() as progress:
            task = progress.add_task("[bold cyan]Deploying...", total=5)

            run_ssh_command(ssh, f"cd {PROJECT_DIR} && git pull", "Updating repository")
            progress.update(task, advance=1)

            run_ssh_command(ssh, f"cd {PROJECT_DIR} && npm run setup-python", "Setup python venv")
            progress.update(task, advance=1)

            run_ssh_command(ssh, f"cd {PROJECT_DIR} && npm run pip-install", "Install python venv requirement")
            progress.update(task, advance=1)

            run_ssh_command(ssh, f"cd {PROJECT_DIR}/backend && ./setup_secrets.py", "Running setup-secrets.py")
            progress.update(task, advance=1)

            run_ssh_command(ssh, f"cd {PROJECT_DIR} && docker compose up -d {DOCKER_SERVICES}", f"Starting Docker services ({DOCKER_SERVICES})")
            progress.update(task, advance=1)

        print("[bold green]✅ Deployment complete![/]")

    except paramiko.SSHException as e:
        print(f"[bold red]❌ SSH connection error:[/] {e}")
        sys.exit(1)

    finally:
        ssh.close()

if __name__ == "__main__":
    main()
