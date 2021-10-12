'use strict';

const pathChecker = require('./path-checker');
const pgnAnalyzer = require('../../analysis/pgn-analyzer');

module.exports.getMoves = function({base, baseIterator}) {
  let moves = baseIterator.findLatestMainLine(base);
  if (pathChecker.isGameOver(moves, base) || !pgnAnalyzer.areMovesWithinLimit(moves)) {
    moves = baseIterator.findMinDepthMainLinePath(base);
    console.log('Min depth main line path found: ' + moves.join(','));
  } else {
    console.log('Main line for analysis: ' + moves.join(','));
  }
  return moves;
};
