# chegura
Chegura - chess guru, knows everything about chess, what Melissa would like to know, specially best chess moves

[![Build Status](https://travis-ci.org/Scorpibear/chegura.svg?branch=master)](https://travis-ci.org/Scorpibear/chegura)
[![Coverage Status](https://codecov.io/gh/Scorpibear/chegura/coverage.svg)](https://codecov.io/gh/Scorpibear/chegura)
[![npm version](https://badge.fury.io/js/chegura.svg)](https://www.npmjs.com/package/chegura)

## Install

- Install LTS version of [Node.js](https://nodejs.org/).
- Type from command line:
```
npm install -g chegura
```
## Configure
Create app.config.json with the following structure, specifying correct paths, modifying parameters by your wish
```json
{
  "optimizeSettings": {
    "optimize": false
  },
  "port": 9966,
  "defaultDepth": 40,
  "ricpaClient": {"hostname": "localhost", "port": "9977", "path": ""},
  "analysisQueueFile": "analysis-queue.json",
  "externalEvaluationsFile": "external-evaluations.json",
  "pingUrl": "http://localhost:9966/api/ping",
  "evaluationsLogFile": "evaluations.log"
}
```
ricpaClient, if specified, contains setting to connect to remote chess engine supporting RICPA protocol, e.g. [Remote Chess Engine](https://github.com/Scorpibear/remote-chess-engine)
## Run
Type from command line:
```
chegura
```
or to run as a service:
```
chegura &>chegura.log &
```
## API

POST /api/analyze {moves: ['e4','e5']}

GET /api/userscount

GET,POST /api/ping

GET /api/base

GET /api/fenbase

## Demo

See how it works with Melissa trainer at http://3kgm.online/
