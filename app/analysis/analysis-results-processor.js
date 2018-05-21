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
    if (this.validate(data)) {
      let bestMove = this.chess.move(data.bestmove, {sloppy: true});
      let score = data.info[data.info.length - 1].score.value;
      let depth = this.initialDepth;
      if (this.chess.game_over() || endgameAnalyzer.isEndgame(this.chess.fen())) {
        depth = this.depthSelector.MAX_DEPTH;
        if (this.chess.in_draw) {
          score = 0;
        }
      }
      evaluation.register(this.moves, bestMove, score, depth);
    }
  }
  validate(data) {
    let isValid = data && data.bestmove && data.info && data.info.length &&
      data.info[data.info.length - 1].score && data.info[data.info.length - 1].score.hasOwnProperty('value');
    if (!isValid) {
      console.error('Validation error of chess engine output data. Data: ', data);
    }
    return isValid;
  }
}

module.exports = AnalysisResultsProcessor;
