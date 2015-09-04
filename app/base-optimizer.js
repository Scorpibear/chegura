'use strict';

var MIN_DEPTH_REQUIRED = 30;

var baseIterator = require('./base-iterator');
var validator = require('./validator');



var optimizeSync = function (base, analyzer) {
    validator.validate(base);
    var movesList = baseIterator.getMovesToInsufficientEvaluationDepth(base, MIN_DEPTH_REQUIRED);
    console.log("Moves identified for deeper analysis: ", movesList.length);
    movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base, 2)
    });
    movesList = baseIterator.getMovesWithSameFenButDifferentEvaluation(base);
    movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base, 2)
    })
};

module.exports.optimizeSync = optimizeSync;

module.exports.optimize = function (base, analyzer) {
    setTimeout(optimizeSync, 1000, base, analyzer);
};
