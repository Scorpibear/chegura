describe('usageStatistics', function() {
  var usageStatistics;
  beforeAll(function() {
    usageStatistics = require('../app/usage-statistics');
  });
  beforeEach(function() {
    usageStatistics.reset();
  });
  describe('getUsersCount', function() {
    it('returns zero if no data', function() {
      expect(usageStatistics.getUsersCount()).toEqual(0)
    });
    it('returns 1 when base requested', function() {
      usageStatistics.registerBaseRequest("Tim");
      expect(usageStatistics.getUsersCount()).toEqual(1)
    });
    it('returns 1 when base requested twice for the same userID (e.g. refresh)', function() {
      usageStatistics.registerBaseRequest("Olga");
      usageStatistics.registerBaseRequest("Olga");
      expect(usageStatistics.getUsersCount()).toEqual(1)
    });
    it('does not return if user accessed base more than a week ago', function() {
      spyOn(Date, "now").and.returnValue(new Date("2015-08-31"));
      usageStatistics.registerBaseRequest("Alex");
      expect(usageStatistics.getUsersCount()).toEqual(0);
    });
    it('returns 2 if 2 different users access the base', function() {
      usageStatistics.registerBaseRequest("Peter");
      usageStatistics.registerBaseRequest("Paul");
      expect(usageStatistics.getUsersCount()).toEqual(2);
    })
  });
  describe('registerBaseRequest', function() {
    it('calls save with synchronizer from load call', function() {
      var synchronizer = {foo: "bar"};
      spyOn(usageStatistics, 'save');
      usageStatistics.load(synchronizer);
      usageStatistics.registerBaseRequest("Helen");
      expect(usageStatistics.save).toHaveBeenCalledWith(synchronizer);
    })
  })
  describe('getJSON', function() {
    it('works', function() {
      usageStatistics.registerBaseRequest("Vasia");
      let statsAsJson = usageStatistics.getJSON();
      expect(statsAsJson.logs[0].userID).toEqual("Vasia");
    })
  });
  describe('save', function() {
    it('save data to file', function() {
      let sampleJson = {foo: "bar"};
      spyOn(usageStatistics, 'getJSON').and.returnValue(sampleJson);
      let synchronizer = {save: function(){}};
      spyOn(synchronizer, 'save');

      usageStatistics.save(synchronizer);

      expect(usageStatistics.getJSON).toHaveBeenCalled();
      expect(synchronizer.save).toHaveBeenCalledWith(sampleJson);
    });
  });
  describe('load', function() {
    it('loads data from file', function() {
      let sampleJson = {logs: [{userID: "foo", date: Date.now()}]};
      let synchronizer = {load: function(){}};
      spyOn(synchronizer, 'load').and.returnValue(sampleJson);

      usageStatistics.load(synchronizer);

      expect(synchronizer.load).toHaveBeenCalled();
      expect(usageStatistics.getUsersCount()).toEqual(1);
    })
  })
});
