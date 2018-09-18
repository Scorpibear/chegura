describe('analysisQueue', function() {
  const analysisQueue = require('../../app/analysis/analysis-queue');
  it('initialized', () => {
    expect(analysisQueue).not.toBeNull();
  });
});
