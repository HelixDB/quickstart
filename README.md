# HelixDB Quickstart

[Helix-DB](https://github.com/HelixDB/helix-db) | [Homepage](https://www.helix-db.com/) | [Docs](https://docs.helix-db.com/)

This is the quickstart repository for HelixDB, a powerful graph-vector database written in Rust.
It provides a simple way to get started with HelixDB with various SDKs and a deployable website demo.

## Helix Schema and Queries

The Helix schema and queries are defined in the [helixdb-cfg](/helixdb-cfg) directory.
The schema is defined in the [schema.hx](helixdb-cfg/schema.hx) file.
The queries are defined in the [queries.hx](helixdb-cfg/queries.hx) file.

We will be using the same schema and queries for all the quickstart examples and the website demo.
You will only need one HelixDB instance running locally to run all the quickstart examples and the website demo.

## Quickstart Examples

The quickstart example for each SDK is located in their respective folder.
Each example is a standalone project that demonstrates a specific feature of HelixDB.
You can find the instructions on how to run each example in their respective README files.

## Website Deployment Demo

The website deployment demo is located in the [website](/website) directory.
It is a simple website that demonstrates the use of HelixDB with various SDKs.
You can find the instructions on how to run the website in the [website/README.md](website/README.md) file.

The website has a Next.js frontend and various backend options built from each SDK.
You can find the instructions on how to run the website in the [website/README.md](website/README.md) file.