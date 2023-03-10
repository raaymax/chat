# Quack
![quack](https://github.com/codecat-io/chat/raw/master/packages/app/resources/icon.png)
Messaging app


## Requirements
- Firebase

## Objectives

- Create fully private messaging application. 
- It needs to work reliably.
- Minimize consts as much as possible.
- Do not exceed 20USD / month!!

## Decisions

### Database
Serverless mongodb instance because it's reliable and we pay only for what we used.

### Server
It would be nice to have a serverless solution but for now cheepest GCE is used.  
No idea how to propagate messages to other serverless instances.  
mongo, redis, postgres need to be hosted to be able to watch for messages.  
Maybe pub/sub would work but it seems complicated.  

## Local development setup

Then create local mongo server with docker-compose

```bash
docker-compose -f docker-compose.dev.yml up -d
```

next start local development server

```bash
npm run dev
```

## License

MIT - Feel free to use this code however you want.
