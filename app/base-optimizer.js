var baseIterator = require('./base-iterator')

var MIN_DEPTH_REQUIRED = 30;
var optimizeSync = function (base, analyzer) {
        
    var movesList = baseIterator.getMovesToInsufficientEvaluationDepth(base, MIN_DEPTH_REQUIRED);
    console.log("Moves identified for deeper analysis: ", movesList);
    movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base)
    })
    movesList = baseIterator.getMovesWithSameFenButDifferentEvaluation(base)
    movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base)
    })
}

module.exports.optimizeSync = optimizeSync

module.exports.optimize = function (base, analyzer) {
    setTimeout(optimizeSync, 1000, base, analyzer);
}
