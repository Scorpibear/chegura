describe('analysisQueue', function() {
    describe('push', function() {
        it('calls synchronizer.saveQueue', function() {
            var queue = require('../app/analysis-queue')
            var synchronizer = require('../app/synchronizer')
            spyOn(synchronizer,'saveQueue')
            queue.push([],0)
            expect(synchronizer.saveQueue).toHaveBeenCalled()
        })
    })
})