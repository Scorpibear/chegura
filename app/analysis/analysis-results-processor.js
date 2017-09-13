// process results of engine analysis, decide what to do with them

const evaluation = require('../chessbase/evaluation');

class AnalysisResultsProcessor {
  constructor(engine, chess, initialDepth, depthSelector, moves) {
    this.engine = engine;
    this.chess = chess;
    this.initialDepth = initialDepth;
    this.depthSelector = depthSelector;
    this.moves = moves;
  }
  process(data) {
    this.engine.quitCommand();
    let move = this.chess.move(data.bestmove);
    let depth = this.initialDepth;
    if (this.chess.game_over()) {
      depth = this.depthSelector.MAX_DEPTH;
      if (this.chess.in_draw) {
        data.score = 0;
      }
    }
    // console.log('Data, data.bestmove, move: ', data, data.bestmove, move);
    evaluation.register(this.moves, move, data.score, depth);
  }
}

module.exports = AnalysisResultsProcessor;
