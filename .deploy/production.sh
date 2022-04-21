#!/bin/sh

sudo docker build -t quack:latest .
sudo docker stack deploy --compose-file=$(pwd)/docker-compose.prod.yml Chat
