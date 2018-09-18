const evaluation = require('../../app/chessbase/evaluation');
const depthSelector = require('../../app/analysis/depth-selector');
const endgameAnalyzer = require('../../app/analysis/endgame-analyzer');
const fs = require('fs');

describe('evaluation', function() {
  const moves = ['e4', 'd5'];
  const bestMove = 'exd5';
  const score = 0.23;
  const depth = 100;
  const data = {moves, bestMove, score, depth};
  const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
  const chess = {in_draw: false, move: () => {}, game_over: () => {}, fen: () => fen};
  evaluation.Chess = function() { return chess; };

  describe('save', function() {
    let baseManager = null;
    beforeEach(function () {
      baseManager = require('../../app/chessbase/base-manager');
      chess.in_draw = false;
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
    it('set max depth if it is endgame', () => {
      spyOn(endgameAnalyzer, 'isEndgame').and.returnValue(true);
      evaluation.save(data);
      expect(baseManager.addToBase).toHaveBeenCalledWith(moves, bestMove, score, depthSelector.MAX_DEPTH);
    });
    it('uses chess.move to validate all moves', () => {
      spyOn(chess, 'move').and.stub();
      evaluation.save(data);
      expect(chess.move).toHaveBeenCalled();
    });
    it('zeroes score in case of draw', () => {
      spyOn(chess, 'game_over').and.returnValue(true);
      chess.in_draw = true;
      evaluation.save(data);
      expect(baseManager.addToBase).toHaveBeenCalledWith(moves, bestMove, 0, depthSelector.MAX_DEPTH);
    });
    it('logs error if could not append to file', () => {
      spyOn(console, 'error').and.stub();
      spyOn(fs, 'appendFile').and.callFake((filename, content, handler) => handler('error'));
      evaluation.save(data);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
