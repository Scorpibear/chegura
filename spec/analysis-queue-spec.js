describe('analysisQueue', function() {
    describe('push', function() {
        it('calls synchronizer.saveQueue', function() {
            var queue = require('../app/analysis-queue')
            var synchronizer = require('../app/synchronizer')
            spyOn(synchronizer,'saveQueue')
            queue.push([],0)
            expect(synchronizer.saveQueue).toHaveBeenCalled()
        })
    });
    describe('getFirst', function() {
        it("returns first from queue", function() {
            var queue = require('../app/analysis-queue')
            queue.empty();
            queue.push(["d4"],1);
            expect(queue.getFirst()).toEqual(["d4"])
        })
    })
})