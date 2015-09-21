describe('requestProcessor', function() {
    describe('getBase', function() {
        it('save user info', function() {
            var requestProcessor = require('../app/request-processor');
            var usageStatistics = require('../app/usage-statistics');
            var res = {writeHead: function(){}, end: function(){}};
            var req = {url:""};
            spyOn(usageStatistics, 'registerBaseRequest');
            requestProcessor.getBase(req,res);
            expect(usageStatistics.registerBaseRequest).toHaveBeenCalled();
        })
    })

})
