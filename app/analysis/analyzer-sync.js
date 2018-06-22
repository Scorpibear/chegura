"use strict";

// classes
const Chess = require('./chess').Chess;
const AnalysisResultsProcessor = require('./analysis-results-processor');
const Engine = require('uci-adapter');

// singletons
const baseManager = require('../chessbase/base-manager');
const analysisQueue = require('./analysis-queue');
const analyzer = require('./analyzer');
const depthSelector = require('./depth-selector');
const pgnAnalyzer = require('./pgn-analyzer');

let engine;

let isAnalysisInProgress = false;

const finalize = function() {
  isAnalysisInProgress = false;
  analyzer.analyzeLater();
};

const analyze = function() {
  if (isAnalysisInProgress)
    return Promise.resolve(false);
  isAnalysisInProgress = true;
  let moves = analysisQueue.getFirst();

  if (moves === null || moves === undefined) {
    if (baseManager) {
      baseManager.optimize(analyzer);
    }
    isAnalysisInProgress = false;
    return Promise.resolve(false);
  }
  if (pgnAnalyzer.isError(moves, baseManager.getBase())) {
    console.log('Not optimal position will not be analyzed: ' + moves);
    analysisQueue.delete(moves);
    isAnalysisInProgress = false;
    analyzer.analyzeLater();
    return Promise.resolve(false);
  }
  let chess = new Chess();
  let initialDepth = depthSelector.getDepthToAnalyze(moves, baseManager.getBase());
  console.log(`start to analyze moves '${moves}' to ${initialDepth} depth`);
  let analysisResultsProcessor = new AnalysisResultsProcessor(chess, initialDepth, depthSelector, moves);
  moves.forEach(function(move) {
    chess.move(move);
  });
  let fen = chess.fen();
  return new Promise((resolve, reject) => {
    if (engine) {
      engine.analyzeToDepth(fen, initialDepth).then(data => {
        analysisResultsProcessor.process(data);
        analysisQueue.delete(moves);
        finalize();
        resolve(true);
      }).catch(err => {
        finalize();
        reject(err);
      });
    }
  });
};

exports.analyze = analyze;

exports.isAnalysisInProgress = () => {
  return isAnalysisInProgress;
};

exports.setChessEngineOptions = (path, options) => {
  engine = new Engine(path);
  engine.setUciOptions(options);
};
