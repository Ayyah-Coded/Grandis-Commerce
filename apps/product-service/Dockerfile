# Build this from the MONOREPO ROOT, not this folder:
#   docker build -f apps/product-service/Dockerfile -t grandis-product-service .
# docker-compose.yml already does this for you via `context: .`

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

EXPOSE 8000

CMD ["pnpm", "--filter", "product-service", "run", "start"]