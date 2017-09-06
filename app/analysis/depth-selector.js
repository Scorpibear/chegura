'use strict';

const DEFAULT_DEPTH = 40;
const MAX_DEPTH = 300;
const INCREMENT = 2;
const baseIterator = require('../../app/chessbase/base-iterator');

module.exports.getDepthToAnalyze = function(pathOfMoves, base) {
  let positionObject = baseIterator.findPositionObject(pathOfMoves, base);
  if (positionObject && positionObject.hasOwnProperty('e') && positionObject.e.hasOwnProperty('d') &&
    (positionObject.e.d >= DEFAULT_DEPTH) && positionObject.hasOwnProperty('s') && positionObject.s.length) {
    if (positionObject.s[0].e.d < DEFAULT_DEPTH - INCREMENT) {
      return DEFAULT_DEPTH;
    }
    return (positionObject.s[0].e && positionObject.s[0].e.d && positionObject.e.d > positionObject.s[0].e.d) ? (positionObject.s[0].e.d + INCREMENT) : positionObject.e.d + INCREMENT;
  }
  return DEFAULT_DEPTH;
};

module.exports.MAX_DEPTH = MAX_DEPTH;
