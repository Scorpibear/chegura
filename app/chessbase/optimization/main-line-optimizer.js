const priorityForMainLineOptimization = 3;

module.exports.goDeeper = function(base, baseIterator, analyzer) {
    var pathToAnalyze = [];
    pathToAnalyze = baseIterator.findLatestMainLine(base);
    if(analyzer) {
        analyzer.analyzeLater(pathToAnalyze, base, priorityForMainLineOptimization);
    }
}
