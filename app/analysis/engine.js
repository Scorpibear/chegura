// supports analysis to specified depth

const UCI = require('uci');

let uciEngine;

let uciOptions = [];

class Engine {
  constructor(pathToChessEngine) {
    uciEngine = new UCI(pathToChessEngine);
  }

  analyzeToDepth(fen, depth) {
    return uciEngine.runProcess().then(function() {
      return uciEngine.uciCommand();
    }).then(function() {
      return uciEngine.isReadyCommand();
    }).then(function() {
      uciOptions.forEach(function(option) {
        uciEngine.setOptionCommand(option.name, option.value);
      });
      return uciEngine.isReadyCommand();
    }).then(function() {
      return uciEngine.uciNewGameCommand();
    }).then(function() {
      return uciEngine.positionCommand(fen);
    }).then(function() {
      return uciEngine.goDepthCommand(depth /* , function infoHandler(info) {
        console.log(info)
      }*/);
    });
  }
  setUciOptions(options) {
    uciOptions = options;
  }

}

module.exports = Engine;
