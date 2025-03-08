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
    print("[bold yellow]Usage:[/] deploy.py production|staging")
    sys.exit(1)

# SSH connection details
SSH_KEY = "/home/patrick/.ssh/github-actions"
SSH_USER = "patrick"
SSH_HOST = "raspberrypi.local"
PROJECT_DIR = "/home/patrick/env/eraiyomi"

def run_ssh_command(client, command, task_description, task):
    """Executes an SSH command with progress tracking."""
    stdin, stdout, stderr = client.exec_command(command)
    exit_status = stdout.channel.recv_exit_status()

    for line in stdout:
        print(f"[green]{line.strip()}[/]")

    for line in stderr:
        print(f"[bold red]❌ Error:[/] {line.strip()}")

    if exit_status != 0:
        print(f"[bold red]❌ Command failed:[/] {command}")
        sys.exit(exit_status)
    
    task.update(task_description, advance=1)  # Update progress bar

def main():
    """Main function to handle deployment."""
    try:
        print(f"[bold cyan]🔗 Connecting to {SSH_HOST} as {SSH_USER}...[/]")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SSH_HOST, username=SSH_USER, key_filename=SSH_KEY)

        with Progress() as progress:
            task = progress.add_task("[cyan]Deploying...", total=4)

            print("[bold cyan]📁 Changing to project directory...[/]")
            run_ssh_command(ssh, f"cd {PROJECT_DIR} && git pull", task, progress)

            print("[bold cyan]🔑 Running setup-secrets.py...[/]")
            run_ssh_command(ssh, f"cd {PROJECT_DIR}/backend && ./setup_secrets.py", task, progress)

            print(f"[bold cyan]🚀 Starting Docker services:[/] {DOCKER_SERVICES}")
            run_ssh_command(ssh, f"cd {PROJECT_DIR} && docker compose up -d {DOCKER_SERVICES}", task, progress)

        print("[bold green]✅ Deployment complete![/]")

    except paramiko.SSHException as e:
        print(f"[bold red]❌ SSH connection error:[/] {e}")
        sys.exit(1)

    finally:
        ssh.close()

if __name__ == "__main__":
    main()
