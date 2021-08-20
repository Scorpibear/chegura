const http = require('http');
const url = require('url');

function createMap(processor) {
  return function(req, res) {
    console.log(`${req.method} ${req.url}`);
    switch (url.parse(req.url).pathname) {
    case '/api/analyze':
      processor.analyze(req, res);
      break;
    case '/api/userscount':
    case '/api/getuserscount':
      processor.getUsersCount(req, res);
      break;
    case '/api/ping':
      processor.ping(req, res);
      break;
    case '/api/base':
    case '/api/getbase':
      processor.getBase(req, res);
      break;
    case '/api/fenbase':
      processor.getFenBase(req, res);
      break;
    default:
      processor.default(res);
    }
  };
}

function register(requestProcessor, port) {
  http.createServer(createMap(requestProcessor)).listen(port);
}

module.exports = {
  register,
  createMap
};
