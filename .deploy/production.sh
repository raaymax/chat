#!/bin/sh

APP_VERSION="$(cat package.json | awk '/version/{print $2}' | sed 's/[",]//g')"
sudo cp ../chat.config.js ./
gcloud builds submit --region europe-central2 --tag gcr.io/codecat-quack/quack:${APP_VERSION}
sudo env APP_VERSION=${APP_VERSION} COMMIT_HASH=${COMMIT_HASH} docker stack deploy --with-registry-auth --compose-file=$(pwd)/docker-compose.prod.yml Chat
sudo docker image prune -f
