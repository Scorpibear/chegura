#!/usr/bin/env node

'use strict';

// external classes
const RicpaClient = require('ricpa-client');
const QueueProcessor = require('fen-queue-processor');

// external modules
const http = require('http');
const url = require('url');

// internal classes
const ExternalEvaluation = require('./app/analysis/external-evaluation');
const QueueProcessingStrategy = require('./app/analysis/queue-processing-strategy');
const RequestProcessor = require('./app/request-processor');

// internal modules
const analyzer = require('./app/analysis/analyzer');
const baseManager = require('./app/chessbase/base-manager');
const config = require('./app/config');
const depthSelector = require('./app/analysis/depth-selector');
const evaluation = require('./app/chessbase/evaluation');
const pgnAnalyzer = require('./app/analysis/pgn-analyzer');
const queue = require('./app/analysis/analysis-queue');
const synchronizer = require('./app/analysis/synchronizer');
const usageStatistics = require('./app/usage-statistics');
const usageStatisticsSynchronizer = require('./app/usage-statistics-synchronizer');
const port = config.port;

try {
  depthSelector.setDefaultDepth(config.defaultDepth);
  baseManager.readBase();
  baseManager.index();
  const ricpaClient = config.ricpaClient ? new RicpaClient(config.ricpaClient) : null;
  const externalEvaluations = new ExternalEvaluation(config.externalEvaluationsFile);
  const evaluationSources = [externalEvaluations, baseManager];
  if (ricpaClient) evaluationSources.push(ricpaClient);
  const queueProcessor = new QueueProcessor({queue, evaluation, evaluationSources,
    analyzer: {analyze: (item) => {
      if(ricpaClient) {
        item.pingUrl = config.pingUrl;
        console.log(`POST '${item.fen}' w/ depth ${item.depth} to ${ricpaClient.config.fullpath}`);
        ricpaClient.postFen(item);
      } else {
        console.log('set ricpaClient settings in app.config.json to analyze positions');
      }
    }}, 
    strategy: new QueueProcessingStrategy({pgnAnalyzer, baseProvider: baseManager})});
  usageStatistics.load(usageStatisticsSynchronizer);
  const requestProcessor = new RequestProcessor({baseManager, queueProcessor, usageStatistics, analyzer});
  queue.load(synchronizer.loadQueue(config.analysisQueueFile, [[],[],[],[]]));
  queue.on('change', (content) => synchronizer.saveQueue(config.analysisQueueFile, content));
  http.createServer(function(req, res) {
    console.log(`${req.method} ${req.url}`);
    switch (url.parse(req.url).pathname) {
    case '/api/analyze':
      requestProcessor.analyze(req, res);
      break;
    case '/api/getuserscount':
      requestProcessor.getUsersCount(req, res);
      break;
    case '/api/ping':
      requestProcessor.ping(req, res);
      break;
    case '/api/getbase':
      requestProcessor.getBase(req, res);
      break;
    default:
      requestProcessor.default(res);
    }
  }).listen(port);

  const onEmpty = () => {
    console.log('queue is empty');
    baseManager.optimize({settings: config.optimizeSettings}).then(() => {
      queueProcessor.process();
    });
  };
  queue.on('empty', onEmpty);
  onEmpty();

  queueProcessor.process().catch(err => console.error(err));

  console.log('Chegura is ready to process requests on ' + port + ' port');
} catch (err) {
  console.error('Unexpected error: ', err);
}
