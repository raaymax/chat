#!/bin/sh
. .envrc
npx migrate-mongo up
npm start
