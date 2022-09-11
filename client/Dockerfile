# Step 1. Rebuild the source code only when needed
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./

RUN  npm ci; 
RUN \
    if [ -f package-lock.json ]; then npm ci; \
    else echo "package-lock.json not found." && exit 1; \
    fi

COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY components ./components
COPY config ./config
COPY next.config.js .
COPY .eslintrc.json ./.eslintrc.json
COPY server.js ./server.js


# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG MQTT_URI
ENV MQTT_URI=${MQTT_URI}

# Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Step 2. Production image, copy all the files and run next
FROM node:18-alpine AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/config ./config
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/server.js ./server.js

# Environment variables must be redefined at run time
ARG MQTT_URI
ENV MQTT_URI=${MQTT_URI}
ENV NODE_ENV production

# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

CMD npm start
