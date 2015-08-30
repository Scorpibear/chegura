var evaluationLogFileName = 'evaluations.log'
var baseManager = require('./base-manager')
var fs = require('fs')

module.exports.register = function(moveList, moveObject, relativeCentipawnScore, depth) {
    var resultBestmove = moveObject.san
	var scoreValue = relativeCentipawnScore / 100.0
	if (moveObject.color == 'b')
	    scoreValue = -scoreValue
	console.log("best move for " + moveList + " is ", resultBestmove, " with score/depth ", scoreValue, "/", depth)
	fs.appendFile(evaluationLogFileName, moveList.join(' ') + ' ' + resultBestmove + '! ' + scoreValue + '/' + depth + "\n", function (err) {
		if (err) console.error("could not append to '"+evaluationLogFileName+"' :", err)
	})
	//if(!baseManager) throw Error('base manager is not defined. Call analyzer.setBaseManager before')
	baseManager.addToBase(moveList, resultBestmove, scoreValue, depth)
}