var Chess = require('./chess')
var Engine = require('uci')
var baseManager = null
var baseIterator = require('./base-iterator')
var evaluation = require('./evaluation')
var defaultChessEnginePath = "stockfish-6-64.exe"
var pathToChessEngine = (process.argv.length > 2) ? process.argv[2] : defaultChessEnginePath
var engine = new Engine(pathToChessEngine)
var fs = require('fs')
var analysisQueue = require('./analysis-queue')

var isAnalysisInProgress = false;
var REQUIRED_DEPTH = 30;
var ANALYZE_TIMEOUT = 100;

var analyze = function () {
    if (isAnalysisInProgress)
        return;
    isAnalysisInProgress = true
    var moves = analysisQueue.getFirst()
    if (moves == null) {
        isAnalysisInProgress = false;
        console.error('Queue is empty, nothing to analyze!');
        return
    }
    console.log("start to analyze moves: " + moves)
    var chess = new Chess()
	var depth = REQUIRED_DEPTH
    moves.forEach(function (move) {
        chess.move(move);
    });
    var fen = chess.fen();
    engine.runProcess().then(function () {
        return engine.uciCommand();
    }).then(function () {
        return engine.isReadyCommand();
    }).then(function () {
        return engine.uciNewGameCommand();
    }).then(function () {
        return engine.positionCommand(fen);
    }).then(function () {
        return engine.goDepthCommand(depth, function infoHandler(info) {
        });
    }).then(function(data) {
		var move = chess.move(data.bestmove)
		evaluation.register(moves, move, data.score, depth)
		isAnalysisInProgress = false
        analyzeLater()
    }).fail(function (error) {
        console.log(error);
        isAnalysisInProgress = false;
    }).done();
}

var analyzeLater = function (moves, base, priority) {
    if (moves) {
        if(!base) throw Error('analyzeLater is called with moves without base');
        var movesList = splitSequentially(base, moves);
        movesList.forEach(function (moves) {
            analysisQueue.push(moves, priority)
        })
    }
    setTimeout(analyze, 100);
}

var splitSequentially = function (base, moves) {
    var list = [];
    var positionObject = base;
    moves.forEach(function (move, index) {
        var subObject = baseIterator.findSubPositionObject(positionObject, move);
        if (subObject == null) {
            var movesToAdd = moves.slice(0, index+1)
            list.push(movesToAdd);
        }
        positionObject = subObject;
    });
    if(list.length == 0)
		list.push(moves);
    return list;
}

module.exports.analyzeLater = analyzeLater

module.exports.getQueue = function () {
    return analysisQueue.getQueue()
}

module.exports.setBaseManager = function (newBaseManager) {
    baseManager = newBaseManager
}

module.exports.resetQueue = function () {
    analysisQueue.empty();
}