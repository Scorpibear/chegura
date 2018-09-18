# chegura
Chegura - chess guru, knows everything about chess, what Melissa would like to know, specially best chess moves

[![Build Status](https://travis-ci.org/Scorpibear/chegura.svg?branch=master)](https://travis-ci.org/Scorpibear/chegura)
[![Coverage Status](https://codecov.io/gh/Scorpibear/chegura/coverage.svg)](https://codecov.io/gh/Scorpibear/chegura)
[![npm version](https://badge.fury.io/js/chegura.svg)](https://www.npmjs.com/package/chegura)

## Install

- Install LTS version of Node.js
- Download any chess engine, e.g. https://stockfishchess.org/
- From command line:
```
npm install chegura
cd node_modules/chegura
```
- Edit app.config.json and specify path to executable file of chess engine
- From command line:
```
npm start
```

## API

POST /api/analyze {moves: ['e4','e5']}

GET /api/getuserscount

GET,POST /api/ping

GET /api/getbase

## Demo

See how it works with Melissa trainer at http://shahmaster.ru/melissa
