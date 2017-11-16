'use strict';

describe('analyzerSync', function() {
  var analyzerSync = require('../../app/analysis/analyzer-sync');
  describe('analyze', function() {
    it('ignore double error positions, even if they were in queue', done => {
      const analyzer = require('../../app/analysis/analyzer');
      spyOn(analyzer, 'analyzeLater').and.stub();
      var moves = ['h3', 'a6'];
      var analysisQueue = require('../../app/analysis/analysis-queue');
      analysisQueue.empty();
      analysisQueue.push(moves, 1);
      var pgnAnalyzer = require('../../app/analysis/pgn-analyzer');
      spyOn(pgnAnalyzer, 'isError').and.returnValue('true');

      analyzerSync.analyze().then(() => {
        expect(analyzerSync.isAnalysisInProgress()).toEqual(false);
        done();
      });
    });
    it('run baseManager optimize, if analysis queue is empty', done => {
      const analyzer = require('../../app/analysis/analyzer');
      spyOn(analyzer, 'analyzeLater').and.stub();
      var analysisQueue = require('../../app/analysis/analysis-queue');
      spyOn(analysisQueue, 'getFirst').and.returnValue(null);
      var baseManager = require('../../app/chessbase/base-manager');
      spyOn(baseManager, 'optimize');
      // pass baseManager to analyze in some way

      analyzerSync.analyze().then(() => {
        expect(baseManager.optimize).toHaveBeenCalled();
        done();
      });
    });
    it('get depth from depthSelector', done => {
      const analyzer = require('../../app/analysis/analyzer');
      spyOn(analyzer, 'analyzeLater').and.stub();
      let depthSelector = require('../../app/analysis/depth-selector');
      spyOn(depthSelector, 'getDepthToAnalyze');
      let analysisQueue = require('../../app/analysis/analysis-queue');
      spyOn(analysisQueue, 'getFirst').and.returnValue(['h3']);
      const engine = require('../../app/analysis/engine');
      spyOn(engine, 'analyzeToDepth').and.returnValue(Promise.resolve(0));


      analyzerSync.analyze().then(() => {
        expect(depthSelector.getDepthToAnalyze).toHaveBeenCalled();
        done();
      });
    });
    /*
    it('load evaluation instantly for already-evaluated transposition', function() {
      let analysisQueue = require('../../app/analysis/analysis-queue');
      spyOn(analysisQueue, 'getFirst').and.returnValue(['Nf6', 'e6', 'e4']);
      analyzerSync.analyze(, {m: '', s: [{m: 'e4', s: [{m: 'e6', s: [{m: 'Nf6', e: {v: 0.18, d: 38}, s:[{m: 'd5'}]}]}]}]});
      expect()
    });*/
    it('calls finalize after engine finished analysis', done => {
      console.log('the test');
      const analyzer = require('../../app/analysis/analyzer');
      spyOn(analyzer, 'analyzeLater').and.stub();
      const engine = require('../../app/analysis/engine');
      spyOn(engine, 'analyzeToDepth').and.returnValue(Promise.resolve(0));
      const analysisQueue = require('../../app/analysis/analysis-queue');
      const pgnAnalyzer = require('../../app/analysis/pgn-analyzer');
      const depthSelector = require('../../app/analysis/depth-selector');
      spyOn(analysisQueue, 'getFirst').and.returnValue([]);
      spyOn(pgnAnalyzer, 'isError').and.returnValue(false);
      spyOn(depthSelector, 'getDepthToAnalyze').and.returnValue(1);

      analyzerSync.analyze().then(sentForAnalysis => {
        expect(sentForAnalysis).toBe(true);
        expect(analyzerSync.isAnalysisInProgress()).toBe(false);
        expect(analyzer.analyzeLater).toHaveBeenCalled();
        done();
      });
    });
  });
  describe('setUciOptions', () => {
    it('calls engine setUciOptions', () => {
      const engine = require('../../app/analysis/engine');
      spyOn(engine, 'setUciOptions').and.stub();

      analyzerSync.setUciOptions([{name: "a", value: "b"}, {name: "c", value: "d"}]);

      expect(engine.setUciOptions).toHaveBeenCalledWith([{name: "a", value: "b"}, {name: "c", value: "d"}]);
    });
  });
});
