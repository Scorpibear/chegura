"use strict";

const Chess = require('./chess').Chess;
const Engine = require('uci');
const evaluation = require('../chessbase/evaluation');
const baseManager = require('../chessbase/base-manager');
const defaultChessEnginePath = "./stockfish-7-x64.exe";
const pathToChessEngine = (process.argv.length > 2) ?
  process.argv[2] : defaultChessEnginePath;
const engine = new Engine(pathToChessEngine);
const analysisQueue = require('./analysis-queue');
let isAnalysisInProgress = false;
const REQUIRED_DEPTH = 32;
const analyzer = require('./analyzer');
const pgnAnalyzer = require('./pgn-analyzer');
let uciOptions = [];

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
  let depth = REQUIRED_DEPTH;
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
    return engine.goDepthCommand(depth, function infoHandler(info) {
      // console.log(info)
    });
  }).then(function(data) {
    engine.quitCommand();
    let move = chess.move(data.bestmove);
    if (chess.game_over()) {
      console.log('Game over!', 'In draw:', chess.in_draw(),
        'In checkmate:', chess.in_checkmate(),
        'In threefold repetition:', chess.in_threefold_repetition());
    }
    // console.log('Data, data.bestmove, move: ', data, data.bestmove, move);
    evaluation.register(moves, move, data.score, depth);
    isAnalysisInProgress = false;
    analyzer.analyzeLater();
  }).fail(function(error) {
    console.log(error);
    isAnalysisInProgress = false;
    analyzer.analyzeLater();
  }).done();
};

module.exports.analyze = analyze;

module.exports.isAnalysisInProgress = function() {
  return isAnalysisInProgress;
};

module.exports.setUciOptions = function(options) {
  uciOptions = options;
};
