# Этап 1: сборка Nuxt
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run generate

# Этап 2: статический хостинг через nginx
FROM nginx:alpine

COPY --from=builder /app/.output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
