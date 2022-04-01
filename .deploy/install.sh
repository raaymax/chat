#!/bin/sh

npm i
npm i -ws --production=false
npm run -w @quack/web build
npx knex migrate:latest
npm start
