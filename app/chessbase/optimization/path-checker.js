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

module.exports.isDraw = function(pathToCheck, base) {
  let positionObject = baseIterator.findPositionObject(pathToCheck, base);
  if(positionObject.hasOwnProperty('e')) {
    if(positionObject.e.hasOwnProperty('v') && positionObject.e.hasOwnProperty('d')) {
      if((positionObject.e.v === 0) && (positionObject.e.d >= MAX_DEPTH)) {
        return true;
      }
    }
  }
  return false;
};

module.exports.isGameOver = function(movesPath, base) {
  return (this.isCheckmate(movesPath) || this.isDraw(movesPath, base));
};
