"use strict";

const http = require('http');
const analyzer = require('./app/analysis/analyzer');
const baseManager = require('./app/chessbase/base-manager');
const requestProcessor = require('./app/request-processor');
const config = require('./app/config');
const depthSelector = require('./app/analysis/depth-selector');
const pathToChessEngine = (process.argv.length > 2) ?
  process.argv[2] : config.pathToChessEngine;
const port = config.port;

try {
  analyzer.setChessEngineOptions(pathToChessEngine, config.uciOptions);
  depthSelector.setDefaultDepth(config.defaultDepth);
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
      case "api/results":
        requestProcessor.saveResults(req, res);
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
  console.error('Unexpected error: ', err);
}
