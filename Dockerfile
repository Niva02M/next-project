FROM 180294189506.dkr.ecr.ap-southeast-2.amazonaws.com/node:22.13.0-alpine3.21 AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM base AS builder

WORKDIR /webapp
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

EXPOSE 3002

CMD [ "npm", "run", "start" ]