class QueueProcessingStrategy{
  constructor({pgnAnalyzer, baseProvider}){
    this.pgnAnalyzer = pgnAnalyzer;
    this.baseProvider = baseProvider;
  }
  isInteresting(moves) {
    return this.pgnAnalyzer.isOptimal(moves, this.baseProvider.getBase());
  }
}

module.exports = QueueProcessingStrategy;