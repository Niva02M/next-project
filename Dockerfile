FROM node:20.14.0-alpine AS base

WORKDIR /webapp
COPY package*.json ./
RUN yarn

COPY . .
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]

