<p align="center">
  <img src="quack.png" title="hover text">
</p>

[![Tests](https://github.com/raaymax/chat/actions/workflows/release.yml/badge.svg)](https://github.com/raaymax/chat/actions/workflows/release.yml)
[![Release](https://shields.io/github/v/release/raaymax/chat?display_name=tag)](https://shields.io/github/v/release/raaymax/chat?display_name=tag)
[![CodeFactor](https://img.shields.io/codefactor/grade/github/raaymax/chat)](https://www.codefactor.io/repository/github/raaymax/chat)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the Quack - private chatting application.

Quack is a free and open-source chat application designed for private use. 
With its easy-to-use interface and seamless integration with web browsers, Quack is a Progressive Web Application that can be accessed from any platform that has a web browser, such as Chrome.

<p align="center">
  <img src="quack_lorem.png" width="350" title="screenshot">
</p>

Quack is inspired by Slack, but is more affordable for private use. Although it doesn't have any unique features, it combines the best features from other communicators.
Quack prioritizes privacy and security by allowing users to host their own app, ensuring that they have complete control over their data.

## Configuration

To override default settings `chat.config.js` file can be created in root directory of the project.
File should export folowing object:
```javascript
type ChatConfig = {
  port?: number // default `PORT` env otherwise `8080`
  sessionSecret?: string // auto generated on first run to `secrets.json` but can be overwritten here
  trustProxy?: bool | string | number // default `uniquelocal` ref: https://expressjs.com/en/guide/behind-proxies.html
  vapid?: { // auto generated on first run to `secrets.json` but can be overwritten here
    publicKey: string
    secretKey: string
  },
  databaseUrl?: string // default `DATABASE_URL` env
  cors?: string[] // by default [ 'https?://localhost(:[0-9]{,4})' ],
  storage?: {
    type: 'memory' | 'gcs' | 'fs' // default `fs` / `memory` in tests
    directory: string // where to save files when type `fs`
    bucket: string // bucket name for `gcs`
  }
  baseUrl?: string // default 'http://localhost:8080' base url for links creation
};
```

## Environment variables

`GOOGLE_APPLICATION_CREDENTIALS` [string] - (optional) when gcs storage method is used

## Requirements
- MongoDB
- (optional) google cloud key for GCS


## Files persistence
Currently supporting Google Cloud Storage. To enable it set `fileStorage` in config file to `gcs` specify `gcsBucket`
and set `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

## Decisions

### Database
We're using a serverless MongoDB instance because of its reliability and cost-effectiveness - we only pay for what we use.
The cheapest option available on Mongo Atlas is sufficient for application, as we don't require any internal pub/sub functionality.


### Server
It would be nice to have a serverless solution, but for now, the cheapest option is using GCE. 
I have no idea how to propagate messages to other serverless instances without a hosted pub/sub service.
MongoDB, Redis, and Postgres need to be hosted to watch for messages.
Perhaps Google Cloud Pub/Sub would be a good option?

## Plugins
Chat have plugin system. Example plugin can be found in `plugins/example`.
How to use plugins and plugin hook points TBA.


## Local development setup

```bash
pnpm i
docker-compose up -d
pnpm run dev
```

## Default credentials

```
admin / 123
```
New users can be invited with `/invite` command which will generate single use link for user registration.


## License

MIT License

Copyright (c) 2023 CodeCat
