describe('queueSearializer', function() {
    describe('parse', function () {
        it('parse only p0 and p1', function () {
            var queueSerializer = require('../app/queue-serializer')
            expect(queueSerializer.parse('{"q":[[["d4"]],[["e4"]],[["f4"]],[["h4"]]]}')).toEqual([[['d4']], [['e4']], [], []])
        })
    })
    describe('stringify', function() {
      it('saves only p0 and p1', function () {
            var queueSerializer = require('../app/queue-serializer')
            expect(queueSerializer.stringify([[['d4']],[['e4']],[['f4']],[['h4']]])).toEqual('{"q":[[["d4"]],[["e4"]],[],[]]}')
        })
    })
})