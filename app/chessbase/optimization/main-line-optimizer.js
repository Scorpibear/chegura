var analysisPriority = require('../../../app/analysis/analysis-priority');
var pathChecker = require('./path-checker');

module.exports.goDeeper = function(base, baseIterator, analyzer) {
    var pathToAnalyze = [];
    pathToAnalyze = baseIterator.findLatestMainLine(base);
    if(pathChecker.isGameFinished(pathToAnalyze)) {
        pathToAnalyze = baseIterator.findMinDepthMainLinePath(base);
    }
    if(analyzer) {
        analyzer.analyzeLater(pathToAnalyze, base, analysisPriority.MainLineOptimization);
    }
}
