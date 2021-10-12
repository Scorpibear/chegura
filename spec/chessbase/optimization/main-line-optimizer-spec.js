describe('mainLineOptimizer', function() {
  const mainLineOptimizer = require('../../../app/chessbase/optimization/main-line-optimizer');
  const baseIterator = {findLatestMainLine: () => {}, findMinDepthMainLinePath: () => {}};
  const pgnAnalyzer = require('../../../app/analysis/pgn-analyzer');
  describe('getMoves', function() {
    it('sends for evaluation last move in main line', function () {
      const base = { m: '', s: [
        {m: 'd4', s: [
          {m: 'Nf6' } ] } ] };
      spyOn(baseIterator, 'findLatestMainLine').and.returnValue(['d4', 'Nf6']);
      const moves = mainLineOptimizer.getMoves({base, baseIterator});
      expect(moves).toEqual(['d4', 'Nf6']);
    });

    it('optimize first node with minimal depth in the main line if mate was found', function() {
      var base = {m: '', e: {d: 37, v: 0.1}, s: [
        {m: 'g4', e: {d: 37, v: 0.1}, s: [
          {m: 'e5', e: {d: 30, v: 0.1}, s: [
            {m: 'f3', e: {d: 30, v: '#1'}, s: [
              {m: 'Qh4#'}
            ]}
          ]}
        ]}
      ]};
      spyOn(baseIterator, 'findMinDepthMainLinePath').and.returnValue(['g4', 'e5']);
      spyOn(baseIterator, 'findLatestMainLine').and.returnValue(['g4', 'e5', 'f3', 'Qh4#']);
      const moves = mainLineOptimizer.getMoves({base, baseIterator});
      expect(moves).toEqual(['g4', 'e5']);
    });

    it('optimize the first node with lowest depth in the main line if draw', function() {
      let base = {m: '', e: {d: 37, v: 0.1}, s: [
        {m: 'e4', e: {d: 32, v: 0.1}, s: [
          {m: 'e6', e: {d: 32, v: 0.15}, s: [
            {m: 'Nf3', e: {d: 300, v: 0}, s: [
              {m: 'Nf6'}
            ]}
          ]}
        ]}
      ]};
      spyOn(baseIterator, 'findLatestMainLine').and.returnValue(['e4', 'e6', 'Nf3', 'Nf6']);
      spyOn(baseIterator, 'findMinDepthMainLinePath').and.returnValue(['e4']);
      expect(mainLineOptimizer.getMoves({base, baseIterator})).toEqual(['e4']);
    });
    it('find min depth in the main line if main line is longer than moves limit', () => {
      const base = { m: '', s: [
        {m: 'd4', s: [
          {m: 'Nf6' } ] } ] };
      spyOn(baseIterator, 'findLatestMainLine').and.returnValue(['d4', 'Nf6']);
      spyOn(baseIterator, 'findMinDepthMainLinePath').and.returnValue(['d4']);
      spyOn(pgnAnalyzer, 'areMovesWithinLimit').and.returnValue(false);
      mainLineOptimizer.getMoves({base, baseIterator});
      expect(baseIterator.findMinDepthMainLinePath).toHaveBeenCalled();
    });
  });
});
