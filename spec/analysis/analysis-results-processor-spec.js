describe('analysis results processor', function() {
  const AnalysisResultsProcessor = require('../../app/analysis/analysis-results-processor');
  let analysisResultsProcessor = null;
  let chess = {move: () => 'e4', game_over: () => false, in_draw: false};
  let depthSelector = {MAX_DEPTH: 555};

  beforeAll(() => {
    analysisResultsProcessor = new AnalysisResultsProcessor(chess, 50, depthSelector, []);
  });

  describe('process data', function() {
    let evaluation = require('../../app/chessbase/evaluation');

    it('registers evaluation', function() {
      spyOn(evaluation, 'register');

      analysisResultsProcessor.process({score: 10});

      expect(evaluation.register).toHaveBeenCalledWith([], 'e4', 10, 50);
    });
    it('registers max depth if game is over', function() {
      spyOn(evaluation, 'register');
      spyOn(chess, 'game_over').and.returnValue(true);

      analysisResultsProcessor.process({score: 10});

      expect(evaluation.register).toHaveBeenCalledWith([], 'e4', 10, 555);
    });
    it('zeroing score if it is a draw', function() {
      spyOn(evaluation, 'register');
      spyOn(chess, 'game_over').and.returnValue(true);
      spyOn(chess, 'in_draw').and.returnValue(true);

      analysisResultsProcessor.process({score: 10});

      expect(evaluation.register).toHaveBeenCalledWith([], 'e4', 0, 555);
    });
  });
});
