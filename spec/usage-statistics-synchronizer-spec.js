describe('usageStatisticsSynchronizer', function() {
  let usageStatisticsSynchronizer = require('../app/usage-statistics-synchronizer');

  describe('save', function() {
    it('saves it to file', function() {
      let jsonContent = {foo: "bar"};
      let fs = require('fs');
      spyOn(fs, 'writeFileSync');

      usageStatisticsSynchronizer.save(jsonContent);

      expect(fs.writeFileSync).toHaveBeenCalledWith(usageStatisticsSynchronizer.FILE_NAME, jsonContent);
    })
  })
});
