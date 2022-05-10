# Quack
![quack](https://github.com/codecat-io/chat/raw/master/packages/app/resources/icon.png)
Messaging app

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

## TODO

### Channels
- task: notifications should go only to people from channel
- bug: notifications are dupplicated when many sessions
- feat: hiding side menu?
- feat: change channel name? 
- style: mobile support

### Milestones
- feat: channels (currently basic)
- feat: threads in messages
- feat: emoji reactions 
- feat: ability to upload images and files (in progress)
  | drop and paste
  | missing thumbnails generation
- feat: custom emojis

### Critical
- bug: fix paste of multiline text
- feat: ability to refresh native app
- ? bug: different notification sound on mobile
- change credentials to firebase

### DevOps
- define deploy checklist

### Mobile
- change color of status bar

### General
- feat: link preview
- feat: days separated by something
- feat: searching messages
- feat: deleting messages
- feat: custom help messages for home information
- feat: generate icons for notifications
- feat: command for displaying version of app and server
- feat: frontend only commands
- feat: changelog messages when app is updated
- improvement: move link detection to message builder
- improvement: separate users from messages 
- improvement: remove temporary files from gcs after abort
- bug: clicking on notification is not taking to correct window
- bug: paste loosing part of text 
- improvement: gcs images cacheing

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
