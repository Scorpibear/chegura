'use strict';

const MAX_DEPTH = 300;
const INCREMENT = 2;
const baseIterator = require('../../app/chessbase/base-iterator');

let defaultDepth = 40;

module.exports.getDepthToAnalyze = function(pathOfMoves, base) {
  let positionObject = baseIterator.findPositionObject(pathOfMoves, base);
  if (positionObject && positionObject.hasOwnProperty('e') && positionObject.e.hasOwnProperty('d') &&
    (positionObject.e.d >= defaultDepth) && positionObject.hasOwnProperty('s') &&
    positionObject.s.length && positionObject.s[0].hasOwnProperty('e')) {
    if (positionObject.s[0].e.d < defaultDepth - INCREMENT) {
      return defaultDepth;
    }
    return (positionObject.s[0].e && positionObject.s[0].e.d && positionObject.e.d > positionObject.s[0].e.d) ? (positionObject.s[0].e.d + INCREMENT) : positionObject.e.d + INCREMENT;
  }
  return defaultDepth;
};

exports.MAX_DEPTH = MAX_DEPTH;

exports.setDefaultDepth = newDefaultDepth => {
  defaultDepth = newDefaultDepth;
}

exports.getMinDepthRequired = () => {
  return defaultDepth;
}
