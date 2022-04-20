FROM node:17-alpine AS appbuild
ARG commit
ENV COMMIT=$commit
ENV ENVIRONMENT=production
WORKDIR /usr/src/app
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY packages/app/package*.json ./packages/app/
RUN npm install --production=false
COPY packages/app/webpack.config.js ./packages/app/webpack.config.js
COPY packages/app/babel.config.js ./packages/app/babel.config.js
COPY ./packages/app/src ./packages/app/src
COPY ./packages/app/public ./packages/app/public
RUN npm run -w @quack/app build

FROM node:17-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY packages/app/package*.json ./packages/app/
RUN npm install --production
COPY --from=appbuild /usr/src/app/packages/app/dist ./packages/app/dist
COPY ./packages/server/src ./packages/server/src
COPY ./.deploy ./.deploy
EXPOSE 8080
CMD sh ./.deploy/startup.sh
