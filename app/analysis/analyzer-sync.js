"use strict";

// classes
const Chess = require('./chess').Chess;
const AnalysisResultsProcessor = require('./analysis-results-processor');
const Engine = require('./engine');

// singletons
const baseManager = require('../chessbase/base-manager');
const analysisQueue = require('./analysis-queue');
const analyzer = require('./analyzer');
const depthSelector = require('./depth-selector');
const pgnAnalyzer = require('./pgn-analyzer');

const defaultChessEnginePath = "./stockfish_8_x64.exe";
const pathToChessEngine = (process.argv.length > 2) ?
  process.argv[2] : defaultChessEnginePath;
const engine = new Engine(pathToChessEngine);

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
    isAnalysisInProgress = false;
    analyzer.analyzeLater();
    return Promise.resolve(false);
  }
  console.log("start to analyze moves: " + moves);
  let chess = new Chess();
  let initialDepth = depthSelector.getDepthToAnalyze(moves, baseManager.getBase());
  let analysisResultsProcessor = new AnalysisResultsProcessor(chess, initialDepth, depthSelector, moves);
  moves.forEach(function(move) {
    chess.move(move);
  });
  let fen = chess.fen();
  return new Promise((resolve, reject) => {
    engine.analyzeToDepth(fen, initialDepth).then(data => {
      analysisResultsProcessor.process(data);
      finalize();
      resolve(true);
    }).catch(err => {
      finalize();
      reject(err);
    });
  });
};

exports.analyze = analyze;

exports.isAnalysisInProgress = function() {
  return isAnalysisInProgress;
};

exports.setUciOptions = options => {
  engine.setUciOptions(options);
};
