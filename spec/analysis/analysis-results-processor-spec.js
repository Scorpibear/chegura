describe('analysis results processor', function() {
  const AnalysisResultsProcessor = require('../../app/analysis/analysis-results-processor');
  let analysisResultsProcessor = null;
  let chess = {move: () => 'e4', game_over: () => false, in_draw: false, fen: () => 'r 0'};
  let depthSelector = {MAX_DEPTH: 555};

  beforeAll(() => {
    analysisResultsProcessor = new AnalysisResultsProcessor(chess, 50, depthSelector, []);
  });

  describe('process data', function() {
    let evaluation = require('../../app/chessbase/evaluation');
    let endgameAnalyzer = require('../../app/analysis/endgame-analyzer');

    it('registers evaluation', function() {
      spyOn(evaluation, 'register');
      spyOn(endgameAnalyzer, 'isEndgame').and.returnValue(false);

      analysisResultsProcessor.process({score: 10});

      expect(evaluation.register).toHaveBeenCalledWith([], 'e4', 10, 50);
    });
    it('registers max depth if game is over', function() {
      spyOn(evaluation, 'register');
      spyOn(chess, 'game_over').and.returnValue(true);
      spyOn(endgameAnalyzer, 'isEndgame').and.returnValue(false);

      analysisResultsProcessor.process({score: 10});

      expect(evaluation.register).toHaveBeenCalledWith([], 'e4', 10, 555);
    });
    it('zeroing score if it is a draw', function() {
      spyOn(evaluation, 'register');
      spyOn(chess, 'game_over').and.returnValue(true);
      spyOn(chess, 'in_draw').and.returnValue(true);
      spyOn(endgameAnalyzer, 'isEndgame').and.returnValue(false);

      analysisResultsProcessor.process({score: 10});

      expect(evaluation.register).toHaveBeenCalledWith([], 'e4', 0, 555);
    });
    it('sets max depth if 7 men position reached', function() {
      spyOn(evaluation, 'register');
      spyOn(endgameAnalyzer, 'isEndgame').and.returnValue(true);

      analysisResultsProcessor.process({score: 0});

      expect(evaluation.register).toHaveBeenCalledWith([], 'e4', 0, 555);
    });
  });
});
