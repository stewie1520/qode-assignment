# Qode Assignment

[![CI/CD](https://github.com/stewie1520/qode-assignment/actions/workflows/deploy.yml/badge.svg)](https://github.com/hieudoanm/qode-assignment/actions/workflows/deploy.yml)

A monorepo project with web app and microservices.

## Prerequisites

- **Node.js** 25.x
- **pnpm** 10.20.0

## Project Structure

```
apps/
├── web/           # Next.js web application
├── user-service/  # User service
└── photo-service/ # Photo service
packages/
├── config/        # Shared configuration
└── middlewares/   # Shared middlewares
```

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` for each app:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/user-service/.env.example apps/user-service/.env
cp apps/photo-service/.env.example apps/photo-service/.env
```

### 3. Setup db


```bash
cd ./apps/photo-service
pnpm run db:generate # generate Prisma models
pnpm run db:migrate

cd -
cd ./apps/user-service
pnpm run db:generate # generate Prisma models
pnpm run db:migrate
```

### 4. Run Development

Run all services:

```bash
pnpm dev
```

Or run individual services:

```bash
pnpm dev:web    # Web app on port 3001
pnpm dev:user   # User service on port 3002
pnpm dev:photo  # Photo service on port 3000
```

## Running with Docker Compose

### 1. Environment Setup for Docker

Copy `.env.example` to `.env.docker` for each app:

```bash
cp apps/web/.env.example apps/web/.env.docker
cp apps/user-service/.env.example apps/user-service/.env.docker
cp apps/photo-service/.env.example apps/photo-service/.env.docker
```

### 2. Build and Run

```bash
docker compose up --build
```

### 3. Services

| Service       | Port |
| ------------- | ---- |
| Web           | 3001 |
| User Service  | 3002 |
| Photo Service | 3000 |
