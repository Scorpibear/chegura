var findLatestMainLine = function(base) {
    return ['d4', 'Nf6'];
}

module.exports.goDeeper = function(base, analyzer) {
    var pathToAnalyze = [];
    pathToAnalyze = findLatestMainLine(base);
    if(analyzer) {
        analyzer.analyzeLater(pathToAnalyze);
    }
}
