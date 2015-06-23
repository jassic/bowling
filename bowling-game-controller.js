var BABBEL = BABBEL || {};

// class BowlingGameController
BABBEL.BowlingGameController = (function() {
  
  // Constructor
  function BowlingGameController(model, view) {
    
    this.model = model;
    
    this.view = view;
    
    this.init();
    
  }
  
  // Initialize
  BowlingGameController.prototype.init = function() {
    
    // Focus input
    this.view.input.focus();
    
    // Bind elements
    this.bind();
    
  }
  
  // Bind elements
  BowlingGameController.prototype.bind = function() {
    
    // Bind input text field
    this.view.input.onkeyup = function(view) {
      return function(e) {
        view.score_entered(e);
        view.render();
      };
    }(this.view);
    
    // Bind demo button
    this.view.demo.onclick = function(view) {
      return function(e) {
        view.bowling_game.run();
        view.render();
      };
    }(this.view);
    
  }
  
  return BowlingGameController;
  
})();