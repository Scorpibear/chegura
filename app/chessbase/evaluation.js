
var fs = require('fs');

var Chess = require('../analysis/chess').Chess;

var baseManager = require('./base-manager');
const config = require('../config');
var endgameAnalyzer = require('../analysis/endgame-analyzer');

var evaluationLogFileName = config.evaluationsLogFile;

module.exports.save = ({moves, bestMove, score, depth}) => {
  if(bestMove) {
    const chess = new Chess();
    moves.forEach(move => chess.move(move, {sloppy: true}));
    chess.move(bestMove, {sloppy: true});
    if (chess.game_over() || endgameAnalyzer.isEndgame(chess.fen())) {
      depth = this.depthSelector.MAX_DEPTH;
      if (this.chess.in_draw) {
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
