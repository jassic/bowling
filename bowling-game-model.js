// class BowlingGameModel
var BowlingGameModel = function(player_names) {
  
  // The number of frames
  BowlingGameModel.NUMBER_OF_FRAMES = 10;
  
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
  
  // Has the game been finished?
  this.finished = false;
  
  /*
    CONSTRUCTOR
  */
  
  // Add participating players
  for (var i = 0; i < player_names.length; i++) {
    
    var player = new Player(player_names[i], this)
    
    this.players.push(player);
    
    // Generate 10 frames for each player
    for (var j = 0; j < BowlingGameModel.NUMBER_OF_FRAMES; j++) {
      
      // Create frame
      var frame = new Frame(player);
      player.frames.push(frame);
      
    }
    
  }
  
  // Set pointer to the first player / frame / roll
  this.current_player = this.players[0];
  this.current_frame = this.current_player.frames[0];
  this.current_roll = this.current_frame.rolls[0];
  
  /*
    METHODS
  */
  
  // Validates a score
  this.validate = function(score) {
    
    // Do not allow non-numerical values
    if (isNaN(score)) {
      score = null;
    }
    
    // Max score is 10
    if (score > 10) {
      score = 10;
    }
    
    // Frame 1 - 9
    if (!this.current_frame.is_last()) {
      
      if (this.current_roll.index() == 0) { // Roll 1
        
        // Nothing to validate
        
      } else { // Roll 2
        
        // The max total score in roll 2 is 10 points
        var previous_score = this.current_frame.rolls[0].score;
        if (previous_score + score > 10) {
          score = 10 - previous_score;
        }
        
      }
      
    }
    
    // Last frame
    else {
      
      if (this.current_roll.index() > 0) {
        
        // The max total score in roll 2 is 10 points
        var previous_score = this.current_frame.rolls[this.current_roll.index() - 1].score;
        
        if (previous_score < 10 && (previous_score + score > 10)) {
          score = 10 - previous_score;
        }
        
      }
      
    }
    
    return score;
    
  }
  
  // Sets the score for the current player
  this.set_score = function(score) {
    
    // Check if the game has been finished
    if (this.finished) {
      return false;
    }
    
    // Validate
    score = this.validate(score);
    
    // Set score
    this.current_roll.score = score;
    
    // Add extra roll if in last frame and a strike / spare has been scored
    if (this.current_frame.is_last() && this.current_frame.rolls.length == 2) {
      if (this.current_frame.strike() || this.current_frame.spare()) {
        this.current_frame.add_roll();
      }
    }
    
    // Go to next roll / player / frame
    this.next();
    
  }
  
  // Turns to the next roll / frame / player
  this.next = function() {
    
    var current_roll = this.current_roll.index();
    var current_player = this.current_player.index();
    var current_frame = this.current_frame.index();
    
    // Check if the game has ended
    if (this.finished) {
      return false;
    }
    
    // Check if the last frame has been reached
    if (current_frame == BowlingGameModel.NUMBER_OF_FRAMES - 1) {
      
      // Check for a strike or a spare
      if (this.current_frame.strike() || this.current_frame.spare()) {
        
        if (current_roll < 2) {
          
          current_roll++;
          
        } else {
          
          if (current_player < this.players.length - 1) {
            
            current_roll = 0;
            current_player++;
            
          } else {
            
            this.finished = true;
            
          }
          
        }
        
      } else {
        
        if (current_roll == 0) {
          
          current_roll++;
          
        } else {
          
          if (current_player < this.players.length - 1) {
            
            current_roll = 0;
            current_player++;
            
          } else {
            
            this.finished = true;
            
          }
          
        }
        
      }
      
    // Step to the next frame or roll
    } else {
      
      // Step directly to the next player in case of a strike
      if (this.current_frame.strike()) {
        
        current_player++;
        
        // Step to the next frame / first player if the end of the round has been reached
        if (current_player > this.players.length - 1) {
          current_player = 0;
          current_frame++;
        }
        
      } else {
        
        if (current_roll == 1) {
          
          // Reset roll count
          current_roll = 0;
          
          // Step to the next player
          current_player++;
          
          // Step to the next frame / first player if the end of the round has been reached
          if (current_player > this.players.length - 1) {
            current_player = 0;
            current_frame++;
          }
          
        } else {
          
          // Step to the second roll
          current_roll = 1;
          
        }
        
      }
      
    }
    
    // Update pointers
    this.current_player = this.players[current_player]
    this.current_frame = this.current_player.frames[current_frame]
    this.current_roll = this.current_frame.rolls[current_roll]
    
  }
  
  // Returns the winner of the game
  this.winner = function() {
    
    if (this.finished) {
      
      var winner = this.players[0];
      
      for (var i = 1; i < this.players.length; i++) {
        if (this.players[i].score() > winner.score()) {
          winner = this.players[i];
        }
      }
      
      return winner;
      
    } else {
      
      return null;
      
    }
  }
  
  // Randomly throw a roll
  this.roll = function() {
    
    var min = 0;
    var max = 10;
    
    // Limit the random score to the max available pins
    if (this.current_roll.index() > 0 && !this.current_frame.is_last()) {
      var max = 10 - this.current_roll.frame.rolls[0].score;
    }
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
    
  }
  
  // Randomly throw a roll
  this.run = function() {
    
    this.reset();
    
    while(!this.finished) {
      this.set_score(this.roll());
    }
    
    return this.finished;
    
  }
  
  // Resets the game
  this.reset = function() {
    
    // Reset all scores
    for (var i = 0; i < this.players.length; i++) {
      var player = this.players[i];
      for (var j = 0; j < player.frames.length; j++) {
        var frame = player.frames[j];
        for (var k = 0; k < frame.rolls.length; k++) {
          var roll = frame.rolls[k];
          roll.score = null;
        }
      }
    }
    
    // Unfinish
    this.finished = false;
    this.current_player = this.players[0];
    this.current_frame = this.current_player.frames[0];
    this.current_roll = this.current_frame.rolls[0];
    
  }
  
}

// class Player
var Player = function(name, bowling_game) {
  
  /*
    PROPERTIES
  */
    
  // The player's name
  this.name = name;
  
  // The player's frames
  this.frames = [];
  
  // The game reference
  this.bowling_game = bowling_game;
  
  /*
    METHODS
  */
  
  // The player's index
  this.index = function() {
    return this.bowling_game.players.indexOf(this);
  }
  
  // The player's total score
  this.score = function() {
    var score = 0;
    for (var i = 0; i < this.frames.length; i++) {
      score += this.frames[i].score();
    }
    return score;
  }
  
}

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
  
  // Add rolls
  for (var i = 0; i < 2; i++) {
    this.rolls.push(new Roll(this));
  }
  
  /*
    METHODS
  */
  
  // Adds an extra roll
  this.add_roll = function() {
    this.rolls.push(new Roll(this));
  }
  
  // The frames' index
  this.index = function() {
    return this.player.frames.indexOf(this);
  }
  
  // Returns true if this is the last frame
  this.is_last = function() {
    return this.index() == BowlingGameModel.NUMBER_OF_FRAMES - 1;
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
    if (this.index() < BowlingGameModel.NUMBER_OF_FRAMES - 1) {
      return this.player.frames[this.index() + 1];
    } else {
      return null;
    }
  }
  
  // Returns the frame score
  this.score = function() {
    
    var score = this.rolls[0].score + this.rolls[1].score;
    
    // Last frame
    if (this.is_last()) {
      
      if (this.rolls[2]) {
        score += this.rolls[2].score;
      }
      
    }
    
    // Regular frame
    else {
      
      if (this.spare()) {
        score = score + this.next_frame().rolls[0].score;
      }
      
      else if (this.strike()) {
        
        if (this.next_frame().is_last()) {
          score = score + this.next_frame().rolls[0].score + this.next_frame().rolls[1].score;
        } else {
          score = score + this.next_frame().score();
        }
        
      }
      
    }
    
    // The max possible score is 30
    return Math.min(score, 30);
    
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
