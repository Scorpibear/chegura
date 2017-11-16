"use strict";

const baseIterator = require('../chessbase/base-iterator');
const analysisQueue = require('./analysis-queue');
const analyzerSync = require('./analyzer-sync');

const splitSequentially = function(base, moves) {
  let list = [];
  let positionObject = base;
  moves.forEach(function(move, index) {
    let subObject = baseIterator.findSubPositionObject(positionObject, move);
    if (subObject === null) {
      let movesToAdd = moves.slice(0, index + 1);
      list.push(movesToAdd);
    }
    positionObject = subObject;
  });
  if (list.length === 0)
    list.push(moves);
  return list;
};

const analyzeLater = function(moves, base, priority) {
  return new Promise((resolve, reject) => {
    if (moves) {
      if (!base) throw Error('analyzeLater is called with moves without base');
      let movesList = splitSequentially(base, moves);
      movesList.forEach(function(moves) {
        analysisQueue.push(moves, priority);
      });
    }
    setTimeout(analyzerSync.analyze, 100);
    resolve();
  });
};

module.exports.analyzeLater = analyzeLater;

module.exports.getQueue = function() {
  return analysisQueue.getQueue();
};

module.exports.resetQueue = function() {
  analysisQueue.empty();
};

module.exports.isAnalysisInProgress = analyzerSync.isAnalysisInProgress;

module.exports.setUciOptions = function(uciOptions) {
  analyzerSync.setUciOptions(uciOptions);
};
