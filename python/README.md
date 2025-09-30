# Python Quickstart

A simple Python application demonstrating HelixDB usage.

## Prerequisites

- Python installed
- HelixDB server running on http://localhost:6969 (if you don't have one, you can deploy one using the instructions below)

## Installing HelixDB

```bash
curl -sSL https://install.helix-db.com | bash
```

## Deploying a HelixDB Instance
Go into the `db` directory and deploy the instance using the following command
```bash
helix push dev
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