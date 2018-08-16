const queue = require('../../app/analysis/analysis-queue');
const synchronizer = require('../../app/analysis/synchronizer');

describe('analysisQueue', function() {
  beforeEach(() => {
    queue.empty();
  });
  describe('delete', () => {
    it('deletes item', () => {
      queue.push(['d4'], 0);
      queue.delete(['d4']);
      expect(queue.getQueue()).toEqual([]);
    });
    it('deletes from second priority queue', () => {
      queue.push(['d4'], 1);
      queue.delete(['d4']);
      expect(queue.getQueue()).toEqual([]);
    });
    it('calls save', () => {
      queue.push(['d4'], 0).push(['d5'], 0);
      spyOn(queue, 'save').and.stub();
      queue.delete(['d5']);
      expect(queue.save).toHaveBeenCalled();
    });
  });
  describe('push', function() {
    it('saves', function() {
      spyOn(queue, 'save').and.stub();
      queue.push([], 0);
      expect(queue.save).toHaveBeenCalled();
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
  describe('save', function() {
    it('calls synchronizer.saveQueue', function() {
      spyOn(synchronizer, 'saveQueue').and.stub();
      queue.save();
      expect(synchronizer.saveQueue).toHaveBeenCalled();
    });
  });
});
