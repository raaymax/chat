FROM node:20-alpine AS appbuild
RUN npm i -g pnpm
RUN npm i -g turbo 
RUN apk -U upgrade
ENV ENVIRONMENT=production
WORKDIR /usr/src/app
COPY package*.json ./
COPY pnpm-*.yaml ./
COPY packages/server/package*.json ./packages/server/
COPY packages/app/package*.json ./packages/app/
COPY packages/rpc/package*.json ./packages/rpc/
COPY packages/storage/package*.json ./packages/storage/
COPY ./config ./config
COPY ./packages/app ./packages/app
COPY ./packages/rpc ./packages/rpc
COPY ./packages/repo ./packages/repo
COPY ./packages/storage ./packages/storage
RUN pnpm i
COPY chat.config.js ./
COPY turbo.json ./
RUN turbo build

FROM node:20-alpine
RUN npm i -g pnpm
RUN apk -U upgrade
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
COPY pnpm-*.yaml ./
COPY packages/server/package*.json ./packages/server/
COPY packages/app/package*.json ./packages/app/
COPY ./config ./config
COPY ./packages/rpc ./packages/rpc
COPY ./packages/repo ./packages/repo
COPY ./packages/storage ./packages/storage
RUN pnpm i --prod
COPY --from=appbuild /usr/src/app/packages/app/dist ./packages/app/dist
COPY --from=appbuild /usr/src/app/packages/rpc/dist ./packages/rpc/dist
COPY --from=appbuild /usr/src/app/packages/repo/dist ./packages/repo/dist
COPY --from=appbuild /usr/src/app/packages/storage/dist ./packages/storage/dist
COPY ./packages/server/src ./packages/server/src
COPY ./migrations ./migrations
COPY ./entrypoint.sh ./
COPY migrate-mongo-config.js ./
COPY chat.config.js ./

EXPOSE 8080
CMD sh ./entrypoint.sh
