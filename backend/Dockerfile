FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY backend/ .

# Tambah user non-root
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
