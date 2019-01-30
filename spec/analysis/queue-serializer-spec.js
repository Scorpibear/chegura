describe('queueSearializer', function() {
  const queueSerializer = require('../../app/analysis/queue-serializer');
  describe('parse', function () {
    it('parse only p0 and p1', function () {
      expect(queueSerializer.parse('{"q":[[["d4"]],[["e4"]],[["f4"]],[["h4"]]]}')).toEqual([[['d4']], [['e4']], [], []]);
    });
  });
  describe('stringify', function() {
    const testQueue = [[['d4']],[['e4']],[['f4']],[['h4']]];
    it('saves full queue', function () {
      expect(JSON.parse(queueSerializer.stringify(testQueue))).toEqual({q: testQueue});
    });
    it('uses smart stringifier', () => {
      const smartStringifier = require('smart-stringifier');
      spyOn(smartStringifier, 'stringify');
      queueSerializer.stringify(testQueue);
      expect(smartStringifier.stringify).toHaveBeenCalledWith({q: testQueue});
    });
  });
});
