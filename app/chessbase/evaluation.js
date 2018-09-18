const fs = require('fs');

const baseManager = require('./base-manager');
const config = require('../config');
const depthSelector = require('../analysis/depth-selector');
const endgameAnalyzer = require('../analysis/endgame-analyzer');

var evaluationLogFileName = config.evaluationsLogFile;

module.exports.Chess = require('chess.js').Chess;

module.exports.save = ({moves, bestMove, score, depth}) => {
  if(bestMove) {
    const chess = new this.Chess();
    moves.forEach(move => chess.move(move, {sloppy: true}));
    chess.move(bestMove, {sloppy: true});
    if (chess.game_over() || endgameAnalyzer.isEndgame(chess.fen())) {
      depth = depthSelector.MAX_DEPTH;
      if (chess.in_draw) {
        score = 0;
      }
    }
    console.log(`best move for ${moves} is ${bestMove} with score/depth ${score}/${depth}`);
    fs.appendFile(evaluationLogFileName, `${moves} ${bestMove}! ${score}/${depth}\n`, function (err) {
      if (err) console.error(`could not append to '${evaluationLogFileName}' :`, err);
    });
    baseManager.addToBase(moves, bestMove, score, depth);
  } else {
    console.error('Could not save evaluation, because bestMove was not provided');
  }
};
