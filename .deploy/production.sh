#!/bin/sh

echo $(pwd)
sudo docker run --rm -v "$(pwd):/mnt" -w "/mnt" node:17-alpine sh .deploy/install.sh
sudo docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
