"use strict";

var http = require('http');
var analyzer = require('./app/analysis/analyzer');
var baseManager = require('./app/chessbase/base-manager');
var requestProcessor = require('./app/request-processor');
let config = require('./app/config');
let port = config.port;

try {
  analyzer.setUciOptions(config.uciOptions);
  baseManager.readBase();
  baseManager.saveBase();
  http.createServer(function(req, res) {
    switch (req.url) {
      case "/api/analyze":
        requestProcessor.analyze(req, res);
        break;
      case "/favicon.ico":
        requestProcessor.getFavicon(res);
        break;
      case "/api/getuserscount":
        requestProcessor.getUsersCount(req, res);
        break;
      case "/api/getbase":
      case "/":
      default:
        requestProcessor.getBase(req, res);
    }
  }).listen(port);

  baseManager.optimize(analyzer, config.optimizeSettings);

  console.log("Chegura is ready to process requests on " + port + " port");
} catch (err) {
  console.error('Unexpected error: ' + err);
}
