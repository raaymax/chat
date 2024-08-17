#!/bin/sh
. .envrc
deno task migrate
deno task start
