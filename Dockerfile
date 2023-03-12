FROM node:17-alpine AS appbuild
RUN npm i -g pnpm
RUN apk -U upgrade
ENV ENVIRONMENT=production
WORKDIR /usr/src/app
COPY package*.json ./
COPY pnpm-*.yaml ./
COPY packages/server/package*.json ./packages/server/
COPY packages/app/package*.json ./packages/app/
COPY packages/rpc/package*.json ./packages/rpc/
COPY ./packages/rpc ./packages/rpc
#RUN npm install -g npm
RUN pnpm i
COPY chat.config.js ./
COPY packages/app/webpack.config.js ./packages/app/webpack.config.js
COPY packages/app/babel.config.js ./packages/app/babel.config.js
COPY ./packages/app/src ./packages/app/src
RUN pnpm run build

FROM node:17-alpine
RUN npm i -g pnpm
RUN apk -U upgrade
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
COPY pnpm-*.yaml ./
COPY packages/server/package*.json ./packages/server/
COPY packages/app/package*.json ./packages/app/
COPY ./packages/rpc ./packages/rpc
#RUN npm install -g npm
RUN pnpm i --prod
COPY --from=appbuild /usr/src/app/packages/app/dist ./packages/app/dist
COPY ./packages/server/src ./packages/server/src
COPY ./.deploy ./.deploy
COPY ./migrations ./migrations
COPY migrate-mongo-config.js ./
COPY chat.config.js ./

EXPOSE 8080
CMD sh ./.deploy/startup.sh
