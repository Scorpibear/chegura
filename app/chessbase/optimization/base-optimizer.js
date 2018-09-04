'use strict';

const validator = require('./validator');
const mainLineOptimizer = require('./main-line-optimizer');
const analysisPriority = require('../../analysis/analysis-priority');
const depthSelector = require('../../analysis/depth-selector');
//const analysisQueue = require('../../analysis/analysis-queue');
const timeoutInMilliseconds = 100;
let optimizeInProgress = false;

var optimizeSync = function(base, analyzer, baseIterator) {
  if (optimizeInProgress) return;
  optimizeInProgress = true;
  validator.validate(base);
  if (baseIterator) {
    let movesList = baseIterator.getMovesToInsufficientEvaluationDepth(base, depthSelector.getMinDepthRequired());
    if (movesList) {
      movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base, analysisPriority.OptimizationOfNotAnalyzedEnough);
        //analysisQueue.add({moves, depth: depthSelector.getMinDepthRequired()}, analysisPriority.OptimizationOfNotAnalyzedEnough);
      });
      movesList = baseIterator.getMovesWithSameFenButDifferentEvaluation(base);
      movesList.forEach(function(moves) {
        analyzer.analyzeLater(moves, base, analysisPriority.OptimizationOfNotAnalyzedEnough);
        //analysisQueue.add({moves, depth: depthSelector.getMinDepthRequired()}, analysisPriority.OptimizationOfNotAnalyzedEnough);
      });
    }
    mainLineOptimizer.goDeeper(base, baseIterator, analyzer);
  }
  optimizeInProgress = false;
};

module.exports.optimizeSync = optimizeSync;

module.exports.optimize = function(base, analyzer, baseIterator, settings = {}) {
  if (settings.optimize) {
    setTimeout(optimizeSync, timeoutInMilliseconds, base, analyzer, baseIterator);
  }
};
