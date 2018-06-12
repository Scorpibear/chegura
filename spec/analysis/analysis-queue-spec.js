const queue = require('../../app/analysis/analysis-queue');

describe('analysisQueue', function() {
  beforeEach(() => {
    queue.empty();
  });
  describe('delete', () => {
    it('deletes item');
    it('calls save');
  });
  describe('push', function() {
    it('calls synchronizer.saveQueue', function() {
      var synchronizer = require('../../app/analysis/synchronizer');
      spyOn(synchronizer, 'saveQueue');
      queue.push([], 0);
      expect(synchronizer.saveQueue).toHaveBeenCalled();
    });
    it('does not add to queue what is already there', () => {
      queue.push(['d4'], 2);
      queue.push(['d4'], 3);

      expect(queue.getQueue()).toEqual([['d4']]);
    });
  });
  describe('getFirst', function() {
    it("returns first from queue", function() {
      queue.push(["d4"], 1);
      expect(queue.getFirst()).toEqual(["d4"]);
    });
    it('does not modify queue', () => {
      queue.push(['d4'], 1);
      queue.getFirst();
      expect(queue.getQueue()).toEqual([['d4']]);
    });
  });
  describe('empty', function() {
    it('empties the all queue', () => {
      queue.empty();
      expect(queue.getQueue()).toEqual([]);
    });
  });
});
