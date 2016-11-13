'use strict';

var MIN_DEPTH_REQUIRED = 34;

var validator = require('./validator');
var mainLineOptimizer = require('./main-line-optimizer');
var analysisPriority = require('../../analysis/analysis-priority');
var timeoutInMilliseconds = 100;
var optimizeInProgress = false;
var settings = {};

var optimizeSync = function(base, analyzer, baseIterator) {
  if (optimizeInProgress) return;
  optimizeInProgress = true;
  validator.validate(base);
  if (baseIterator) {
    let movesList = baseIterator.getMovesToInsufficientEvaluationDepth(base, MIN_DEPTH_REQUIRED);
    if (movesList) {
      movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base, analysisPriority.OptimizationOfNotAnalyzedEnough);
      });
      movesList = baseIterator.getMovesWithSameFenButDifferentEvaluation(base);
      movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base, analysisPriority.OptimizationOfNotAnalyzedEnough);
      });
    }
    mainLineOptimizer.goDeeper(base, baseIterator, analyzer);
  }
  optimizeInProgress = false;
};

module.exports.optimizeSync = optimizeSync;

module.exports.optimize = function(base, analyzer, baseIterator, optimizeSettings) {
  if (optimizeSettings) {
    settings = optimizeSettings;
  }
  if (settings.optimize) {
    setTimeout(optimizeSync, timeoutInMilliseconds, base, analyzer, baseIterator);
  }
};
