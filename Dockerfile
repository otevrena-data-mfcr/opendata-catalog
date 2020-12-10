FROM node:lts as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm run package


FROM nginx:alpine as server

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/package/* ./