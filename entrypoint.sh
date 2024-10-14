#!/bin/sh
if [ -f ".envrc" ]; then
  . .envrc
fi
#deno task migrate
deno task start
