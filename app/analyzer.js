var Chess = require('./chess')
var Engine = require('uci')
var baseManager = null
var baseIterator = require('./base-iterator')
var defaultChessEnginePath = "stockfish-6-64.exe"
var pathToChessEngine = (process.argv.length > 2) ? process.argv[2] : defaultChessEnginePath
var engine = new Engine(pathToChessEngine)

var isAnalysisInProgress = false;
var REQUIRED_DEPTH = 30;
var toAnalyzeList = [];
var ANALYZE_TIMEOUT = 100;

console.log("ANALYZER INITIALIZED")

var analyze = function () {
    if (isAnalysisInProgress || toAnalyzeList.length == 0)
        return;
    isAnalysisInProgress = true;
    var moves = toAnalyzeList.shift();
    console.log("start to analyze moves: ", moves);
    var resultBestmove;
    var chess = new Chess();
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
        return engine.goDepthCommand(REQUIRED_DEPTH, function infoHandler(info) {
            // to display score for each depth
            if(info.search('nodes') != -1) console.log(info) 
        });
    }).then(function(data) {
        resultBestmove = chess.move(data.bestmove).san
        var scoreValue = data.score / 100.0
        console.log("best move for '", moves.join('|'), "' is ", resultBestmove, " with score ", scoreValue)
        if(!baseManager) throw Error('base manager is not defined. Call analyzer.setBaseManager before')
        baseManager.addToBase(moves, resultBestmove, scoreValue, REQUIRED_DEPTH)
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
    console.log('splitSequentially started')
    console.log('moves: ', moves)
    var list = [];
    var positionObject = base;
    moves.forEach(function (move, index) {
        console.log('positionObject: ', positionObject)
        console.log('move: ', move)
        var subObject = baseIterator.findSubPositionObject(positionObject, move);
        console.log('subObject: ', subObject)
        if (subObject == null) {
            var movesToAdd = moves.slice(0, index)
            console.log('movesToAdd: ', movesToAdd)
            list.push(movesToAdd);
        }
        positionObject = subObject;
    });
    console.log('movesToAdd (finally): ', moves)
    list.push(moves);
    return list;
}

module.exports.analyzeLater = analyzeLater

module.exports.getQueue = function () {
    return toAnalyzeList;
}

module.exports.setBaseManager = function (baseManager) {
    this.baseManager = baseManager
}

module.exports.readQueue = function () {

}