#!/bin/sh
. .envrc
npx knex migrate:latest
npm start
