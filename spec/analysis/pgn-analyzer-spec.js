describe('pgnAnalyzer', function() {
	describe('isError', function() {
		var pgnAnalyzer = require('../../app/analysis/pgn-analyzer');
        var base = {m:'',s: [{m: 'e4'}, {m:'h4', s: [{m: 'e5'}, {m: 'e6'}]}]};
        
		it('is false for start position', function() {
			expect(pgnAnalyzer.isError([], base)).toBeFalsy();
		});
        it('is true for error move then not the best unknown', function() {
            expect(pgnAnalyzer.isError(['h4', 'a5'], base)).toBeTruthy();
        });
        it('is false for white side error', function() {
            expect(pgnAnalyzer.isError(['h4'], base)).toBeFalsy();
        });
        it('is false for black side error', function() {
            expect(pgnAnalyzer.isError(['e4', 'd5'], base)).toBeFalsy();
        })
        it('is true for error move then second after the best', function() {
            expect(pgnAnalyzer.isError(['h4', 'e6'], base)).toBeTruthy();
        })
	});
});
