# Step 1. Rebuild the source code only when needed
FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./

RUN  npm ci; 
RUN \
    if [ -f package-lock.json ]; then npm ci; \
    else echo "package-lock.json not found." && exit 1; \
    fi

FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./
# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030

#ARG MQTT_URI
#ENV MQTT_URI=$MQTT_URI
# Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Step 2. Production image, copy all the files and run next
FROM node:18-alpine AS runner

WORKDIR /app
RUN apk add --no-cache --upgrade bash

ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/config ./config
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/server.js ./server.js
COPY --from=builder --chown=nextjs:nodejs --chmod=755 /app/entrypoint.sh ./entrypoint.sh
COPY --from=builder --chown=nextjs:nodejs /app/.env.production ./.env.production

# Environment variables must be redefined at run time
#ARG MQTT_URI
#ENV MQTT_URI=$MQTT_URI

# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

USER nextjs
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD npm start
