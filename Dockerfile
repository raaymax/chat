FROM node:17-alpine AS appbuild
ARG commit
ENV COMMIT=$commit
WORKDIR /usr/src/app
COPY package*.json ./
COPY web/package*.json ./web/
RUN npm install --production=false
RUN npm install -ws --production=false
COPY web/webpack.config.js ./web/webpack.config.js
COPY web/babel.config.js ./web/babel.config.js
COPY ./web/src ./web/src
COPY ./web/public ./web/public
RUN npm run -w @quack/web build

FROM node:17-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY web/package*.json ./web/
RUN npm install --production
RUN npm install -ws --production
COPY --from=appbuild /usr/src/app/web/dist ./web/dist
COPY ./src ./src
COPY ./migrations ./migrations
COPY ./knexfile.js ./knexfile.js
COPY ./.deploy ./.deploy
EXPOSE 8080
CMD sh ./.deploy/startup.sh
