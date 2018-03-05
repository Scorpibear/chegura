'use strict';

const baseIterator = require('../base-iterator');
const MAX_DEPTH = 300;

module.exports.isCheckmate = function(pathToAnalyze) {
  if (pathToAnalyze.length > 0) {
    var theLatest = pathToAnalyze[pathToAnalyze.length - 1];
    if (theLatest.endsWith('#')) {
      return true;
    }
  }
  return false;
};

module.exports.isMaxDepth = function(pathToCheck, base) {
  let positionObject = baseIterator.findPositionObject(pathToCheck, base);
  return (positionObject && positionObject.hasOwnProperty('e') && positionObject.e.hasOwnProperty('d') &&
    positionObject.e.d >= MAX_DEPTH);
};

module.exports.isGameOver = function(movesPath, base) {
  return (this.isCheckmate(movesPath) || this.isMaxDepth(movesPath, base));
};
