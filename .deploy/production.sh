#!/bin/sh

sudo docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
