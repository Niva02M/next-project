FROM node:20.14.0-alpine

WORKDIR /webapp
COPY package*.json ./
RUN npm install

COPY . .
# RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
