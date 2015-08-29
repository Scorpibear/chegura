describe('analysisQueue', function() {
    describe('push', function() {
        var queueSerializer = null
        beforeEach(function (){
            queueSerializer = require('../app/queue-serializer')
            spyOn(queueSerializer,'stringify')
        })
        it('calls queueSerializer.stringify', function() {
            var queue = require('../app/analysis-queue')
            queue.push([],0)
            expect(queueSerializer.stringify).toHaveBeenCalled()
        })
    })
})