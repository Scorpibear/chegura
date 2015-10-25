var Chess = require('./analysis/chess');
var chess = new Chess();

var validatePosition = function(preMoves, positionObject) {
    var move = chess.move(positionObject.m);
    if(!move) {
        console.error("Not valid answer after '" + preMoves + "' identified: '" + positionObject.m +
            "'! Please, investigate, fix the base and restart server");
        console.error("Legal moves: " + chess.moves())
    } else {
        preMoves.push(positionObject.m);
        validatePositions(preMoves, positionObject);
        preMoves.pop();
        chess.undo()
    }
};

var validatePositions = function(preMoves, positionObject) {
    if(positionObject.s && positionObject.s.length) {
        var uniqueMoves = {}
        positionObject.s.forEach(function(positionObject) {
            validatePosition(preMoves, positionObject)
            if(uniqueMoves.hasOwnProperty(positionObject.m)) {
                console.error("Duplicated answer after '" + preMoves + "' identified: '" + positionObject.m +"'! Please, investigate, fix the base and restart server")
            } else {
                uniqueMoves[positionObject.m] = null;
            }
        })
    }
}

module.exports.validate = function(base) {
    var preMoves=[];
    validatePositions(preMoves, base);
};
