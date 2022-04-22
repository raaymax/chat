# Quack
![quack](https://github.com/codecat-io/chat/raw/master/packages/app/resources/icon.png)
Messaging app

## Motivation

Create fully private messaging application. 
It needs to be cheep and work reliably.
Goal is to minimize consts as much as possible.
Do not exceed 20USD / month!!

## Decisions

### Database
Serverless mongodb instance because it's reliable and we pay only for what we used.

### Server
It would be nice to have a serverless solution but for now cheepest GCE is used.
No idea how to propagate messages to other serverless instances. 
mongo, redis, postgres need to be hosted to be able to watch for messages.
Maybe pub/sub would work but it seems complicated.

## TODO

### Critical
- bug: notifications should work always!
- bug: fix paste of multiline text
- feat: displaying images in messages
- feat: ability to refresh native app
- deploy: server compatible with mobile app

### DevOps
- fix production deployment 
- add signing step for app build in github actions
- define deploy checklist

### General
- feat: link preview
- feat: days separated by something
- feat: searching messages
- feat: milestone: threads in messages
- feat: milestone: emoji reactions 
- feat: milestone: ability to paste images
- feat: deleting messages
- feat: custom help messages for home information
- feat: generate icons for notifications
- feat: set icon for app
- feat: set splash screen for app
- feat: switch to FCM notifications in web version
- improvement: move link detection to message builder
- improvement: remove "session restored" message
- improvement: separate users from messages 
- bug: line wrapping in wrong place
- bug: clicking on notification is not taking to correct window
- bug: file upload wrapps text in input box
- bug: messages scrolling to sides
- bug: paste loosing part of text 
- bug: send ping only if connected

### Message editor
- feat: focus input on any key press
- feat: link creation when typing
- feat: paste of :name: should translate to emoji
- feat: formatting: code formatting when between tildas
- feat: formatting: codeblock formatting when between 3tildas
- feat: formatting: make ':)' and others translate to emoji
- bug: cannot ctrl-v text with emojis from slack
- bug: formats are working everywhere not just in input box
- bug: formats can't be toggled off
- bug: writing links by hand is broken by emoji selector
- bug: link detection on phone is not working

### Postponed
- feat: define web share target for sharing
- feat: mark unread messages



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
