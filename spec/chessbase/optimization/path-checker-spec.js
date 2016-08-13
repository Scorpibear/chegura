describe('pathChecker', function() {
  let pathChecker = require('../../../app/chessbase/optimization/path-checker');

  describe('isCheckmate', function() {
    it('return false in generic cases', function() {
      expect(pathChecker.isCheckmate(['d4'])).toBeFalsy();
    });
    it('return true in case finished with mate', function() {
      expect(pathChecker.isCheckmate(['g4', 'e5', 'f3', 'Qh4#'])).toBeTruthy();
    });
  });
  describe('isDraw', function() {
    it('returns false in generic cases', function() {
      let base = {m: '', s: [{m: 'd4', e: {v: 0.1, d: 32}}]};
      expect(pathChecker.isDraw(['d4'], base)).toBeFalsy();
    });
    it('return true if v: 0, d: 300', function() {
      let base = {m: '', s: [{m: 'd4', e: {v: 0, d: 300}}]};
      expect(pathChecker.isDraw(['d4'], base)).toBeTruthy();
    });
  });
  describe('isGameOver', function() {
    it('calls isDraw', function() {
      spyOn(pathChecker, 'isDraw');
      let path = ['d4', 'd5'];
      let base = {m: '', s:[{m: 'd4', s:[{m: 'd5'}]}]};
      pathChecker.isGameOver(path, base);
      expect(pathChecker.isDraw).toHaveBeenCalledWith(path, base);
    })
  })
});
