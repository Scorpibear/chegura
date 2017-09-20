// process results of engine analysis, decide what to do with them

const evaluation = require('../chessbase/evaluation');
const endgameAnalyzer = require('./endgame-analyzer');

class AnalysisResultsProcessor {
  constructor(chess, initialDepth, depthSelector, moves) {
    this.chess = chess;
    this.initialDepth = initialDepth;
    this.depthSelector = depthSelector;
    this.moves = moves;
  }
  process(data) {
    let bestMove = this.chess.move(data.bestmove);
    let depth = this.initialDepth;
    if (this.chess.game_over() || endgameAnalyzer.isEndgame(this.chess.fen())) {
      depth = this.depthSelector.MAX_DEPTH;
      if (this.chess.in_draw) {
        data.score = 0;
      }
    }
    // console.log('Data, data.bestmove, move: ', data, data.bestmove, move);
    evaluation.register(this.moves, bestMove, data.score, depth);
  }
}

module.exports = AnalysisResultsProcessor;
