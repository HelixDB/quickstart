# Website

This is a simple website demo

## Prerequisites

- Node.js installed
- HelixDB running locally on port 6969

## Frontend

```bash
npm install
npm run dev
```

## Running the backend

To run the backend, you can go into the backend directory of your choice and run the following command:

### Go

```bash
go run main.go
```

### Python

```bash
uv venv
uv sync
uv run main.py
```

or 


```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Rust

```bash
cargo run
```

### TypeScript

The TypeScript backend is built into the frontend. There is a toggle button to switch between the API and the TypeScript SDK.
You can find the TypeScript backend in the [ts-sdk.ts](/website/frontend/src/app/ts-sdk.ts) file.