'use strict';

const mainLineOptimizer = require('./main-line-optimizer');
const analysisPriority = require('../../analysis/analysis-priority');
const converter = require('../../converter');
const depthSelector = require('../../analysis/depth-selector');
const analysisQueue = require('../../analysis/analysis-queue');
let optimizeInProgress = false;

var optimizeSync = function({base, baseIterator}) {
  if (optimizeInProgress) return;
  optimizeInProgress = true;
  if(baseIterator) {
    let movesList = baseIterator.getMovesToInsufficientEvaluationDepth(base, depthSelector.getMinDepthRequired());
    if (movesList) {
      movesList.forEach(function(moves) {
        analysisQueue.add(
          { fen: converter.moves2fen(moves),
            depth: depthSelector.getMinDepthRequired()
          }, analysisPriority.OptimizationOfNotAnalyzedEnough
        );
      });
    }
    const moves = mainLineOptimizer.getMoves({base, baseIterator});
    if(moves) {
      analysisQueue.add(
        {
          fen: converter.moves2fen(moves),
          depth: depthSelector.getDepthToAnalyze(moves, base)
        }, analysisPriority.MainLineOptimization
      );
    }
  }
  optimizeInProgress = false;
};

module.exports.optimizeSync = optimizeSync;

module.exports.optimize = function({base, baseIterator, settings = {}}) {
  return new Promise((resolve) => {
    if(settings.optimize) {
      optimizeSync({base, baseIterator});
    }
    resolve();
  }).catch(err => console.error(err));
};
