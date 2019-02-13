'use strict';

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
  let positionObject = base;
  for(let index = 0; positionObject; index++) {
    if(isMaxDepthForObject(positionObject)){
      return true;
    }
    if(positionObject.s && positionObject.s.length && index < pathToCheck.length) {
      positionObject = positionObject.s.find(obj => obj.m == pathToCheck[index]);
    } else {
      break;
    }
  }
  return false;
};

const isMaxDepthForObject = positionObject => (
  positionObject && 
  positionObject.hasOwnProperty('e') &&
  positionObject.e.hasOwnProperty('d') &&
  positionObject.e.d >= MAX_DEPTH);

module.exports.isGameOver = function(movesPath, base) {
  return (this.isCheckmate(movesPath) || this.isMaxDepth(movesPath, base));
};
