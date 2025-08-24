# Multi-stage build: build Angular app with Node (slim), serve with Nginx (alpine)

FROM node:22-bookworm-slim AS build
WORKDIR /app

# Disable npm audit/fund noise in CI-like builds
ENV npm_config_audit=false \
    npm_config_fund=false \
    NG_CLI_ANALYTICS=false

COPY package*.json ./
# Prefer ci if lockfile exists; fallback to install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source and build
COPY . .
RUN npm run build

# --- Runtime image ---
FROM nginx:1.27-alpine AS runtime

# Replace default site with SPA-friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean and copy static build (Angular 20 default output path)
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/ghgame-web/browser /usr/share/nginx/html

EXPOSE 80

# Optional: basic healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
