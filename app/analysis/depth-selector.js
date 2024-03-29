'use strict';

const MAX_DEPTH = 300;
const INCREMENT = 4;
const baseIterator = require('../../app/chessbase/base-iterator');

let defaultDepth = 40;

module.exports.getDepthToAnalyze = function(pathOfMoves, base) {
  let positionObject = baseIterator.findPositionObject(pathOfMoves, base);
  if (positionObject && Object.prototype.hasOwnProperty.call(positionObject, 'e') && 
    Object.prototype.hasOwnProperty.call(positionObject.e, 'd') &&
    (positionObject.e.d >= defaultDepth)) {
    return positionObject.e.d + INCREMENT;
  }
  return defaultDepth;
};

exports.MAX_DEPTH = MAX_DEPTH;

exports.setDefaultDepth = newDefaultDepth => {
  defaultDepth = newDefaultDepth;
};

exports.getMinDepthRequired = () => {
  return defaultDepth;
};
