describe('synchronizer', function() {
    var synchronizer = require('../app/synchronizer')
    describe('loadQueue', function () {
        it('returns default queue if file not found', function() {
            var queue = [['h3']];
            expect(synchronizer.loadQueue('not-existed-file.json', queue)).toBe(queue)
        })
    })
    describe('saveQueue', function() {
        it('calls queueSerializer.stringify', function() {
            var queueSerializer = require('../app/queue-serializer')
            spyOn(queueSerializer,'stringify')
            synchronizer.saveQueue('test-filename.tmp',[[],[],[],[]])
            expect(queueSerializer.stringify).toHaveBeenCalled()
        })
    })
})