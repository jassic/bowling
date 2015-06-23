// class BowlingGame
var BowlingGame = function(player_names, selector) {
  
  /*
    CONSTRUCTOR
  */
  
  this.model = new BowlingGameModel(player_names);
  this.view = new BowlingGameView(selector, this.model);
  this.controller = new BowlingGameController(this.model, this.view);
  
}