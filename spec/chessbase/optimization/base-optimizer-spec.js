const baseOptimizer = require('../../../app/chessbase/optimization/base-optimizer');
const converter = require('../../../app/converter');
const mainLineOptimizer = require('../../../app/chessbase/optimization/main-line-optimizer');
const depthSelector = require('../../../app/analysis/depth-selector');
const analysisQueue = require('../../../app/analysis/analysis-queue');

describe('baseOptimizer', function() {
  const base = {m: 'd4', e: {v:0.12, d:30}, s: [{m: 'Nf6', e: {v:0.12, d:30}}]};
  const baseIterator = { getMovesToInsufficientEvaluationDepth: () => {}, findLatestMainLine: () => {} };
  const moves = ['d4'];
  const fen = 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1';
  const depth = 40;
  describe('optimize', () => {
    it('calls optimizeSync', () => {
      spyOn(baseOptimizer, 'optimizeSync').and.stub();
      return baseOptimizer.optimize({base, baseIterator: null, settings: {optimize: true}}).then(() => {
        expect(baseOptimizer.optimizeSync).toHaveBeenCalled();
      });
    });
    it('logs error if it was thrown in optimizeSync', () => {
      spyOn(baseOptimizer, 'optimizeSync').and.throwError('something wrong');
      spyOn(console, 'error').and.stub();
      return baseOptimizer.optimize({base, baseIterator: null, settings: {optimize: true}}).then(() => {
        expect(console.error).toHaveBeenCalled();
      });
    });
    it('does not call optimizeSync if settings.optimize is false', () => {
      spyOn(baseOptimizer, 'optimizeSync').and.stub();
      return baseOptimizer.optimize({base, baseIterator: null, settings: {optimize: false}}).then(() => {
        expect(baseOptimizer.optimizeSync).not.toHaveBeenCalled();
      });
    });
  });
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
    it('adds to queue moves from getMovesToInsufficientEvaluationDepth', () => {
      spyOn(baseIterator, 'getMovesToInsufficientEvaluationDepth').and.returnValue([moves]);
      spyOn(converter, 'moves2fen').and.returnValue(fen);
      spyOn(depthSelector, 'getMinDepthRequired').and.returnValue(depth);
      spyOn(mainLineOptimizer, 'getMoves').and.stub();
      spyOn(analysisQueue, 'add').and.stub();
      baseOptimizer.optimizeSync({base, baseIterator});
      expect(analysisQueue.add).toHaveBeenCalledWith({fen, depth, moves}, 2);
    });
    it('logs error if baseIterator is not specified', () => {
      spyOn(console, 'error').and.stub();
      baseOptimizer.optimizeSync({});
      expect(console.error).toHaveBeenCalled();
    });
  });
});
