'use strict';

//const Engine = require('../../app/analysis/remote-engine');
const Engine = require('uci-adapter');
const analyzer = require('../../app/analysis/analyzer');
const analysisQueue = require('../../app/analysis/analysis-queue');
const baseManager = require('../../app/chessbase/base-manager');
const pgnAnalyzer = require('../../app/analysis/pgn-analyzer');

describe('analyzerSync', function() {
  var analyzerSync = require('../../app/analysis/analyzer-sync');
  analyzerSync.setChessEngineOptions("", []);
  Engine.prototype.analyzeToDepth = () => Promise.resolve(0);
  describe('analyze', function() {
    it('ignore double error positions, even if they were in queue', done => {
      const analyzer = require('../../app/analysis/analyzer');
      spyOn(analyzer, 'analyzeLater').and.stub();
      var moves = ['h3', 'a6'];
      analysisQueue.empty();
      analysisQueue.add(moves, 1);
      spyOn(pgnAnalyzer, 'isOptimal').and.returnValue('false');

      analyzerSync.analyze().then(() => {
        expect(analyzerSync.isAnalysisInProgress()).toEqual(false);
        done();
      });
    });
    it('run baseManager optimize, if analysis queue is empty', done => {
      const analyzer = require('../../app/analysis/analyzer');
      spyOn(analyzer, 'analyzeLater').and.stub();
      spyOn(analysisQueue, 'getFirst').and.returnValue(null);
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
      spyOn(analysisQueue, 'getFirst').and.returnValue(['h3']);
      spyOn(Engine.prototype, 'analyzeToDepth').and.returnValue(Promise.resolve(0));

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
      spyOn(analyzer, 'analyzeLater').and.stub();
      spyOn(Engine.prototype, 'analyzeToDepth').and.returnValue(Promise.resolve(0));
      const depthSelector = require('../../app/analysis/depth-selector');
      spyOn(analysisQueue, 'getFirst').and.returnValue([]);
      spyOn(pgnAnalyzer, 'isOptimal').and.returnValue(true);
      spyOn(depthSelector, 'getDepthToAnalyze').and.returnValue(1);

      analyzerSync.analyze().then(sentForAnalysis => {
        expect(sentForAnalysis).toBe(true);
        expect(analyzerSync.isAnalysisInProgress()).toBe(false);
        expect(analyzer.analyzeLater).toHaveBeenCalled();
        done();
      });
    });
    it('deletes moves from queue if pgn is not optimal', async () => {
      spyOn(analysisQueue, 'getFirst').and.returnValue(['d4', 'h5']);
      spyOn(analysisQueue, 'delete').and.stub();
      spyOn(pgnAnalyzer, 'isOptimal').and.returnValue('false');
      spyOn(analyzer, 'analyzeLater').and.stub();
      spyOn(baseManager, 'getBase').and.stub();
      await analyzerSync.analyze();
      expect(analysisQueue.delete).toHaveBeenCalledWith(['d4', 'h5']);
    });
  });
  describe('setChessEngineOptions', () => {
    it('calls engine setUciOptions', () => {
      spyOn(Engine.prototype, 'setUciOptions').and.stub();

      analyzerSync.setChessEngineOptions("/path/to/engine", [{name: "a", value: "b"}, {name: "c", value: "d"}]);

      expect(Engine.prototype.setUciOptions).toHaveBeenCalledWith([{name: "a", value: "b"}, {name: "c", value: "d"}]);
    });
  });
});
