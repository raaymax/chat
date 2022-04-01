#!/bin/sh

npm i
npm i -ws
npm run -w @quack/web build
npx knex migrate:latest
