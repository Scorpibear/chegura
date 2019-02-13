'use strict';

const pathChecker = require('./path-checker');

module.exports.getMoves = function({base, baseIterator}) {
  let moves = baseIterator.findLatestMainLine(base);
  if (pathChecker.isGameOver(moves, base)) {
    moves = baseIterator.findMinDepthMainLinePath(base);
  }
  return moves;
};
