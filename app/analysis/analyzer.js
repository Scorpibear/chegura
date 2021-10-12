const analysisQueue = require('./analysis-queue');
const converter = require('../converter');
const depthSelector = require('./depth-selector');
const pgnAnalyzer = require('./pgn-analyzer');

let ricpaClient;
let pingUrl;

function analyze(item) {
  if(ricpaClient) {
    if(pgnAnalyzer.areMovesWithinLimit(item.moves)) {
      item.pingUrl = pingUrl;
      console.log(`POST '${item.fen}' w/ depth ${item.depth} to ${ricpaClient.config.fullpath}`);
      ricpaClient.postFen(item);
    } else {
      console.log(`too long pgn for opening for analysis: ${item.moves.join(',')}`);
      analysisQueue.delete(item.fen);
    }
  } else {
    console.error('set ricpaClient settings in app.config.json to analyze positions');
  }
}

const analyzeLater = function(moves, base, priority) {
  return new Promise((resolve, reject) => {
    if (moves) {
      if (!base) reject('analyzeLater is called with moves without base');
      try {
        let movesList = pgnAnalyzer.splitSequentially(base, moves);
        movesList = movesList.filter(pgnAnalyzer.areMovesWithinLimit);
        movesList.forEach(function(moves) {
          const queueItem = {
            fen: converter.moves2fen(moves),
            moves,
            depth: depthSelector.getMinDepthRequired()
          };
          analysisQueue.add(queueItem, priority);
        });
      }
      catch (err) {
        reject(err);
      }
      resolve();
    } else {
      reject();
    }
  });
};

function setSettings(settings) {
  ricpaClient = settings.ricpaClient;
  pingUrl = settings.pingUrl;
}

module.exports = { analyze, analyzeLater, setSettings};

