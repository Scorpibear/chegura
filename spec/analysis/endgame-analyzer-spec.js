describe('endgameAnalyzer', function() {
  let endgameAnalyzer = require('../../app/analysis/endgame-analyzer');

  describe('isEndgame', function() {
    it('should return false for start position', function() {
      expect(endgameAnalyzer.isEndgame([])).toBeFalsy();
    });
  });
});
