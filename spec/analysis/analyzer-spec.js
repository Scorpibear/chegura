describe('analyzer', function() {
  const analyzer = require('../../app/analysis/analyzer');
  const queue = require('../../app/analysis/analysis-queue');
  const base = {};
  describe('analyzeLater', () => {
    it('calls queue.add', () => {
      spyOn(queue, 'add');
      analyzer.analyzeLater(['d4', 'd5'], base, 1);
      expect(queue.add).toHaveBeenCalled();
    });
  });
});
