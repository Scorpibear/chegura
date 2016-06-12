'use strict';

var MIN_DEPTH_REQUIRED = 32;

var validator = require('./validator');
var mainLineOptimizer = require('./main-line-optimizer');
var analysisPriority = require('../../analysis/analysis-priority');
var timeoutInMilliseconds = 1000;

var optimizeSync = function (base, analyzer, baseIterator) {
    validator.validate(base);
    if(baseIterator) {
        let movesList = baseIterator.getMovesToInsufficientEvaluationDepth(base, MIN_DEPTH_REQUIRED);
        if(movesList) {
          console.log("Moves identified for deeper analysis: ", movesList.length);
          movesList.forEach(function(moves) {
            analyzer.analyzeLater(moves, base, analysisPriority.OptimizationOfNotAnalyzedEnough)
          });
          movesList = baseIterator.getMovesWithSameFenButDifferentEvaluation(base);
          movesList.forEach(function(moves) {
            analyzer.analyzeLater(moves, base, analysisPriority.OptimizationOfNotAnalyzedEnough)
          });
        }
        mainLineOptimizer.goDeeper(base, baseIterator, analyzer);
    }
};

module.exports.optimizeSync = optimizeSync;

module.exports.optimize = function (base, analyzer, baseIterator) {
    setTimeout(optimizeSync, timeoutInMilliseconds, base, analyzer, baseIterator);
};
