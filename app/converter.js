const Chess = require("chess.js").Chess;
const fenAnalyzer = require("fen-analyzer");

class Converter {
  constructor(options) {
    this.logPeriod = options ? options.logPeriod : 1000;
  }
  moves2fen(moves) {
    if (moves && "length" in moves) {
      const chess = new Chess();
      moves.forEach((move) => chess.move(move));
      const fen = fenAnalyzer.normalize(chess.fen());
      return fen;
    } else {
      console.error(`Incorrect moves are supplied to moves2fen: ${moves}`);
      return null;
    }
  }
  json2fenbase(jsonbase, fenbase) {
    let positionsQueue = [];
    let positionCount = 0;

    const addFens = (position) => {
      let chess = new Chess(position.fen);
      chess.move(position.m);
      let fen = chess.fen();
      let bestMove = position.s && position.s.length && position.s[0].m;
      if (bestMove && position.e) {
        fenbase.add({
          fen,
          bestMove,
          score: position.e.v,
          depth: position.e.d,
        });
        positionCount++;
        if (positionCount % this.logPeriod == 0) {
          console.log(
            `${positionCount} => ${fenbase.size} in queue: ${positionsQueue.length}`
          );
        }
        position.s[0].fen = fen;
        addFens(position.s[0]);
        for (let i = 1; i < position.s.length; i++) {
          position.s[i].fen = fen;
          positionsQueue.push(position.s[i]);
        }
      }
    };
    if (jsonbase) {
      const baseCopy = JSON.parse(JSON.stringify(jsonbase));
      positionsQueue.push(baseCopy);
      while (positionsQueue.length) {
        let position = positionsQueue.shift();
        addFens(position);
      }
      console.log(
        `${positionCount} position objects corresponds to ${fenbase.size} unique positions`
      );
    } else {
      console.error("could not convert null jsonbase");
    }
  }
}

module.exports = new Converter();
