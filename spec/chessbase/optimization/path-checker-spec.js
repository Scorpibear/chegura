'use strict';

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
  describe('isMaxDepth', function() {
    it('returns false in generic cases', function() {
      let base = {m: '', s: [{m: 'd4', e: {v: 0.1, d: 32}}]};
      expect(pathChecker.isMaxDepth(['d4'], base)).toBeFalsy();
    });
    it('returns false if base is empty', () => {
      expect(pathChecker.isMaxDepth(['d4', 'd5'],{})).toBeFalsy();
    })
    it('return true if v: 0, d: 300', function() {
      let base = {m: '', s: [{m: 'd4', e: {v: 0, d: 300}}]};
      expect(pathChecker.isMaxDepth(['d4'], base)).toBeTruthy();
    });
  });
  describe('isGameOver', function() {
    it('calls isMaxDepth', function() {
      spyOn(pathChecker, 'isMaxDepth');
      let path = ['d4', 'd5'];
      let base = {m: '', s:[{m: 'd4', s:[{m: 'd5'}]}]};
      pathChecker.isGameOver(path, base);
      expect(pathChecker.isMaxDepth).toHaveBeenCalledWith(path, base);
    });
  });
});
