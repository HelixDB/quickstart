# Go Quickstart

A simple Go application demonstrating HelixDB usage.

## Prerequisites
- Go installed
- HelixDB running on http://localhost:6969 (if you don't have one, you can deploy one using the instructions below)

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
go run getting_started.go
```

This will run the getting started example that creates users, posts, and demonstrates various database operations.