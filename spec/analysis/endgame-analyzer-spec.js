describe('endgameAnalyzer', function() {
  let endgameAnalyzer = require('../../app/analysis/endgame-analyzer');

  describe('isEndgame', function() {
    it('should return false for start position', function() {
      expect(endgameAnalyzer.isEndgame('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBeFalsy();
    });
    it('should return true of 7men position', function() {
      expect(endgameAnalyzer.isEndgame('8/3k4/2rP4/3K1p2/4p3/5P2/8/8 w - - 0 56')).toBeTruthy();
    });
  });
});
