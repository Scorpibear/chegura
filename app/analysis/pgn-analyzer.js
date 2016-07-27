var types = {main: 'main', white: 'white', black: 'black', error: 'error'};

var baseIterator = require('../chessbase/base-iterator');

module.exports.isError = function(moves, base) {
    var position = base;
    var possibilities = {white: true, black: true};
	for(var i=0; position != null && i < moves.length; i++) {
        var move = moves[i];
        var bestMove;
        if(position.s && position.s.length>0) {
            bestMove = position.s[0].m;
        } else {
            return false;
        }
		if(move != bestMove) {
			if(i % 2 == 0) {
				possibilities.white = false;
			} else {
				possibilities.black = false;
			}
		}
        if(!possibilities.white && !possibilities.black) {
            return true;
        }
		position = baseIterator.findSubPositionObject(position, move);
	}
	return false;
};
