describe('pathChecker', function() {
    describe('isGameFinished', function() {
        it('return false in generic cases', function() {
            var pathChecker = require('../../../app/chessbase/optimization/path-checker');
            expect(pathChecker.isGameFinished(['d4'])).toBeFalsy();
        });
        it('return true in case finished with mate', function() {
            var pathChecker = require('../../../app/chessbase/optimization/path-checker');
            expect(pathChecker.isGameFinished(['g4', 'e5', 'f3', 'Qh4#'])).toBeTruthy();
        })
    })
})
