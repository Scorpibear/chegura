var analysisPriority = require('../../../app/analysis/analysis-priority')

module.exports.goDeeper = function(base, baseIterator, analyzer) {
    var pathToAnalyze = [];
    pathToAnalyze = baseIterator.findLatestMainLine(base);
    if(analyzer) {
        analyzer.analyzeLater(pathToAnalyze, base, analysisPriority.MainLineOptimization);
    }
}
