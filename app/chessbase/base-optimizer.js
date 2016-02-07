'use strict';

var MIN_DEPTH_REQUIRED = 30;

var baseIterator = require('./base-iterator');
var validator = require('./validator');
var mainLineOptimizer = require('./optimization/main-line-optimizer');
var analysisPriority = require('../analysis/analysis-priority');
var timeoutInMilliseconds = 1000;

var optimizeSync = function (base, analyzer) {
    validator.validate(base);
    var movesList = baseIterator.getMovesToInsufficientEvaluationDepth(base, MIN_DEPTH_REQUIRED);
    console.log("Moves identified for deeper analysis: ", movesList.length);
    movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base, analysisPriority.OptimizationOfNotAnalyzedEnough)
    });
    movesList = baseIterator.getMovesWithSameFenButDifferentEvaluation(base);
    movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base, analysisPriority.OptimizationOfNotAnalyzedEnough)
    });
    mainLineOptimizer.goDeeper(base, baseIterator, analyzer);
};

module.exports.optimizeSync = optimizeSync;

module.exports.optimize = function (base, analyzer) {
    setTimeout(optimizeSync, timeoutInMilliseconds, base, analyzer);
};
