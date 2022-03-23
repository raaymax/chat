#!/bin/sh

npm i
npx knex migrate:latest
