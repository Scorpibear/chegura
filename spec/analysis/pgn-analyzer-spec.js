describe('pgnAnalyzer', function() {
  const pgnAnalyzer = require('../../app/analysis/pgn-analyzer');
  const base = {m: '', s: [{m: 'e4'}, {m: 'h4', s: [{m: 'e5'}, {m: 'e6'}]}]};
  describe('isOptimal', function() {
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
    it('is undefined if was optimal but the path is too far', () => {
      expect(pgnAnalyzer.isOptimal(['e4', 'd5', 'd4'], base)).toBeUndefined();
    });
  });
  describe('splitSequentially', () => {
    it('returns list of moves as is if nothing to split', () => {
      expect(pgnAnalyzer.splitSequentially(base, ['h4', 'e5'])).toEqual([['h4', 'e5']]);
    });
  });
  describe('areMovesWithinLimit', () => {
    it('returns false when matched exactly', () => {
      pgnAnalyzer.setMovesLimit(3);
      expect(pgnAnalyzer.areMovesWithinLimit(['d4', 'd5', 'Nf3', 'Nf6', 'c4', 'e6'])).toBeFalsy();
    });
    it('limit moves does not work for previous ply', () => {
      pgnAnalyzer.setMovesLimit(3);
      expect(pgnAnalyzer.areMovesWithinLimit(['d4', 'd5', 'Nf3', 'Nf6', 'c4'])).toBeTruthy();
    });
    it('throws error when not array of moves is provided', () => {
      const errorInput = 'fen was provided by mistake';
      expect(() => pgnAnalyzer.areMovesWithinLimit(errorInput))
        .toThrowError(`List of moves has to be provided, but '${errorInput}' was provided instead`);
    });
    it('throws error when parameter is missed', () => {
      expect(() => pgnAnalyzer.areMovesWithinLimit())
        .toThrowError(`List of moves has to be provided, but '${undefined}' was provided instead`);
    });
  });
  describe('cutToMatchLimit', () => {
    it('reduces moves list length to specified moves transformed to ply', () => {
      pgnAnalyzer.setMovesLimit(2);
      expect(pgnAnalyzer.cutToMatchLimit(['d4', 'd5', 'Nf3', 'Nf6', 'c4', 'e6'])).toEqual(['d4', 'd5', 'Nf3']);
    });
  });
});
