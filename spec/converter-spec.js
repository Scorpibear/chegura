describe('converter', () => {
  const converter = require('../app/converter');

  describe('movesToFen', () => {
    it('works for start', () => {
      expect(converter.moves2fen([])).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });
    it('works for 3 moves', () => {
      expect(converter.moves2fen(['e4', 'd5', 'Nf3'])).
        toBe('rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2');
    });
    it('logs error if not an array passed', () => {
      spyOn(console, 'error').and.stub();
      converter.moves2fen({bad: 'data'});
      expect(console.error).toHaveBeenCalled();
    });
  });
});
