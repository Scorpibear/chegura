var Chess = require('./chess')
var Engine = require('uci')
var baseManager = null
var baseIterator = require('../base-iterator')
var evaluation = require('../evaluation')
var defaultChessEnginePath = "./stockfish-6-64.exe"
var pathToChessEngine = (process.argv.length > 2) ? process.argv[2] : defaultChessEnginePath
var engine = new Engine(pathToChessEngine);
var analysisQueue = require('./analysis-queue');
var isAnalysisInProgress = false;
var REQUIRED_DEPTH = 30;

var analyzer = require('./analyzer');
var pgnAnalyzer = require('./pgn-analyzer')

var analyze = function () {
    if (isAnalysisInProgress)
        return;
    isAnalysisInProgress = true;

    var moves = analysisQueue.getFirst();

    if (moves == null) {
        isAnalysisInProgress = false;
        console.error('Queue is empty, nothing to analyze!');
        return;
    }
    if (pgnAnalyzer.isError(moves)) {
        isAnalysisInProgress = false;
        console.log('Not optimal position will not be analyzed: ' + moves);
        return;
    }
    console.log("start to analyze moves: " + moves);
    var chess = new Chess();
    var depth = REQUIRED_DEPTH;
    moves.forEach(function (move) {
        chess.move(move);
    });
    var fen = chess.fen();
    var options = [];
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
        var move = chess.move(data.bestmove);
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