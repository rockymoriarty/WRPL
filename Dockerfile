FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src/backend /usr/src/app

EXPOSE 3000

CMD [ "node", "server.js" ] 