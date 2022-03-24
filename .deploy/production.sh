#!/bin/sh

echo ${COMMIT_HASH}
sudo docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
