describe('usageStatisticsSynchronizer', function() {
  let usageStatisticsSynchronizer =
    require('../app/usage-statistics-synchronizer');

  describe('save', function() {
    it('saves it to file', function() {
      let jsonContent = {foo: "bar"};
      let fs = require('fs');
      spyOn(fs, 'writeFileSync');
      spyOn(JSON, 'stringify').and.returnValue('json as string');

      usageStatisticsSynchronizer.save(jsonContent);

      expect(JSON.stringify).toHaveBeenCalledWith(jsonContent);
      expect(fs.writeFileSync)
        .toHaveBeenCalledWith(usageStatisticsSynchronizer.FILE_NAME,
          'json as string');
    });
  });
  describe('load', function() {
    it('loads json from file', function() {
      let expectedObject = {parsed: 'JSON'};
      let fs = require('fs');
      spyOn(fs, 'readFileSync').and.returnValue('value from file');
      spyOn(JSON, 'parse').and.returnValue(expectedObject);

      var content = usageStatisticsSynchronizer.load();

      expect(content).toEqual(expectedObject);
      expect(JSON.parse).toHaveBeenCalledWith('value from file');
      expect(fs.readFileSync)
        .toHaveBeenCalledWith(usageStatisticsSynchronizer.FILE_NAME);
    });
    it('returns null if file does not exist', function() {
      let fs = require('fs');
      spyOn(fs, 'readFileSync').and
        .throwError("ENOENT: no such file or directory, open 'usage-statistics.json'");

      expect(usageStatisticsSynchronizer.load()).toBeNull();
    });
  });
});
