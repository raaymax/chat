#!/bin/sh

sudo docker build --build-arg commit=${COMMIT_HASH} -t quack:latest .
sudo env COMMIT_HASH=${COMMIT_HASH} docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
