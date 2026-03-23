# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --ignore-scripts

COPY . .

# docker mode: NODE_ENV=development so axios uses relative paths (/api/...)
# which nginx then proxies to the backend — mirrors how the browser behaves
# in production (where api.hostname is the direct target).
# Feature flags match production (see .env.docker).
RUN yarn build --mode docker

# ── Stage 2: serve ──────────────────────────────────────────────────────────
FROM nginx:1.25-alpine

# Copy compiled SPA assets
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config template – BACKEND_URL is substituted at container startup
COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template

# Entrypoint: runs envsubst then starts nginx
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Default value so the image works out of the box when the compose
# backend service is named 'backend'
ENV BACKEND_URL=http://backend:8080

EXPOSE 80

HEALTHCHECK --interval=5s --timeout=3s --retries=5 \
  CMD wget -q --spider http://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
