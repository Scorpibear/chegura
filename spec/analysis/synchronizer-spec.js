const fs = require('fs');
const queueSerializer = require('../../app/analysis/queue-serializer');

describe('synchronizer', function() {
  var synchronizer = require('../../app/analysis/synchronizer');
  describe('loadQueue', function () {
    var queue = [['h3']];
    it('returns default queue if file not found', function() {
      expect(synchronizer.loadQueue('not-existed-file.json', queue)).toBe(queue);
    });
    it('logs error if could not load', () => {
      spyOn(console, 'error').and.stub();
      spyOn(fs, 'readFileSync').and.throwError('bad things');
      synchronizer.loadQueue('file.json', queue);
      expect(console.error).toHaveBeenCalled();
    });
    it('use queueSerializer.parse', () => {
      spyOn(fs, 'readFileSync').and.returnValue('queue content');
      spyOn(queueSerializer, 'parse').and.returnValue([['e5']]);
      expect(synchronizer.loadQueue('file.json', queue)).toEqual([['e5']]);
    });
  });
  describe('saveQueue', function() {
    const queueContent = [[],[],[],[]];
    it('calls queueSerializer.stringify', function() {
      var queueSerializer = require('../../app/analysis/queue-serializer');
      spyOn(queueSerializer,'stringify');
      synchronizer.saveQueue('test-filename.tmp', queueContent);
      expect(queueSerializer.stringify).toHaveBeenCalled();
    });
    it('call writeFileSync to avoid issues with multiple writeFile', () => {
      spyOn(fs, 'writeFileSync').and.stub();
      synchronizer.saveQueue('file.name', queueContent);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
    it('logs error if writeFileSync failed', () => {
      spyOn(console, 'error').and.stub();
      spyOn(fs, 'writeFileSync').and.throwError('bad things');
      synchronizer.saveQueue('file.name', queueContent);
      expect(console.error).toHaveBeenCalled();
    });
  });
});