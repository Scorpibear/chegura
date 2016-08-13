describe('analyzerSync', function() {
  var analyzerSync = require('../../app/analysis/analyzer-sync');
  describe('analyze', function() {
    it('ignore double error positions, even if they were in queue', function() {
      var moves = ['h3', 'a6'];
      var analysisQueue = require('../../app/analysis/analysis-queue');
      analysisQueue.empty();
      analysisQueue.push(moves, 1);
      var pgnAnalyzer = require('../../app/analysis/pgn-analyzer');
      spyOn(pgnAnalyzer, 'isError').and.returnValue('true');

      analyzerSync.analyze();

      expect(analyzerSync.isAnalysisInProgress()).toEqual(false);
    });
    it('run baseManager optimize, if analysis queue is empty', function() {
      var analysisQueue = require('../../app/analysis/analysis-queue');
      spyOn(analysisQueue, 'getFirst').and.returnValue(null);
      var baseManager = require('../../app/chessbase/base-manager');
      spyOn(baseManager, 'optimize');
      // pass baseManager to analyze in some way

      analyzerSync.analyze();

      expect(baseManager.optimize).toHaveBeenCalled();
    });
    it('get depth from depthSelector', function() {
      let depthSelector = require('../../app/analysis/depth-selector');
      spyOn(depthSelector, 'getDepthToAnalyze');
      let analysisQueue = require('../../app/analysis/analysis-queue');
      spyOn(analysisQueue, 'getFirst').and.returnValue(['h3']);

      analyzerSync.analyze();

      expect(depthSelector.getDepthToAnalyze).toHaveBeenCalled();
    })
  });
});
