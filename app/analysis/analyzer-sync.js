"use strict";

const Chess = require('./chess')
const Engine = require('uci')
const baseIterator = require('../chessbase/base-iterator')
const evaluation = require('../chessbase/evaluation')
const baseManager = require('../chessbase/base-manager')
const defaultChessEnginePath = "./stockfish-6-64.exe"
const pathToChessEngine = (process.argv.length > 2) ? process.argv[2] : defaultChessEnginePath
const engine = new Engine(pathToChessEngine);
const analysisQueue = require('./analysis-queue');
let isAnalysisInProgress = false;
const REQUIRED_DEPTH = 32;

const analyzer = require('./analyzer');
const pgnAnalyzer = require('./pgn-analyzer')

const analyze = function () {
    if (isAnalysisInProgress)
        return;
    isAnalysisInProgress = true;

    let moves = analysisQueue.getFirst();

    if (moves == null) {
        isAnalysisInProgress = false;
        if(baseManager) {
            baseManager.optimize(analyzer);
        }
        return;
    }
    if (pgnAnalyzer.isError(moves)) {
        isAnalysisInProgress = false;
        console.log('Not optimal position will not be analyzed: ' + moves);
        return;
    }
    console.log("start to analyze moves: " + moves);
    let chess = new Chess();
    let depth = REQUIRED_DEPTH;
    moves.forEach(function (move) {
        chess.move(move);
    });
    let fen = chess.fen();
    let options = [];
    //options = [{name:"Threads", value:3}, {name: "Hash", value: 4096}]
    options = [{name: "Hash", value: 256}]
    engine.runProcess().then(function () {
        return engine.uciCommand();
    }).then(function () {
        return engine.isReadyCommand();
    }).then(function () {
        options.forEach(function(option) {
            engine.setOptionCommand(option.name, option.value);
        })
        return engine.isReadyCommand();
    }).then(function () {
        return engine.uciNewGameCommand();
    }).then(function () {
        return engine.positionCommand(fen);
    }).then(function () {
        return engine.goDepthCommand(depth, function infoHandler(info) {
            //console.log(info)
        });
    }).then(function(data) {
        engine.quitCommand();
        let move = chess.move(data.bestmove);
        evaluation.register(moves, move, data.score, depth);
        isAnalysisInProgress = false;
        analyzer.analyzeLater()
    }).fail(function (error) {
        console.log(error);
        isAnalysisInProgress = false;
    }).done();
};

module.exports.analyze = analyze;

module.exports.isAnalysisInProgress = function () {
    return isAnalysisInProgress;
};
