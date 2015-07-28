var Chess = require('./chess');
var Engine = require('uci');
var baseManager = require('./base-manager');
var defaultChessEnginePath = "stockfish-6-64.exe";
var pathToChessEngine = (process.argv.length > 2) ? process.argv[2] : defaultChessEnginePath;
var engine = new Engine(pathToChessEngine);

module.exports = (function() {
    var isAnalysisInProgress = false;
    var DAY_PERIOD = 86400000;
    var DEBUG_PERIOD = 5000;
    var analyzePeriod = DAY_PERIOD;
    var toAnalyzeList = [];

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
            return engine.goInfiniteCommand(function infoHandler(info) {
                //console.log(info);
            });
        }).delay(analyzePeriod).then(function () {
            return engine.stopCommand();
        }).then(function (bestmove) {
            resultBestmove = chess.move(bestmove).san;
            return engine.quitCommand();
        }).then(function () {
            console.log("best move:", moves, resultBestmove);
            baseManager.addToBase(moves, resultBestmove);
            isAnalysisInProgress = false;
            analyzeLater();
        }).fail(function (error) {
            console.log(error);
            isAnalysisInProgress = false;
        }).done();
    };

    var analyzeLater = function (moves, base) {
        if (moves) {
            var movesList = splitSequentially(base, moves);
            movesList.forEach(function (moves) {
                toAnalyzeList.push(moves);
            })
        }
        setTimeout(analyze, 100);
    };

    var splitSequentially = function(base, moves) {
        console.log('splitSequentially');
        var list = [];
        var positionObject = base;
        console.log('positionObject', positionObject);
        console.log('moves', moves);
        moves.forEach(function (move, index) {
            console.log('positionObject: ', positionObject);
            console.log('move: ', move);
            var subObject = baseManager.findSubPositionObject(positionObject, move);
            console.log('subObject: ', subObject);
            if (subObject == null) {
                list.push(moves.slice(0, index));
                console.log('list: ', list);
            }
            positionObject = subObject;
        });
        list.push(moves);
        return list;
    };

    return {
        analyzeLater: analyzeLater
    }
}());
