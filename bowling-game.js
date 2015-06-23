var BABBEL = BABBEL || {};

// class BowlingGame
BABBEL.BowlingGame = (function() {
  
  // Constructor
  function BowlingGame(player_names, selector) {
    
    this.model = new BABBEL.BowlingGameModel(player_names);
    this.view = new BABBEL.BowlingGameView(selector, this.model);
    this.controller = new BABBEL.BowlingGameController(this.model, this.view);
    
  }
  
  return BowlingGame;
  
})();
