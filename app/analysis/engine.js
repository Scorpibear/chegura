const UCI = require('uci');

const defaultChessEnginePath = "./stockfish_8_x64.exe";
const pathToChessEngine = (process.argv.length > 2) ?
  process.argv[2] : defaultChessEnginePath;
const uciEngine = new UCI(pathToChessEngine);

let uciOptions = [];

exports.analyzeToDepth = function(fen, depth) {
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
    return uciEngine.goDepthCommand(depth, function infoHandler(info) {
      // console.log(info)
    });
  });
};

exports.setUciOptions = options => {
  uciOptions = options;
};
