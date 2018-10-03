describe('converter', () => {
  const converter = require('../app/converter');

  describe('json2fenbase', () => {
    const fenbase = {add: () => {}, size: 42};
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const fene4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    const fend4 = 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1';
    it('skips position if evaluation is absent', () => {
      const jsonbase = {m: '', s:[
        {m: 'e4', e: {v: 0.1, d: 20}}
      ]};
      spyOn(console, 'error');
      spyOn(fenbase, 'add');
      converter.json2fenbase(jsonbase, fenbase);
      expect(console.error).not.toHaveBeenCalled();
      expect(fenbase.add).not.toHaveBeenCalled();
    });
    it('calls once for one bestmove in base', () => {
      const jsonbase = {m: '', e: {v: 0.1, d: 20},
        s:[{m: 'e4', e: {v: 0.1, d: 20}}]
      };
      spyOn(fenbase, 'add');
      converter.json2fenbase(jsonbase, fenbase);
      expect(fenbase.add).toHaveBeenCalledWith({fen, bestMove: 'e4', score: 0.1, depth: 20});
    });
    it('calls twice for 2 plies main line', () => {
      const jsonbase = 
        {m: '', e: {v: 0.1, d: 100}, s:[
          {m: 'e4', e: {v: 0.15, d: 80}, s:[
            {m: 'e6', e: {v: 0.15, d: 80}}
          ]}
        ]};
      spyOn(fenbase, 'add');
      converter.json2fenbase(jsonbase, fenbase);
      expect(fenbase.add).toHaveBeenCalledWith({fen, bestMove: 'e4', score: 0.1, depth: 100});
      expect(fenbase.add).toHaveBeenCalledWith({fen: fene4, bestMove: 'e6', score: 0.15, depth: 80});      
    });
    it('calls twice for 2 lines', () => {
      const jsonbase = 
        {m: '', e: {v: 0.1, d: 100}, s:[
          {m: 'e4', e: {v: 0.15, d: 80}, s:[]},
          {m: 'd4', e: {v: 0.13, d: 70}, s:[
            {m: 'Nf6', e: {v: 0.13, d: 70}}
          ]}
        ]};
      spyOn(fenbase, 'add');
      converter.json2fenbase(jsonbase, fenbase);
      expect(fenbase.add).toHaveBeenCalledTimes(2);
      expect(fenbase.add).toHaveBeenCalledWith({fen: fend4, bestMove: 'Nf6', score: 0.13, depth: 70});      
    });
    it('main line positions provided first', () => {
      const jsonbase = 
      {m: '', e: {v: 0.1, d: 100}, s:[
        {m: 'e4', e: {v: 0.15, d: 90}, s:[
          {m: 'e6', e: {v: 0.12, d: 80}, s:[
            {m: 'd4', e: {v: 0.12, d: 80}}
          ]}
        ]},
        {m: 'd4', e: {v: 0.13, d: 70}, s:[
          {m: 'Nf6', e: {v: 0.13, d: 70}}
        ]}
      ]};
      const owner = {mainline: () => {}, secondline: () => {}};
      spyOn(owner, 'mainline');
      spyOn(owner, 'secondline');
      spyOn(fenbase, 'add').and.callFake(({score}) => {
        if(score == 0.12) {
          owner.mainline();
        }
        if(score == 0.13) {
          owner.secondline();
        }
      });
      converter.json2fenbase(jsonbase, fenbase);
      expect(owner.mainline).toHaveBeenCalledBefore(owner.secondline);
    });
    it('calls nothing if base is empty', () => {
      spyOn(fenbase, 'add');
      converter.json2fenbase({}, fenbase);
      expect(fenbase.add).not.toHaveBeenCalled();
    });
    it('logs error if jsonbase was not specified', () => {
      spyOn(console, 'error').and.stub();
      converter.json2fenbase();
      expect(console.error).toHaveBeenCalled();
    });
    it('logs stats after 1000 positions analysis and in the end', () => {
      const jsonbase = {m: '', e: {v: 0.1, d: 20}, s:[
        {m: 'e4', e: {v: 0.1, d: 20}}
      ]};
      let i = 0;
      Object.defineProperty(jsonbase.s[0], 's', {get: () => {
        if(i <= 1000*6) {//6 times getter will be called for each object
          i++;
          return [jsonbase.s[0]];
        } else {
          return [];
        }
      }});
      spyOn(console, 'log').and.stub();
      converter.json2fenbase(jsonbase, fenbase);
      expect(console.log).toHaveBeenCalledTimes(2);
    });
  });
  describe('movesToFen', () => {
    it('works for start', () => {
      expect(converter.moves2fen([])).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });
    it('works for 3 moves', () => {
      expect(converter.moves2fen(['e4', 'd5', 'Nf3'])).
        toBe('rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2');
    });
    it('logs error if not an array passed', () => {
      spyOn(console, 'error').and.stub();
      converter.moves2fen({bad: 'data'});
      expect(console.error).toHaveBeenCalled();
    });
  });
});
