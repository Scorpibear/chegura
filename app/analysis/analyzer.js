const analysisQueue = require('./analysis-queue');
const converter = require('../converter');
const depthSelector = require('./depth-selector');
const pgnAnalyzer = require('./pgn-analyzer');

const analyzeLater = function(moves, base, priority) {
  return new Promise((resolve, reject) => {
    if (moves) {
      if (!base) reject('analyzeLater is called with moves without base');
      let movesList = pgnAnalyzer.splitSequentially(base, moves);
      movesList.forEach(function(moves) {
        const queueItem = {
          fen: converter.moves2fen(moves),
          moves,
          depth: depthSelector.getMinDepthRequired()
        };
        analysisQueue.add(queueItem, priority);
      });
    }
    resolve();
  });
};

exports.analyzeLater = analyzeLater;

