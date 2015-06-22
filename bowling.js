// class Frame
var Frame = function(player) {
  
  /*
    PROPERTIES
  */
  
  // The frame's rolls
  this.rolls = [];
  
  // The player reference
  this.player = player;
  
  /*
    CONSTRUCTOR
  */
  
  // Add 2 rolls
  this.rolls.push(new Roll(this));
  this.rolls.push(new Roll(this));
  
  /*
    METHODS
  */
  
  // The frames' index
  this.index = function() {
    return this.player.frames.indexOf(this);
  }
  
  // Scored a strike?
  this.strike = function() {
    return this.rolls[0].score == 10;
  }
  
  // Scored a spare?
  this.spare = function() {
    return (this.rolls[0].score < 10) && (this.rolls[0].score + this.rolls[1].score == 10);
  }
  
  // Returns the next frame
  this.next_frame = function() {
    if (this.index() < 10) {
      return this.player.frames[this.index() + 1];
    } else {
      return null;
    }
  }
  
  // Returns the frame score
  this.score = function() {
    
    var score = this.rolls[0].score + this.rolls[1].score;
    
    if (this.spare() && this.next_frame()) {
      // FIXME: return proper score taking only the first roll's score into account
      return score + this.next_frame().score();
    }
    
    else if (this.strike() && this.next_frame()) {
      return score + this.next_frame().score();
    }
    
    return score;
    
  }
  
}

// class Roll
var Roll = function(frame) {
  
  /*
    PROPERTIES
  */
  
  // The roll's score
  this.score = null;
  
  // The frame reference
  this.frame = frame;
  
  /*
    METHODS
  */
  
  // The roll's index
  this.index = function() {
    return this.frame.rolls.indexOf(this);
  }
  
}

// class Player
var Player = function(name, game) {
  
  /*
    PROPERTIES
  */
    
  // The player's name
  this.name = name;
  
  // The player's frames
  this.frames = [];
  
  // The game reference
  this.game = game;
  
  /*
    METHODS
  */
  
  // The player's index
  this.index = function() {
    return this.game.players.indexOf(this);
  }
  
}

// class BowlingGame
var BowlingGame = function(selector, player_names) {
  
  /*
    PROPERTIES
  */
  
  // The participating players
  this.players = [];
  
  // The current player
  this.current_player = null;
  
  // The current frame
  this.current_frame = null;
  
  // The current roll
  this.current_roll = null;
  
  // Find all input fields
  this.inputs = null;
  
  /*
    CONSTRUCTOR
  */
  
  // Find score board element
  this.element = document.querySelector(selector);
  
  if (!this.element) {
    throw "Element not found";
  }
  
  // Add participating players
  for (i = 0; i < player_names.length; i++) {
    
    var player = new Player(player_names[i], this)
    
    this.players.push(player);
    
    // Generate 10 frames for each player
    for (j = 0; j < 10; j++) {
      
      // Create frame
      var frame = new Frame(player);
      player.frames.push(frame);
      
    }
    
  }
  
  // Set pointer to the first player
  this.current_player = this.players[0];
  
  this.current_frame = this.current_player.frames[0];
  
  this.current_roll = this.current_frame.rolls[0];
  
  /*
    METHODS
  */
  
  // Sets the score for the current player
  this.score = function(score) {
    
    // Set score
    this.current_roll.score = score;
    
    // Check for a strike
    if (this.current_roll.index() == 0 && score == 10) {
      // Skip second roll
      this.next();
    }
    
    // Go to next roll / player / frame
    this.next();
    
  }
  
  // Turns to the next player.
  // If the last player has played their frame, it turns to the next frame.
  this.next = function() {
    
    var current_roll = this.current_roll.index();
    var current_player = this.current_player.index();
    var current_frame = this.current_frame.index();
    
    // Next roll
    current_roll++;
    
    if (current_roll > 1) {
      
      // Reset roll count
      current_roll = 0;
      
      // Step to the next player
      current_player++;
      
      if (current_player > this.players.length - 1) {
        current_player = 0;
        current_frame = current_frame + 1;
      }
      
    }
    
    this.current_player = this.players[current_player]
    this.current_frame = this.current_player.frames[current_frame]
    this.current_roll = this.current_frame.rolls[current_roll]
    
    // Update the view
    // FIXME: Implement view
    // this.view.render(this);
    
  }
  
}
