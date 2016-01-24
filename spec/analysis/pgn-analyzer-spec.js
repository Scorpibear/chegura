describe('pgnAnalyzer', function() {
	describe('isError', function() {
		var pgnAnalyzer = require('../../app/analysis/pgn-analyzer');
		beforeEach(function() {
			var baseManager = require('../../app/chessbase/base-manager');
            spyOn(baseManager, 'getBase').and.returnValue({m:'',s: [{m: 'd4'}, {m:'h4', s: [{m: 'e5'}]}]});
		})
		it('is false for start position', function() {
			expect(pgnAnalyzer.isError([])).toBeFalsy();
		});
        it('is true for both sides error', function() {
            expect(pgnAnalyzer.isError(['h4', 'a5'])).toBeTruthy();
        });
        it('is false for white side error', function() {
            expect(pgnAnalyzer.isError(['h4'])).toBeFalsy();
        });
        it('is false for black side error', function() {
            expect(pgnAnalyzer.isError(['d4', 'd5'])).toBeFalsy();
        })

	});
});
