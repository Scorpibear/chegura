module.exports.isGameFinished = function(pathToAnalyze) {
    if(pathToAnalyze.length>0) {
        var theLatest = pathToAnalyze[pathToAnalyze.length-1];
        if(theLatest.endsWith('#')) {
            return true;
        }
    }
    return false;
}
