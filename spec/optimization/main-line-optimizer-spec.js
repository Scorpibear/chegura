describe('mailLineOptimizer', function() {
    var mainLineOptimizer = require('../../app/optimization/main-line-optimizer');

    describe('goDeeper', function() {
        it('sends for evaluation last move in main line', function () {
            var base = { m: '', s: [
                {m: 'd4', s: [
                    {m: 'Nf6' } ] } ] };
            var analyzer = {analyzeLater: function(){}};
            spyOn(analyzer, 'analyzeLater');
            mainLineOptimizer.goDeeper(base, analyzer);
            expect(analyzer.analyzeLater).toHaveBeenCalledWith(['d4', 'Nf6'])
        });

        /*it('goes +2 half-moves deeper on the node with minimal depth in the main line if mate was found', function() {
            var base = {m: '', s: [
                {m: 'g4', s: [
                    {m: 'e5', s: [
                        {m: 'f3', s: [
                            {m: 'Qh4#'}
                        ]}
                    ]}
                ]}
            ]};
            mailLineOptimizer.goDeeper(base, analyzer);
        });*/

        //if draw found, go +2 half-moves deeper on the last node with not zero evaluation in the main line
    })
})
