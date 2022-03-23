#!/bin/sh

echo $(pwd)
sudo docker run --rm -v "$(pwd):/mnt" node:17-alpine "cd /mnt && npm i"
sudo docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
