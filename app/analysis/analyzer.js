"use strict";

const analysisQueue = require('./analysis-queue');
const analyzerSync = require('./analyzer-sync');
const pgnAnalyzer = require('./pgn-analyzer');

const analyzeLater = function(moves, base, priority) {
  return new Promise((resolve, reject) => {
    if (moves) {
      if (!base) throw Error('analyzeLater is called with moves without base');
      let movesList = pgnAnalyzer.splitSequentially(base, moves);
      movesList.forEach(function(moves) {
        analysisQueue.add(moves, priority);
      });
    }
    setTimeout(() => {
      analyzerSync.analyze().then(null, err => console.error(err)).catch(err => {
        console.error(err);
      });
    }, 100);
    resolve();
  });
};

exports.analyzeLater = analyzeLater;

exports.getQueue = () => {
  return analysisQueue.getAllItems();
};

exports.resetQueue = () => {
  analysisQueue.empty();
};

exports.isAnalysisInProgress = analyzerSync.isAnalysisInProgress;

exports.setChessEngineOptions = (path, uciOptions) => {
  analyzerSync.setChessEngineOptions(path, uciOptions);
};

