# Build from the MONOREPO ROOT:
#   docker build -f apps/auth-service/Dockerfile -t grandis-auth-service .

FROM node:22-slim AS base
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

FROM base AS deps
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/product-database exec prisma generate

EXPOSE 8007

CMD ["pnpm", "--filter", "auth-service", "run", "start"]