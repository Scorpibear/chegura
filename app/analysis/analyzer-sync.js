"use strict";

// classes
const Chess = require('./chess').Chess;
const AnalysisResultsProcessor = require('./analysis-results-processor');

// singletons
const engine = require('./engine');
const baseManager = require('../chessbase/base-manager');
const analysisQueue = require('./analysis-queue');
const analyzer = require('./analyzer');
const depthSelector = require('./depth-selector');
const pgnAnalyzer = require('./pgn-analyzer');

let isAnalysisInProgress = false;

const finalize = function() {
  isAnalysisInProgress = false;
  analyzer.analyzeLater();
};

const analyze = function() {
  if (isAnalysisInProgress)
    return;
  isAnalysisInProgress = true;
  let moves = analysisQueue.getFirst();

  if (moves === null || moves === undefined) {
    if (baseManager) {
      baseManager.optimize(analyzer);
    }
    isAnalysisInProgress = false;
    return;
  }
  if (pgnAnalyzer.isError(moves, baseManager.getBase())) {
    console.log('Not optimal position will not be analyzed: ' + moves);
    isAnalysisInProgress = false;
    analyzer.analyzeLater();
    return;
  }
  console.log("start to analyze moves: " + moves);
  let chess = new Chess();
  let initialDepth = depthSelector.getDepthToAnalyze(moves, baseManager.getBase());
  let analysisResultsProcessor = new AnalysisResultsProcessor(chess, initialDepth, depthSelector, moves);
  moves.forEach(function(move) {
    chess.move(move);
  });
  let fen = chess.fen();
  engine.analyzeToDepth(fen, initialDepth).then(data => {
    analysisResultsProcessor.process(data);
    finalize();
  }).fail(() => {
    finalize();
  });
};

exports.analyze = analyze;

exports.isAnalysisInProgress = function() {
  return isAnalysisInProgress;
};

exports.setUciOptions = options => {
  engine.setUciOptions(options);
};
