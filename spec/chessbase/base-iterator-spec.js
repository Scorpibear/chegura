var baseIterator = require('../../app/chessbase/base-iterator.js')

describe('baseIterator', function () {
  describe('getMovesToInsufficientEvaluationDepth', function () {
    it("return root", function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({ m: '', e: { v: 0.12, d: 29 }, s: [] }, 30)).toEqual([[]]);
    })
    it("first best answer sends to evaluation", function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          {m: 'd4', e: {v: 0.1, d: 29}, s: []}
        ]
      }, 30)).toEqual([['d4']])
    })
    it("both answers are sent to evaluation", function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          { m: 'd4', e: { v: 0.1, d: 29 }, s: [] },
          { m: 'e4', e: { v: 0.1, d: 29 }, s: [] },
        ]
      }, 30)).toEqual([['d4'], ['e4']])
    })
    it("sub item is sent for revaluation", function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 35 }, s: [
          {
            m: 'd4', e: { v: 0.1, d: 35 }, s: [
            { m: 'Nf6', e: { v: 0.1, d: 34 }, s: [] }]
          },
          { m: 'e4', e: { v: 0.1, d: 35 }, s: [] },
        ]
      }, 35)).toEqual([['d4','Nf6']])
    })
    it("second move is added before third even if it go on lower branch", function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          {
            m: 'd4', e: { v: 0.1, d: 30 }, s: [
            {m: 'Nf6', e: {v: 0.1, d: 30}, s: [
              {m: 'Nf3', e: {v: 0.1, d: 29}, s: []}]}]
          },
          { m: 'e4', e: { v: 0.1, d: 30 }, s: [
            {m: 'e6', e: {v: 0.1, d:29}, s: []}] }
        ]
      }, 30)).toEqual([['e4', 'e6'], ['d4', 'Nf6', 'Nf3']])
    })
    it("skips evaluation of moves after not the best", function() {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          { m: 'e4', e: { v: 0.1, d: 30 }, s: [] },
          { m: 'd4', e: { v: 0.1, d: 30 }, s: [
            {m: 'Nf6', e: {v: 0.1, d: 30}, s: []},
            {m: 'd5', e: {v:0.1, d: 29}, s: []}
          ]}
        ]
      }, 30)).toEqual([])
    })
  });
  describe('findLatestMainLine', function() {
    it('returns latest', function() {
      var base = {m: '', s:[{m: 'd4', s: [ {m: 'Nf6'}]}]};
      expect(baseIterator.findLatestMainLine(base)).toEqual(['d4','Nf6']);
    })
  });
  describe('findPositionObject', function() {
    it('works', function() {
      let positionObject = baseIterator.findPositionObject(['d4'], {m: '', s:[{m: 'd4'}]});
      expect(positionObject).toEqual({m: 'd4'});
    });
    it('returns null if movesPath is not an array', function() {
      let positionObject = baseIterator.findPositionObject({});
      expect(positionObject).toBeNull();
    });
  });
  describe('findMinDepthMainLinePath', function() {
    it('works', function() {
      let base = {m: '', e: {v: 0.1, d: 47}, s:[{m: 'e4', e: {v: 0.15, d: 38}}]};
      let movesPath = baseIterator.findMinDepthMainLinePath(base);
      expect(movesPath).toEqual(['e4']);
    });
    it('iterates to 2 levels deep', function() {
      let base = {m: '', e: {v: 0.1, d: 47}, s:[{m: 'e4', e: {v: 0.15, d: 38}, s:[{m: 'e6', e: {v: 0.12, d: 32}}]}]};
      let movesPath = baseIterator.findMinDepthMainLinePath(base);
      expect(movesPath).toEqual(['e4', 'e6']);
    });
    it('finds lowest depth between high', function() {
      let base = {m: '', e: {v: 0.1, d: 47}, s:[{m: 'e4', e: {v: 0.15, d: 38}, s:[{m: 'e6', e: {v: 0.12, d: 32}, s:[{
        m: 'Nf3', e: {v: 0.12, d:28}, s:[{m: 'd5', e: {v: 0, d:100}}]
      }]}]}]};
      let movesPath = baseIterator.findMinDepthMainLinePath(base);
      expect(movesPath).toEqual(['e4', 'e6', 'Nf3']);
    })
  })
});
