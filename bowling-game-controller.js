var BowlingGameController = function(model, view) {
  
  /*
    CONSTRUCTOR
  */
  
  this.model = model;
  
  this.view = view;
  
  // Focus input
  this.view.input.focus();
  
  /*
    EVENT BINDING
  */
  this.view.input.onkeyup = function(view) {
    return function(e) {
      view.score_entered(e);
      view.render();
    };
  }(this.view);
  
  this.view.demo.onclick = function(view) {
    return function(e) {
      view.bowling_game.run();
      view.render();
    };
  }(this.view);
  
}