#!/bin/sh

echo ${COMMIT_HASH}
sudo env COMMIT_HASH=${COMMIT_HASH} docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
