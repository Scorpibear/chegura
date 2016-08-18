const DEFAULT_DEPTH = 32;
const MAX_DEPTH = 300;
const INCREMENT = 2;
const baseIterator = require('../../app/chessbase/base-iterator');

module.exports.getDepthToAnalyze = function(pathOfMoves, base) {
  let positionObject = baseIterator.findPositionObject(pathOfMoves, base);
  if(positionObject && positionObject.hasOwnProperty('e') && positionObject.e.hasOwnProperty('d') &&
    positionObject.e.d >= DEFAULT_DEPTH && positionObject.hasOwnProperty('s') && positionObject.s.length) {
    return positionObject.e.d + INCREMENT;
  }
  return DEFAULT_DEPTH;
};

module.exports.MAX_DEPTH = MAX_DEPTH;
