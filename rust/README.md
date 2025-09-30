# Rust Quickstart

A simple Rust application demonstrating HelixDB usage.

## Prerequisites

- Rust installed
- HelixDB server running on http://localhost:6969 (if you don't have one, you can deploy one using the instructions below)

## Installing HelixDB

```bash
curl -sSL https://install.helix-db.com | bash
```

## Deploying a HelixDB Instance
Deploy the instance using the following command
```bash
helix push dev
```

## Usage

```bash
cargo run
```

This will run the getting started example that creates users, posts, and demonstrates various database operations.