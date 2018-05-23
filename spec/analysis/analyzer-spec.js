"use strict";

describe('analyzer', function() {
  var analyzer = require('../../app/analysis/analyzer');
  describe('analyzeLater', function() {
    it('do not analyze start position if first move is requested', function(done) {
      analyzer.resetQueue();
      analyzer.analyzeLater(['e4'], {m: '', s: [{m: 'd4'}]}, 1);
      var movesToAnalyze = analyzer.getQueue();
      done();
      expect(movesToAnalyze).toEqual([['e4']]);
    });
    it('do not analyze first move if it is in base', function(done) {
      analyzer.resetQueue();
      analyzer.analyzeLater(['d4', 'e6'], {m: '', s: [{m: 'd4'}]}, 1);
      var movesToAnalyze = analyzer.getQueue();
      expect(movesToAnalyze).toEqual([['d4', 'e6']]);
      done();
    });
    it('re-analyze start position if position is already in base', function(done) {
      analyzer.resetQueue();
      analyzer.analyzeLater([], {m: '', s: [{m: 'd4'}]}, 1);
      var movesToAnalyze = analyzer.getQueue();
      done();
      expect(movesToAnalyze).toEqual([[]]);
    });
    it('re-analyze first move if position is already in base', function(done) {
      analyzer.resetQueue();
      analyzer.analyzeLater(['d4'], {m: '', s: [{m: 'd4'}]}, 1);
      var movesToAnalyze = analyzer.getQueue();
      done();
      expect(movesToAnalyze).toEqual([['d4']]);
    });
    it('re-analyze position if it is already in base', function(done) {
      analyzer.resetQueue();
      analyzer.analyzeLater(['d4', 'e5'], {m: '', s: [{m: 'd4', s: [{m: 'e5'}]}]}, 1);
      var movesToAnalyze = analyzer.getQueue();
      expect(movesToAnalyze).toEqual([['d4', 'e5']]);
      done();
    });
  });
  describe('checkEvaluation', () => {
    it('checks that evaluation was requested from that url');
    it('registers correct evaluation');
  });
  describe('setChessEngineOptions', function() {
    it('calls setChessEngineOptions of analyzer-sync', function() {
      let analyzerSync = require('../../app/analysis/analyzer-sync');
      spyOn(analyzerSync, 'setChessEngineOptions');
      analyzer.setChessEngineOptions("path/to/engine", [{name: "a", value: "b"}]);
      expect(analyzerSync.setChessEngineOptions).toHaveBeenCalledWith("path/to/engine", [{name: "a", value: "b"}]);
    });
  });
});
