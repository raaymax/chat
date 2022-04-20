#!/bin/sh

sudo docker build --build-arg  -t quack:latest .
sudo docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
