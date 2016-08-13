describe('drawChecker', function() {
  let drawChecker = require('../../../app/chessbase/optimization/draw-checker');
  describe('findPathToTheLatestNonDrawInMainLine', function() {
    it('works', function() {
      let base = {m: '', e: {v: 0.1, d: 42}, s:[{m: 'e4', e: {v: 0.1, d:42}, s: [{m: 'e5', e: {v: 0, d: 300}}]}]};
      let path = drawChecker.findPathToTheLatestNonDrawInMainLine(base);
      expect(path).toEqual(['e4']);
    })
  });
  describe('isDrawPosition', function() {
    it('returns false for position with non-zero value', function() {
      expect(drawChecker.isDrawPosition({m: 'Nf6', e: {v: 0.24, d: 32}})).toBeFalsy();
    });
    it('returns true for position with zero value and max depth', function() {
      expect(drawChecker.isDrawPosition({m: 'Bc4', e: {v: 0, d: 300}})).toBeTruthy();
    })
  })
});
