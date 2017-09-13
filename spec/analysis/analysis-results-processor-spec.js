describe('analysis results processor', function() {
  const AnalysisResultsProcessor = require('../../app/analysis/analysis-results-processor');
  describe('constructor', function() {
    it('initiate object without errors', function() {
      let analysisResultsProcessor = new AnalysisResultsProcessor();
      expect(analysisResultsProcessor).not.toBe(null);
    });
  });
});
