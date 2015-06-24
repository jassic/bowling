/*jslint white: true */
/*jslint indent: 2 */
/*jslint plusplus: true */
var BABBEL;
BABBEL = BABBEL || {};

// class BowlingGameModel
BABBEL.BowlingGameModel = (function() {

  "use strict";

  // Constructor
  function BowlingGameModel(player_names) {

    // The number of frames
    BowlingGameModel.NUMBER_OF_FRAMES = 10;

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

    this.init(player_names);

  }

  // Initialize
  BowlingGameModel.prototype.init = function(player_names) {

    var i, j, player, frame;

    // Add participating players
    for (i = 0; i < player_names.length; i++) {

      player = new BABBEL.Player(player_names[i], this);

      this.players.push(player);

      // Generate 10 frames for each player
      for (j = 0; j < BowlingGameModel.NUMBER_OF_FRAMES; j++) {

        // Create frame
        frame = new BABBEL.Frame(player);
        player.frames.push(frame);

      }

    }

    // Set pointer to the first player / frame / roll
    this.current_player = this.players[0];
    this.current_frame = this.current_player.frames[0];
    this.current_roll = this.current_frame.rolls[0];

  };

  // Validates a score
  BowlingGameModel.prototype.validate = function(score) {

    var previous_score;

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

      if (this.current_roll.index() !== 0) { // Roll 2

        // The max total score in roll 2 is 10 points
        previous_score = this.current_frame.rolls[0].score;

        if (previous_score + score > 10) {
          score = 10 - previous_score;
        }

      }

    }

    // Last frame
    else {

      if (this.current_roll.index() > 0) {

        // The max total score in roll 2 is 10 points
        previous_score = this.current_frame.rolls[this.current_roll.index() - 1].score;

        if (previous_score < 10 && (previous_score + score > 10)) {
          score = 10 - previous_score;
        }

      }

    }

    return score;

  };

  // Sets the score for the current player
  BowlingGameModel.prototype.set_score = function(score) {

    // Check if the game has been finished
    if (this.finished) {
      return false;
    }

    // Validate
    score = this.validate(score);

    // Set score
    this.current_roll.score = score;

    // Add extra roll if in last frame and a strike / spare has been scored
    if (this.current_frame.is_last() && this.current_frame.rolls.length === 2) {
      if (this.current_frame.strike() || this.current_frame.spare()) {
        this.current_frame.add_roll();
      }
    }

    // Go to next roll / player / frame
    this.next();

  };

  // Turns to the next roll / frame / player
  BowlingGameModel.prototype.next = function() {

    var current_roll, current_player, current_frame;

    current_roll = this.current_roll.index();
    current_player = this.current_player.index();
    current_frame = this.current_frame.index();

    // Check if the game has ended
    if (this.finished) {
      return false;
    }

    // Check if the last frame has been reached
    if (current_frame === BowlingGameModel.NUMBER_OF_FRAMES - 1) {

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

        if (current_roll === 0) {

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

        if (current_roll === 1) {

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
    this.current_player = this.players[current_player];
    this.current_frame = this.current_player.frames[current_frame];
    this.current_roll = this.current_frame.rolls[current_roll];

  };

  // Returns the winner of the game
  BowlingGameModel.prototype.winner = function() {

    var i, winner;

    if (this.finished) {

      winner = this.players[0];

      for (i = 1; i < this.players.length; i++) {
        if (this.players[i].score() > winner.score()) {
          winner = this.players[i];
        }
      }

      return winner;

    }

    return null;

  };

  // Randomly throw a roll
  BowlingGameModel.prototype.roll = function() {

    var min, max;

    min = 0;
    max = 10;

    // Limit the random score to the max available pins
    if (this.current_roll.index() > 0 && !this.current_frame.is_last()) {
      max = 10 - this.current_roll.frame.rolls[0].score;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;

  };

  // Randomly throw a roll
  BowlingGameModel.prototype.run = function() {

    this.reset();

    while (!this.finished) {
      this.set_score(this.roll());
    }

    return this.finished;

  };

  // Resets the game
  BowlingGameModel.prototype.reset = function() {

    var i, j, k, player, frame, roll;

    // Reset all scores
    for (i = 0; i < this.players.length; i++) {
      player = this.players[i];
      for (j = 0; j < player.frames.length; j++) {
        frame = player.frames[j];
        for (k = 0; k < frame.rolls.length; k++) {
          roll = frame.rolls[k];
          roll.score = null;
        }
      }
    }

    // Unfinish
    this.finished = false;
    this.current_player = this.players[0];
    this.current_frame = this.current_player.frames[0];
    this.current_roll = this.current_frame.rolls[0];

  };

  return BowlingGameModel;

}());

// class Player
BABBEL.Player = (function() {

  "use strict";

  // Constructor
  function Player(name, bowling_game) {

    // The player's name
    this.name = name;

    // The player's frames
    this.frames = [];

    // The game reference
    this.bowling_game = bowling_game;

  }

  // The player's index
  Player.prototype.index = function() {
    return this.bowling_game.players.indexOf(this);
  };

  // The player's total score
  Player.prototype.score = function() {

    var score, i;

    score = 0;

    for (i = 0; i < this.frames.length; i++) {
      score += this.frames[i].score();
    }

    return score;

  };

  return Player;

}());

// class Frame
BABBEL.Frame = (function() {

  "use strict";

  // Constructor
  function Frame(player) {

    // The frame's rolls
    this.rolls = [];

    // The player reference
    this.player = player;

    this.init();

  }

  // Initialize
  Frame.prototype.init = function() {

    var i;

    // Add rolls
    for (i = 0; i < 2; i++) {
      this.rolls.push(new BABBEL.Roll(this));
    }

  };

  // Adds an extra roll
  Frame.prototype.add_roll = function() {
    this.rolls.push(new BABBEL.Roll(this));
  };

  // The frames' index
  Frame.prototype.index = function() {
    return this.player.frames.indexOf(this);
  };

  // Returns true if this is the last frame
  Frame.prototype.is_last = function() {
    return this.index() === BABBEL.BowlingGameModel.NUMBER_OF_FRAMES - 1;
  };

  // Scored a strike?
  Frame.prototype.strike = function() {
    return this.rolls[0].score === 10;
  };

  // Scored a spare?
  Frame.prototype.spare = function() {
    return (this.rolls[0].score < 10) && (this.rolls[0].score + this.rolls[1].score === 10);
  };

  // Returns the next frame
  Frame.prototype.next_frame = function() {
    if (this.index() < BABBEL.BowlingGameModel.NUMBER_OF_FRAMES - 1) {
      return this.player.frames[this.index() + 1];
    }
    return null;
  };

  // Returns the frame score
  Frame.prototype.score = function() {

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
      } else if (this.strike()) {

        if (this.next_frame().is_last()) {
          score = score + this.next_frame().rolls[0].score + this.next_frame().rolls[1].score;
        } else {
          score = score + this.next_frame().score();
        }

      }

    }

    // The max possible score is 30
    return Math.min(score, 30);

  };

  return Frame;

}());

// class Roll
BABBEL.Roll = (function() {

  "use strict";

  // Constructor
  function Roll(frame) {

    // The roll's score
    this.score = null;

    // The frame reference
    this.frame = frame;

  }

  // The roll's index
  Roll.prototype.index = function() {
    return this.frame.rolls.indexOf(this);
  };

  return Roll;

}());
