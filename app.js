'use strict';

// external classes
const RicpaClient = require('ricpa-client');
const QueueProcessor = require('chess-positions-queue-processor');

// external modules
const http = require('http');
const bestmovedb = require('bestmovedb');

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
const pathToChessEngine = (process.argv.length > 2) ?
  process.argv[2] : config.pathToChessEngine;
const port = config.port;

try {
  // TODO: comment that
  analyzer.setChessEngineOptions(pathToChessEngine, config.uciOptions);
  depthSelector.setDefaultDepth(config.defaultDepth);
  baseManager.readBase();
  baseManager.saveBase();
  const ricpaClient = new RicpaClient(config.ricpaClient);
  const externalEvaluations = new ExternalEvaluation(config.externalEvaluationsFile);
  const queueProcessor = new QueueProcessor({queue, evaluation,
    evaluationSources: [
      externalEvaluations, bestmovedb, ricpaClient
    ],
    analyzer: ricpaClient, 
    strategy: new QueueProcessingStrategy(pgnAnalyzer, baseManager)});
  usageStatistics.load(usageStatisticsSynchronizer);
  const requestProcessor = new RequestProcessor({baseManager, queueProcessor, usageStatistics});
  queue.load(synchronizer.loadQueue(config.analysisQueueFile, [[],[],[],[]]));
  //queue.on('change', (content) => synchronizer.saveQueue(config.analysisQueueFile, content));

  http.createServer(function(req, res) {
    switch (req.url) {
    case '/api/analyze':
      requestProcessor.analyze(req, res);
      break;
    case '/favicon.ico':
      requestProcessor.getFavicon(res);
      break;
    case '/api/getuserscount':
      requestProcessor.getUsersCount(req, res);
      break;
    case '/api/ping':
      requestProcessor.ping(req, res);
      break;
    case '/api/getbase':
    case '/':
    default:
      requestProcessor.getBase(req, res);
    }
  }).listen(port);

  const onEmpty = () => baseManager.optimize(analyzer, config.optimizeSettings);
  //queue.on('empty', onEmpty);
  onEmpty();

  //queueProcessor.process().catch(err => console.error(err));

  console.log('Chegura is ready to process requests on ' + port + ' port');
} catch (err) {
  console.error('Unexpected error: ', err);
}
