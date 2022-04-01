#!/bin/sh

npm i
npm i -ws
npx knex migrate:latest
