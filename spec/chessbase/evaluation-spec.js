const evaluation = require('../../app/chessbase/evaluation');

describe('evaluation', function() {
  const moves = [];
  const bestMove = 'e4';
  const score = 0.23;
  const depth = 100;
  const data = {moves, bestMove, score, depth};
  describe('save', function() {
    let baseManager = null;
    beforeEach(function () {
      baseManager = require('../../app/chessbase/base-manager');
      spyOn(baseManager, 'addToBase');
    });
    it('calls baseManager.addToBase', function() {
      evaluation.save(data);
      expect(baseManager.addToBase).toHaveBeenCalled();
    });
    it('saves negative evaluation', function() {
      evaluation.save(data);
      expect(baseManager.addToBase).toHaveBeenCalledWith(moves, bestMove, score, depth);
    });
    it('does not throw exception if bestmove is null', function() {
      evaluation.save({moves, bestMove: null, score, depth});
      expect(baseManager.addToBase).not.toHaveBeenCalled();
    });
  });
});
