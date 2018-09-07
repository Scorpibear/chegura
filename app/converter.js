const Chess = require('./analysis/chess').Chess;

class Converter {
  moves2fen(moves) {
    if(moves && 'length' in moves) {
      const chess = new Chess();
      moves.forEach(move => chess.move(move));
      return chess.fen();
    } else {
      console.error(`Incorrect moves are supplied to moves2fen: ${moves}`);
      return null;
    }
  }
}

module.exports = new Converter();
