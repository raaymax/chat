#!/bin/sh

sudo docker build -t quack:latest .
sudo cp ../chat.config.js ./
sudo env COMMIT_HASH=${COMMIT_HASH} docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
sudo docker image prune -f
