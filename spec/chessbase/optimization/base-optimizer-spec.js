const baseOptimizer = require('../../../app/chessbase/optimization/base-optimizer');
const converter = require('../../../app/converter');
const mainLineOptimizer = require('../../../app/chessbase/optimization/main-line-optimizer');

describe('baseOptimizer', function() {
  const base = {m: 'd4', e: {v:0.12, d:30}, s: [{m: 'Nf6', e: {v:0.12, d:30}}]};
  const baseIterator = {getMovesToInsufficientEvaluationDepth:function(){}};

  describe('optimizeSync', function() {
    it('optimizes main line evaluation', function() {
      spyOn(mainLineOptimizer, 'getMoves');
      baseOptimizer.optimizeSync({base, baseIterator});
      expect(mainLineOptimizer.getMoves).toHaveBeenCalled();
    });
    it('calls moves2Fen for mainLineOptimizer.getMoves output', () => {
      spyOn(converter, 'moves2fen').and.stub();
      spyOn(mainLineOptimizer, 'getMoves').and.returnValue(['d4', 'd5']);
      baseOptimizer.optimizeSync({base, baseIterator});
      expect(converter.moves2fen).toHaveBeenCalledWith(['d4', 'd5']);
    });
  });
});
