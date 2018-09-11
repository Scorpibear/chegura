'use strict';

const mainLineOptimizer = require('./main-line-optimizer');
const analysisPriority = require('../../analysis/analysis-priority');
const converter = require('../../converter');
const depthSelector = require('../../analysis/depth-selector');
const analysisQueue = require('../../analysis/analysis-queue');
let optimizeInProgress = false;

var optimizeSync = function({base, baseIterator}) {
  if (optimizeInProgress) return;
  console.log('optimization started');
  optimizeInProgress = true;
  if(baseIterator) {
    let movesList = baseIterator.getMovesToInsufficientEvaluationDepth(base, depthSelector.getMinDepthRequired());
    if (movesList && movesList.length) {
      movesList.forEach(function(moves) {
        analysisQueue.add(
          { fen: converter.moves2fen(moves),
            depth: depthSelector.getMinDepthRequired(),
            moves
          }, analysisPriority.OptimizationOfNotAnalyzedEnough
        );
      });
    } else {
      console.log('no positions with insufficient depth are identified');
    }
    const moves = mainLineOptimizer.getMoves({base, baseIterator});
    if(moves !== undefined && 'length' in moves) {
      analysisQueue.add(
        {
          fen: converter.moves2fen(moves),
          depth: depthSelector.getDepthToAnalyze(moves, base),
          moves
        }, analysisPriority.MainLineOptimization
      );
    } else {
      console.log('nothing to optimize in main line');
    }
  } else {
    console.error('baseIterator is not defined');
  }
  optimizeInProgress = false;
  console.log('optimization finished');
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
