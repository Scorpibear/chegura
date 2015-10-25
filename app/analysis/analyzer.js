var baseManager = null
var baseIterator = require('../base-iterator')
var evaluation = require('../evaluation')
var analysisQueue = require('./analysis-queue')

var isAnalysisInProgress = false;
var analyzerSync = require('./analyzer-sync')

var analyzeLater = function (moves, base, priority) {
    if (moves) {
        if(!base) throw Error('analyzeLater is called with moves without base');
        var movesList = splitSequentially(base, moves);
        movesList.forEach(function (moves) {
            analysisQueue.push(moves, priority)
        })
    }
    setTimeout(analyzerSync.analyze, 100);
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
};

module.exports.analyzeLater = analyzeLater;

module.exports.getQueue = function () {
    return analysisQueue.getQueue();
};

module.exports.setBaseManager = function (newBaseManager) {
    baseManager = newBaseManager;
};

module.exports.resetQueue = function () {
    analysisQueue.empty();
};

module.exports.isAnalysisInProgress = function () {
	return isAnalysisInProgress;
};
