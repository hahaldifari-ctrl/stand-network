# STAND Network

> **You are not standing alone.**

STAND Network is a digital platform designed to connect people, churches, ministries, and organizations in support of Christians facing persecution and faith-based violence—beginning in Nigeria and reaching beyond.

Our goal is to help people discover verified needs, connect with trusted partners, and respond with prayer, giving, service, advocacy, and compassion.

## Mission

To help ensure that Christians facing persecution and faith-based violence know that they are not standing alone.

## Six Ways to Stand

- **Pray** — Stand with affected communities in prayer.
- **Give** — Support verified needs through trusted partners.
- **Respond** — Discover needs and find practical ways to help.
- **Volunteer** — Offer your time, skills, and expertise.
- **Partner** — Connect churches, ministries, and organizations.
- **Share Hope** — Help responsibly share stories and raise awareness.

## Project Status

STAND Network is an actively developing platform, initially focused on Nigeria.

The current foundation includes:

- Public-facing web application.
- Backend API.
- PostgreSQL database.
- Prisma ORM and database migrations.
- Authentication foundation.
- Incident reporting and public incident pages.
- Evidence presentation and incident information.
- Organization and response management foundations.
- Monorepo tooling and Docker infrastructure.

Features and workflows are under active development. Not every feature should be considered production-ready.

## Technology

| Area | Technology |
| --- | --- |
| Web application | Next.js, React, TypeScript |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Monorepo | pnpm workspaces, Turborepo |
| Local database infrastructure | Docker Compose |

## Requirements

Install the following:

- Git
- Node.js 22 LTS or newer. The project has also been verified with Node.js 26.7.0.
- pnpm 11
- Docker Desktop with Docker Compose

Check your installations:

```powershell
node --version
pnpm --version
git --version
docker --version
docker compose version
```

## Getting Started

### 1. Clone the repository

```powershell
git clone https://github.com/hahaldifari-ctrl/stand-network.git
cd stand-network
```

### 2. Install dependencies

From the project root:

```powershell
pnpm install
```

### 3. Configure environment variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and review the configuration.

The example configuration is intended for the local Docker database. Update values if you use a different database or port.

Never commit your real `.env` file or expose secrets.

### 4. Start PostgreSQL

From the project root:

```powershell
docker compose up -d
```

Check the database container:

```powershell
docker compose ps
```

### 5. Apply database migrations

```powershell
pnpm --filter api exec prisma migrate deploy
```

This applies existing Prisma migrations to the configured database.

### 6. Start the applications

From the project root:

```powershell
pnpm dev
```

The development environment starts the web application and API through Turborepo.

Default local addresses:

- Web application: http://localhost:3000
- API: http://localhost:3003

The actual API port is determined by the `PORT` environment variable.

## Running Individual Applications

### Web application

```powershell
pnpm --filter web dev
```

### API

```powershell
pnpm --filter api dev
```

## Building the Project

Build the workspace:

```powershell
pnpm build
```

Build only the web application:

```powershell
pnpm --filter web build
```

Build only the API:

```powershell
pnpm --filter api build
```

## Running Tests

Run the workspace test task:

```powershell
pnpm test
```

Run API tests directly:

```powershell
pnpm --filter api test
```

Run API tests in watch mode:

```powershell
pnpm --filter api test:watch
```

Run API test coverage:

```powershell
pnpm --filter api test:cov
```

The web application does not currently define a test script.

## Linting

Run workspace lint tasks:

```powershell
pnpm lint
```

Run API linting:

```powershell
pnpm --filter api lint
```

Run web linting:

```powershell
pnpm --filter web lint
```

Review any automatic formatting or lint fixes before committing changes.

## Environment Variables

The root `.env.example` documents the local environment configuration.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_API_URL` | API base URL used by the web application |
| `PORT` | Port used by the NestJS API |
| `JWT_SECRET` | Secret used for signing authentication tokens |

Use secure values for secrets. Do not commit real credentials, private keys, tokens, or production environment files.

## Database Commands

Start the local database:

```powershell
docker compose up -d
```

Stop the local database:

```powershell
docker compose down
```

View database container status:

```powershell
docker compose ps
```

View database logs:

```powershell
docker compose logs postgres
```

**Warning:** `docker compose down -v` removes the database volume and permanently deletes the local database data. Do not use it unless you intentionally want to reset the database.

## Repository Structure

```text
stand-network/
├── apps/
│   ├── api/        # NestJS backend
│   └── web/        # Next.js frontend
├── packages/       # Shared workspace packages
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
├── package.json
└── README.md
```

## Contributing

Contributions should support the mission of standing with persecuted Christians through responsible reporting, verified needs, trusted partnerships, and compassionate responses.

Before submitting changes:

1. Install dependencies.
2. Configure your local environment.
3. Apply database migrations.
4. Run relevant tests.
5. Build the affected applications.
6. Review your changes before committing.

## Guiding Principle

**See a need. Verify it. Respond with compassion.**
