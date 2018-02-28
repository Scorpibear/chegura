describe('analysisQueue', function() {
    describe('push', function() {
        it('calls synchronizer.saveQueue', function() {
            var queue = require('../../app/analysis/analysis-queue')
            var synchronizer = require('../../app/analysis/synchronizer')
            spyOn(synchronizer,'saveQueue')
            queue.push([],0)
            expect(synchronizer.saveQueue).toHaveBeenCalled()
        });
        it('does not add to queue what is already there', () => {
            var queue = require('../../app/analysis/analysis-queue')
            queue.empty();                        

            queue.push(['d4'], 2);
            queue.push(['d4'], 3);

            expect(queue.getQueue()).toEqual([['d4']]);
        })
    });
    describe('getFirst', function() {
        it("returns first from queue", function() {
            var queue = require('../../app/analysis/analysis-queue')
            queue.empty();
            queue.push(["d4"],1);
            expect(queue.getFirst()).toEqual(["d4"])
        })
    });
    describe('empty', function() {
        it('empties the all queue', () => {
            var queue = require('../../app/analysis/analysis-queue')
            queue.empty();
            expect(queue.getQueue()).toEqual([]);
        })
    })
})