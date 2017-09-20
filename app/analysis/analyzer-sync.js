"use strict";

const Chess = require('./chess').Chess;
const Engine = require('uci');
const baseManager = require('../chessbase/base-manager');
const analysisQueue = require('./analysis-queue');
const analyzer = require('./analyzer');
const depthSelector = require('./depth-selector');
const pgnAnalyzer = require('./pgn-analyzer');
const AnalysisResultsProcessor = require('./analysis-results-processor');

const defaultChessEnginePath = "./stockfish_8_x64.exe";
const pathToChessEngine = (process.argv.length > 2) ?
  process.argv[2] : defaultChessEnginePath;
const engine = new Engine(pathToChessEngine);

let isAnalysisInProgress = false;
let uciOptions = [];

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
  engine.runProcess().then(function() {
    return engine.uciCommand();
  }).then(function() {
    return engine.isReadyCommand();
  }).then(function() {
    uciOptions.forEach(function(option) {
      engine.setOptionCommand(option.name, option.value);
    });
    return engine.isReadyCommand();
  }).then(function() {
    return engine.uciNewGameCommand();
  }).then(function() {
    return engine.positionCommand(fen);
  }).then(function() {
    return engine.goDepthCommand(initialDepth, function infoHandler(info) {
      // console.log(info)
    });
  }).then(function(data) {
    this.engine.quitCommand();
    analysisResultsProcessor.process(data);
    finalize();
  }).fail(function(error) {
    console.log(error);
    finalize();
  }).done();
};

module.exports.analyze = analyze;

module.exports.isAnalysisInProgress = function() {
  return isAnalysisInProgress;
};

module.exports.setUciOptions = function(options) {
  uciOptions = options;
};
