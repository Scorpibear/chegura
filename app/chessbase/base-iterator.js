var addMoves = function (result, moves, parentObject, requiredDepth, objectsToLookDeeper) {
    if (parentObject.s) {
        parentObject.s.forEach(function (childObject) {
            var movesWithChild = moves.slice();
            movesWithChild.push(childObject.m);
            if (!childObject.e || childObject.e.d < requiredDepth) {
                result.push(movesWithChild);
            } else {
                objectsToLookDeeper.push({ positionObject: childObject, moves: movesWithChild });
            }
        });
    }
}

module.exports.getMovesToInsufficientEvaluationDepth = function (base, requiredDepth) {
    var result = [];
    var moves = [];
    if(!base.e || base.e.d < requiredDepth) {
        result.push(moves);
    }
    var objectsToLookDeeper = []
    addMoves(result, moves, base, requiredDepth, objectsToLookDeeper)
    while (objectsToLookDeeper.length > 0) {
        var nextLevelOfObjects = [];
        objectsToLookDeeper.forEach(function (objectData) {
            addMoves(result, objectData.moves, objectData.positionObject, requiredDepth, nextLevelOfObjects)
        })
        objectsToLookDeeper = nextLevelOfObjects
    }
    return result;
}

module.exports.getMovesWithSameFenButDifferentEvaluation = function (base) {
    var result = [];
    //TODO: implement logic
    return result;
}

module.exports.findSubPositionObject = function (positionObject, move) {
    if (positionObject && positionObject.s) {
        for (var i = 0, l = positionObject.s.length; i < l; i++) {
            if (positionObject.s[i].m == move) {
                return positionObject.s[i];
            }
        }
    }
    return null;
}

module.exports.findLatestMainLine = function(base) {
    var result = [];
    var positionObject = base;
    if(positionObject.s && positionObject.s.length>0) {
        positionObject = positionObject.s[0];
    }
    while(positionObject && positionObject.hasOwnProperty("m")) {
        result.push(positionObject.m);
        if(positionObject.s && positionObject.s.length>0) {
            positionObject = positionObject.s[0];
        } else {
            break;
        }
    }
    console.log('after while');
    return result;
}
