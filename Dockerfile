FROM 235494784270.dkr.ecr.ap-southeast-2.amazonaws.com/node:22.4.0-alpine

# Dependencies stage
FROM base AS deps
# RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  # Install only production dependencies

# Build stage
FROM base AS builder
WORKDIR /webapp
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage (final, lightweight image)
FROM base AS runner
WORKDIR /webapp
COPY --from=builder /webapp/.next ./.next
COPY --from=builder /webapp/public ./public
COPY --from=builder /webapp/package.json ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3002
CMD ["npm", "run", "start"]