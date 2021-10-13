const baseIterator = require('../chessbase/base-iterator');

const DEFAULT_PLY_LIMIT = 80; // 40 moves, 80 ply

let plyLimit = DEFAULT_PLY_LIMIT;

// checks if the moves list is optimal and returns true/false/undefined
function isOptimal(moves, base) {
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
}

function cutToMatchLimit(moves) {
  return moves.slice(0, plyLimit - 1);
}

function setMovesLimit(newMovesLimit) {
  plyLimit = newMovesLimit * 2;
}

function splitSequentially(base, moves) {
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
}

function areMovesWithinLimit(moves) {
  if(Array.isArray(moves)) {
    return moves.length < plyLimit;
  } else {
    throw new Error(`List of moves has to be provided, but '${moves}' was provided instead`);
  }
}

module.exports = { areMovesWithinLimit, cutToMatchLimit, isOptimal, setMovesLimit, splitSequentially };
