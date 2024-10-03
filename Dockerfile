FROM node:20-alpine3.20 as build
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./app/package.json ./app/package.json
RUN npm install
COPY ./app ./app

ENV APP_VERSION=1.0.0
ENV APP_NAME=quack

RUN npm run build



FROM denoland/deno:alpine-1.45.4
RUN apk -U upgrade
run apk add vips-cpp build-base vips vips-dev
ENV ENVIRONMENT=production
run mkdir -p /app
WORKDIR /app
COPY ./deno ./deno
COPY ./migrations ./migrations
COPY ./deno.* ./
COPY ./migrate-mongo-config.js ./migrate-mongo-config.js
RUN deno cache npm:migrate-mongo
RUN deno cache ./deno/server/main.ts
COPY ./entrypoint.sh ./entrypoint.sh
COPY --from=build /app/app/dist /app/public

ENV APP_VERSION=1.0.0
ENV PUBLIC_DIR=/app/public
ENV PORT=8080

RUN chmod +x ./entrypoint.sh
EXPOSE 8080
CMD sh ./entrypoint.sh
