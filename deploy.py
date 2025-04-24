#!/usr/bin/env python3

import sys
import paramiko
import time
from rich import print

# SSH connection details
SSH_KEY = "/home/patrick/.ssh/github-actions"
SSH_USER = "patrick"
SSH_HOST = "raspberrypi.local"
PROJECT_DIR = "/home/patrick/eraiyomi"
GIT_REPO = "https://github.com/patrickchennn/eraiyomi.git"

def run_ssh_command(client, command, description):
    """Executes an SSH command with a flushing progress output."""

    print(f"[cyan][*] {description}...[/]")

    stdin, stdout, stderr = client.exec_command(command)
    exit_status = stdout.channel.recv_exit_status()

    # Capture output
    stdout_lines = stdout.readlines()
    print(stdout_lines)
    # print(exit_status)

    stderr_lines = stderr.readlines()

    # If the command fails, show the error and exit
    if exit_status != 0:
        print(f"[bold red][-] ❌ {description} failed![/]")
        for line in stderr_lines:
            print(f"[bold red]Error:[/] {line}")
        sys.exit(exit_status)

    # Print success message
    print(f"[bold green][+] {description}[/]")

def main():

    # Used for checking whether the supplied `argv[]` value is in this set
    existing_docker_services = {"server", "client", "server-staging","client-staging"}

    # Atleast one argument (1 argc) provided
    if len(sys.argv) < 2:
        print(f"Usage: deploy.py {existing_docker_services}")
        sys.exit(1)


    # Exclude the program name
    DOCKER_SERVICES = sys.argv[1:]
    # print("DOCKER_SERVICES=",DOCKER_SERVICES)

    for docker_service in DOCKER_SERVICES:
        if(docker_service not in existing_docker_services):
            print(f"[bold red]Invalid Docker Service:[/] {docker_service}")
            print(f"Usage: deploy.py {existing_docker_services}")
            sys.exit(1)

    DOCKER_SERVICES = " ".join(DOCKER_SERVICES)
    # print("DOCKER_SERVICES=",DOCKER_SERVICES)

    # Handle deployment
    try:
        print(f"[bold cyan]🔗 Connecting to {SSH_HOST} as {SSH_USER}...[/]")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SSH_HOST, username=SSH_USER, key_filename=SSH_KEY)

        steps = [
            (f"mkdir -p {PROJECT_DIR}", "Ensuring project directory exists"),
            (f"if [ ! -d '{PROJECT_DIR}/.git' ]; then git clone {GIT_REPO} {PROJECT_DIR}; fi", "Checking & Cloning repository if needed"),
            (f"cd {PROJECT_DIR} && git pull", "Updating repository"),
            (f"cd {PROJECT_DIR} && sudo docker compose build {DOCKER_SERVICES}", f"Building Docker services ({DOCKER_SERVICES})"),
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
