const fs = require('fs');

describe('usageStatisticsSynchronizer', function() {
  let usageStatisticsSynchronizer =
    require('../app/usage-statistics-synchronizer');

  describe('save', function() {
    it('saves it to file', function() {
      let jsonContent = {foo: 'bar'};

      spyOn(fs, 'writeFile');
      spyOn(JSON, 'stringify').and.returnValue('json as string');

      usageStatisticsSynchronizer.save(jsonContent);

      expect(JSON.stringify).toHaveBeenCalledWith(jsonContent);
      expect(fs.writeFile)
        .toHaveBeenCalledWith(usageStatisticsSynchronizer.FILE_NAME,
          'json as string', jasmine.anything());
    });
    it('logs error if callback is called with error', () => {
      spyOn(console, 'error').and.stub();
      spyOn(fs, 'writeFile').and.callFake(
        (filename, content, handler) => handler('something wrong')
      );
      usageStatisticsSynchronizer.save({some: 'content'});
      expect(console.error).toHaveBeenCalledWith('something wrong');
    });
    it('does not log error if handler is called without it', () => {
      spyOn(console, 'error').and.stub();
      spyOn(fs, 'writeFile').and.callFake(
        (filename, content, handler) => handler()
      );
      usageStatisticsSynchronizer.save({some: 'content'});
      expect(console.error).not.toHaveBeenCalled();
    });
    it('writes string as is', () => {
      spyOn(fs, 'writeFile').and.stub();
      usageStatisticsSynchronizer.save('the string');
      expect(fs.writeFile).toHaveBeenCalledWith(usageStatisticsSynchronizer.FILE_NAME,
        'the string', jasmine.anything());
    });
  });
  describe('load', function() {
    it('loads json from file', function() {
      let expectedObject = {parsed: 'JSON'};
      spyOn(fs, 'readFileSync').and.returnValue('value from file');
      spyOn(JSON, 'parse').and.returnValue(expectedObject);

      var content = usageStatisticsSynchronizer.load();

      expect(content).toEqual(expectedObject);
      expect(JSON.parse).toHaveBeenCalledWith('value from file');
      expect(fs.readFileSync)
        .toHaveBeenCalledWith(usageStatisticsSynchronizer.FILE_NAME);
    });
    it('returns null if file does not exist', function() {
      spyOn(fs, 'readFileSync').and
        .throwError('ENOENT: no such file or directory, open \'usage-statistics.json\'');

      expect(usageStatisticsSynchronizer.load()).toBeNull();
    });
    it('returns null if file content could not be parsed', () => {
      spyOn(fs, 'readFileSync').and.returnValue('not json');
      expect(usageStatisticsSynchronizer.load()).toBeNull();
    });
  });
});
