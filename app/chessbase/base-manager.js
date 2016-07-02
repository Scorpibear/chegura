var fs = require('fs')
var baseSerializer = require('./base-serializer')
var baseOptimizer = require('./optimization/base-optimizer')
var baseIterator = require('./base-iterator')

var base = { m: '', n: 0, c: 'b', t: 'wb' }
var filename = 'base.json'

var saveBase = function () {
    fs.writeFile(filename, baseSerializer.stringify(base, true));
}

var createChildPositionObject = function (parentObject, childMove, isBest) {
    var n, c;
    if (parentObject.c == 'w') {
        n = parentObject.n
        c = 'b'
    } else {
        n = parentObject.n + 1
        c = 'w'
    }
    var newChildObject = {m: childMove, n: n, c: c}
  	if(!parentObject.s) {
	    parentObject.s = []
    }
    if(isBest) {
	    parentObject.s.unshift(newChildObject)
	  } else {
	    parentObject.s.push(newChildObject)
	  }
    return newChildObject;
}

var improveEvaluation = function(positionObject, evaluationObject) {
    if(!positionObject.e || (evaluationObject.d > positionObject.e.d)) {
        positionObject.e = evaluationObject
    }
}

module.exports.addToBase = function (moves, bestAnswer, scoreValue, depth) {
    var evaluationObject = { v: scoreValue, d: depth };
    var positionObject = base;
    var parent;
    for (var i = 0; i < moves.length; i++) {
        parent = positionObject
        positionObject = baseIterator.findSubPositionObject(parent, moves[i])
        if (!positionObject) {
            positionObject = createChildPositionObject(parent, moves[i])
        }
    }
    improveEvaluation(positionObject, evaluationObject)
    if (positionObject != null) {
	    parent = positionObject
        var index
        var subPositionObject = (function() {
            if (positionObject && positionObject.s) {
                for (index = 0, l = positionObject.s.length; index < l; index++) {
                    if (positionObject.s[index].m == bestAnswer) {
                        return positionObject.s[index];
                    }
                }
            }
            return null;}())
        if (!subPositionObject) {
            subPositionObject = createChildPositionObject(parent, bestAnswer, true);
        } else {
            positionObject.s.splice(index, 1)
            positionObject.s.unshift(subPositionObject)
        }
        improveEvaluation(subPositionObject, evaluationObject)
        saveBase();
    }
}

module.exports.getBase = function() {
    return base;
}

module.exports.readBase = function () {
    var baseFileContent = fs.readFileSync(filename);
    base = baseSerializer.parse(baseFileContent);
}

module.exports.saveBase = saveBase

module.exports.getBaseAsString = function() {
    return baseSerializer.stringify(base);
}

module.exports.optimize = function(analyzer) {
    baseOptimizer.optimize(base, analyzer, baseIterator);
}