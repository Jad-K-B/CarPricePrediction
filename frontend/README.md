# AutoValue AI frontend

This directory contains the standalone AutoValue AI frontend. It preserves the existing AutoValue design and sends valuation requests to the configured FastAPI POST /predict endpoint.

## Run locally

From this directory:

    pnpm install
    cp .env.example .env
    pnpm dev

The VITE_API_BASE_URL variable points to the deployed FastAPI service. To use another compatible service, change that variable in your local .env file without modifying the application source.

## Verify

    pnpm run typecheck
    pnpm run build
