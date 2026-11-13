# syntax=docker/dockerfile:1
#
# NDS docs site (TanStack Start) — build and run from any branch.
#   docker compose up --build              (repo root)
#   docker build -f apps/docs/Dockerfile -t nds-docs \
#     --build-arg GIT_SHA=$(git rev-parse HEAD) \
#     --build-arg GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD) .
#
# Build context is the repository root (the site depends on workspace packages).
#
# Behind a TLS-inspecting proxy: pass the proxy with Docker's predefined build args
# (--build-arg HTTPS_PROXY=…, not stored in the image) and its CA bundle as an optional
# BuildKit secret (--secret id=extra_ca,src=/path/ca.crt). Only the download steps use it.

ARG NODE_IMAGE=node:22.23.5-alpine

# ---------------------------------------------------------------------------
# base: Node + pnpm via Corepack, at the version pinned in package.json "packageManager"
FROM ${NODE_IMAGE} AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    PNPM_HOME=/pnpm \
    TURBO_TELEMETRY_DISABLED=1 \
    CI=true
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /repo
COPY package.json ./
RUN --mount=type=secret,id=extra_ca,required=false \
    if [ -s /run/secrets/extra_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/extra_ca; fi \
 && corepack enable && corepack install && pnpm --version

# ---------------------------------------------------------------------------
# deps: lockfile → pnpm fetch (cached until the lockfile changes),
# then the workspace manifests → offline install (cached until a manifest changes).
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=secret,id=extra_ca,required=false \
    if [ -s /run/secrets/extra_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/extra_ca; fi \
 && pnpm fetch
COPY --parents packages/*/package.json apps/*/package.json ./
RUN pnpm install --offline --frozen-lockfile

# ---------------------------------------------------------------------------
# build: the docs site and every workspace package it depends on.
FROM deps AS build
COPY . .
# Shown in the site footer as «build <branch>@<short sha>». Declared late so a new
# commit only invalidates this stage, not the dependency layers.
ARG GIT_SHA=unknown
ARG GIT_BRANCH=local
RUN pnpm turbo run build --filter=@negaresh/docs...
# srvx serves dist/client and the server entry; everything else is bundled into dist/server.
RUN mkdir -p /out/node_modules \
 && cp -RL apps/docs/node_modules/srvx /out/node_modules/srvx \
 && cp -R apps/docs/dist /out/dist

# ---------------------------------------------------------------------------
# runtime: built output only, non-root, no package manager, no source.
FROM ${NODE_IMAGE} AS runtime
ARG GIT_SHA=unknown
ARG GIT_BRANCH=local
ENV NODE_ENV=production \
    PORT=3000
LABEL org.opencontainers.image.title="nds-docs" \
      org.opencontainers.image.description="Negaresh Design System documentation site" \
      org.opencontainers.image.source="https://github.com/hramin/negaresh-design-system" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.ref.name="${GIT_BRANCH}"
WORKDIR /app
COPY --from=build --chown=node:node /out/ ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/healthz" || exit 1
# Fonts (Vazirmatn subset) are part of dist/client: no CDN at runtime.
CMD ["sh", "-c", "exec node node_modules/srvx/bin/srvx.mjs --prod --port \"$PORT\" --static ../client dist/server/server.js"]
