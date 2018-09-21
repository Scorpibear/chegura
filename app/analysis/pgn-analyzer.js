const baseIterator = require('../chessbase/base-iterator');

// checks if the moves list is optimal and returns true/false/undefined
module.exports.isOptimal = function(moves, base) {
  if (moves && moves.length) {
    let position = base;
    const possibilities = {white: true, black: true};
    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      let bestMove = position && position.s && position.s.length && position.s[0].m;
      if (move !== bestMove) {
        if (i % 2 === 0) {
          possibilities.white = false;
        } else {
          possibilities.black = false;
        }
      }
      if (!possibilities.white && !possibilities.black) {
        return bestMove ? false : undefined;
      }
      position = baseIterator.findSubPositionObject(position, move);
    }
  }
  return true;
};

module.exports.splitSequentially = function(base, moves) {
  let list = [];
  let positionObject = base;
  moves.forEach(function(move, index) {
    let subObject = baseIterator.findSubPositionObject(positionObject, move);
    if (subObject === null) {
      let movesToAdd = moves.slice(0, index + 1);
      list.push(movesToAdd);
    }
    positionObject = subObject;
  });
  if (list.length === 0)
    list.push(moves);
  return list;
};
