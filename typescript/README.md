# TypeScript Quickstart

A simple TypeScript application demonstrating HelixDB usage.

## Prerequisites

- Node.js installed
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

## Installing Dependencies

```bash
npm install
```

## Usage

```bash
npm start
```

This will run the getting started example that creates users, posts, and demonstrates various database operations.