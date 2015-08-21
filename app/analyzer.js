var Chess = require('./chess')
var Engine = require('uci')
var baseManager = null
var baseIterator = require('./base-iterator')
var defaultChessEnginePath = "stockfish-6-64.exe"
var pathToChessEngine = (process.argv.length > 2) ? process.argv[2] : defaultChessEnginePath
var engine = new Engine(pathToChessEngine)
var fs = require('fs')

var isAnalysisInProgress = false;
var REQUIRED_DEPTH = 30;
var toAnalyzeList = [];
var ANALYZE_TIMEOUT = 100;

var analyze = function () {
    if (isAnalysisInProgress || toAnalyzeList.length == 0)
        return;
    isAnalysisInProgress = true
    var moves = toAnalyzeList.shift()
    console.log("start to analyze moves: ", moves)
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
		// move to evaluation.register
		// evaluation.register(moves, move, data.score, depth)
        var resultBestmove = move.san
		var scoreValue = data.score / 100.0
		if (move.color == 'b')
		    scoreValue = -scoreValue
        console.log("best move for ", moves, " is ", resultBestmove, " with score/depth ", scoreValue, "/", depth)
		fs.appendFile('evaluations.log', moves.join(' ') + ' ' + resultBestmove + ' ' + scoreValue + '/' + depth, function (err) {
			if (err) console.error("could not append to 'evaluations.log' :", err)
		})
        if(!baseManager) throw Error('base manager is not defined. Call analyzer.setBaseManager before')
        baseManager.addToBase(moves, resultBestmove, scoreValue, depth)
        // end
		isAnalysisInProgress = false
        analyzeLater()
    }).fail(function (error) {
        console.log(error);
        isAnalysisInProgress = false;
    }).done();
}

var analyzeLater = function (moves, base) {
    if (moves) {
        var movesList = splitSequentially(base, moves);
        movesList.forEach(function (moves) {
            toAnalyzeList.push(moves);
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
    return toAnalyzeList;
}

module.exports.setBaseManager = function (newBaseManager) {
    baseManager = newBaseManager
}

module.exports.readQueue = function () {
}

module.exports.resetQueue = function () {
	toAnalyzeList = [];
}