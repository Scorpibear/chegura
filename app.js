#!/usr/bin/env node

'use strict';

// external classes
const RicpaClient = require('ricpa-client');
const QueueProcessor = require('fen-queue-processor');

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
const api = require('./app/api');

try {
  depthSelector.setDefaultDepth(config.defaultDepth);
  pgnAnalyzer.setMovesLimit(config.movesToStore);
  baseManager.readBase();
  baseManager.index();
  const ricpaClient = config.ricpaClient ? new RicpaClient(config.ricpaClient) : null;
  const externalEvaluations = new ExternalEvaluation(config.externalEvaluationsFile);
  const evaluationSources = [externalEvaluations, baseManager];
  if (ricpaClient) evaluationSources.push(ricpaClient);
  analyzer.setSettings({ricpaClient, pingUrl: config.pingUrl});
  const queueProcessor = new QueueProcessor({queue, evaluation, evaluationSources,
    analyzer, 
    strategy: new QueueProcessingStrategy({pgnAnalyzer, baseProvider: baseManager})});
  usageStatistics.load(usageStatisticsSynchronizer);
  const requestProcessor = new RequestProcessor({baseManager, queueProcessor, usageStatistics, analyzer});
  queue.load(synchronizer.loadQueue(config.analysisQueueFile, [[],[],[],[]]));
  queue.on('change', (content) => synchronizer.saveQueue(config.analysisQueueFile, content));
  api.register(requestProcessor, config.port);

  const onEmpty = () => {
    console.log('queue is empty');
    baseManager.optimize({settings: config.optimizeSettings}).then(() => {
      return queueProcessor.process();
    }).catch(err => console.error(err));
  };
  queue.on('empty', onEmpty);
  onEmpty();

  console.log(`Chegura is ready to process requests on ${config.port} port`);
} catch (err) {
  console.error('Unexpected error: ', err);
}
