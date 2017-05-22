'use strict';

const analysisPriority = require('../../../app/analysis/analysis-priority');
const pathChecker = require('./path-checker');

module.exports.goDeeper = function(base, baseIterator, analyzer) {
  var pathToAnalyze = [];
  pathToAnalyze = baseIterator.findLatestMainLine(base);
  if (pathChecker.isGameOver(pathToAnalyze, base)) {
    pathToAnalyze = baseIterator.findMinDepthMainLinePath(base);
    pathToAnalyze.pop();
  }
  if (analyzer) {
    analyzer.analyzeLater(pathToAnalyze, base,
      analysisPriority.MainLineOptimization);
  }
};
