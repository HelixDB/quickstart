# Python Quickstart

A simple Python application demonstrating HelixDB usage.

## Prerequisites

- Python installed
- HelixDB server running on http://localhost:6969 (if you don't have one, you can deploy one using the instructions below)

## Installing HelixDB

### Install the HelixCLI using the following command

```bash
curl -sSL https://install.helix-db.com | bash
```
### Add Helix to your PATH

For Unix (macOS, Linux)
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zshrc"
source ~/.zshrc
```

For Bash (Windows)
```bash Bash (Windows)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
source ~/.bashrc
```
### Install the Helix container using the following command

```bash
helix install
```

### Deploy a HelixDB Instance

```bash
cd helixdb-cfg
helix deploy
```

## Usage

```bash
uv venv
uv sync
uv run getting_started.py
```

or 

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python getting_started.py
```

This will run the getting started example that creates users, posts, and demonstrates various database operations.