describe('pgnAnalyzer', function() {
  const pgnAnalyzer = require('../../app/analysis/pgn-analyzer');
  describe('isOptimal', function() {
    
    var base = {m: '', s: [{m: 'e4'}, {m: 'h4', s: [{m: 'e5'}, {m: 'e6'}]}]};

    it('is true for start position', function() {
      expect(pgnAnalyzer.isOptimal([], base)).toBeTruthy();
    });
    it('is false for error move then not the best unknown', function() {
      expect(pgnAnalyzer.isOptimal(['h4', 'a5'], base)).toBeFalsy();
    });
    it('is true for white side error', function() {
      expect(pgnAnalyzer.isOptimal(['h4'], base)).toBeTruthy();
    });
    it('is true for black side error', function() {
      expect(pgnAnalyzer.isOptimal(['e4', 'd5'], base)).toBeTruthy();
    });
    it('is false for error move then second after the best', function() {
      expect(pgnAnalyzer.isOptimal(['h4', 'e6'], base)).toBeFalsy();
    });
  });
});
