describe('usageStatistics', function() {
    var usageStatistics;
    beforeAll(function() {
        usageStatistics = require('../app/usage-statistics');
    })
    beforeEach(function() {
        usageStatistics.reset();
    })
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
    })
})
