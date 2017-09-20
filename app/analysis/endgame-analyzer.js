// analyzes endgame

var fenAnalyzer = require('fen-analyzer');

const MAX_PIECES = 7;

module.exports.isEndgame = function(fen) {
  let piecesCount = fenAnalyzer.getPiecesCount(fen);
  return (piecesCount <= MAX_PIECES);
};
