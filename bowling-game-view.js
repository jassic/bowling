/*jslint white: true */
/*jslint indent: 2 */
/*jslint plusplus: true */
/*jslint browser:true */
var BABBEL;
BABBEL = BABBEL || {};

// class BowlingGameView
BABBEL.BowlingGameView = (function() {

  "use strict";

  // Constructor
  function BowlingGameView(selector, bowling_game) {

    // A reference to the model
    this.bowling_game = bowling_game;

    // The score board element
    this.element = document.querySelector(selector);

    // The demo button
    this.demo = this.element.querySelector('#demo');

    // The view representation of each player
    this.players = [];

    // The input field for entering scores
    this.input = this.element.querySelector('#enter_score');

    this.init();

  }

  // Initialize
  BowlingGameView.prototype.init = function() {

    if (!this.element) {
      throw "Element not found";
    }

    // Use the existing HTML code as a template for 10 frames
    var player_template, frame_template, roll_template, p, player, frames_container, i, frame, spacer;

    player_template = this.element.querySelector(".player");
    frame_template = this.element.querySelector(".frame");
    roll_template = this.element.querySelector(".roll");

    // Generate score board HTML
    for (p = 0; p < this.bowling_game.players.length; p++) {

      // Use the generated HTML code as a template for each player
      player = player_template.cloneNode();

      // The view representation of each frame
      player.frames = [];

      // Add view representation of players
      this.players.push(player);

      // Insert and append player name
      player.innerHTML = this.bowling_game.players[p].name;
      this.element.appendChild(player);

      // Append frames
      frames_container = this.element.querySelector('.frames').cloneNode();
      this.element.appendChild(frames_container);

      // Generate 10 frames for each player
      for (i = 0; i < BABBEL.BowlingGameModel.NUMBER_OF_FRAMES; i++) {

        // Create frame
        frame = frame_template.cloneNode(true);

        // Add second roll
        frame.querySelector('.rolls').appendChild(roll_template.cloneNode());

        // Add additional third roll for the last frame
        if (i === BABBEL.BowlingGameModel.NUMBER_OF_FRAMES - 1) {
          frame.querySelector('.rolls').appendChild(roll_template.cloneNode());
        }

        frames_container.appendChild(frame);

        // Add frame representation
        player.frames.push(frame);

        // The view representation of the frame's total score
        frame.score = frame.querySelector('.score');

        // The view representation of each roll
        frame.rolls = frame.querySelectorAll('.roll');

        // Add a spacer for even spacing between the frames
        spacer = document.createTextNode(" ");
        frames_container.appendChild(spacer);

      }

    }

    // Remove templates from DOM
    this.element.removeChild(frame_template.parentNode);
    this.element.removeChild(player_template);

  };

  // Renders the view
  BowlingGameView.prototype.render = function() {

    var i, j, k, player, frame;

    // Update scores
    for (i = 0; i < this.bowling_game.players.length; i++) {

      player = this.bowling_game.players[i];

      for (j = 0; j < player.frames.length; j++) {

        frame = player.frames[j];

        // Regular round
        if (j < BABBEL.BowlingGameModel.NUMBER_OF_FRAMES - 1) {

          if (frame.strike()) {
            this.players[i].frames[j].rolls[0].innerHTML = "X";
            this.players[i].frames[j].rolls[1].innerHTML = "";
          } else if (frame.spare()) {
            this.players[i].frames[j].rolls[0].innerHTML = frame.rolls[0].score;
            this.players[i].frames[j].rolls[1].innerHTML = "/";
          } else {
            if (frame.rolls[0].score === 0) {
              this.players[i].frames[j].rolls[0].innerHTML = "-";
            } else {
              this.players[i].frames[j].rolls[0].innerHTML = frame.rolls[0].score;
            }
            if (frame.rolls[1].score === 0) {
              this.players[i].frames[j].rolls[1].innerHTML = "-";
            } else {
              this.players[i].frames[j].rolls[1].innerHTML = frame.rolls[1].score;
            }
          }

        }

        // Last round
        else {

          // Roll 1

          // Strike
          if (frame.rolls[0].score === 10) {
            this.players[i].frames[j].rolls[0].innerHTML = "X";
          }

          // Other
          else {
            if (frame.rolls[0].score === 0) {
              this.players[i].frames[j].rolls[0].innerHTML = "-";
            } else {
              this.players[i].frames[j].rolls[0].innerHTML = frame.rolls[0].score;
            }
          }

          // Roll 2

          // Strike
          if (frame.rolls[0].score === 10 && frame.rolls[1].score === 10) {
            this.players[i].frames[j].rolls[1].innerHTML = "X";
          }

          // Spare
          else if (frame.rolls[1].score && (frame.rolls[0].score + frame.rolls[1].score === 10)) {
            this.players[i].frames[j].rolls[1].innerHTML = "/";
          }

          // Other
          else {
            if (frame.rolls[1].score === 0) {
              this.players[i].frames[j].rolls[1].innerHTML = "-";
            } else {
              this.players[i].frames[j].rolls[1].innerHTML = frame.rolls[1].score;
            }
          }

          // Roll 3
          if (frame.rolls[2]) {

            // Strike
            if (frame.rolls[2].score === 10) {
              this.players[i].frames[j].rolls[2].innerHTML = "X";
            }

            // Other
            else {
              if (frame.rolls[2].score === 0) {
                this.players[i].frames[j].rolls[2].innerHTML = "-";
              } else {
                this.players[i].frames[j].rolls[2].innerHTML = frame.rolls[2].score;
              }
            }

          }

        }

        // Set total frame score
        if (frame.score()) {
          this.players[i].frames[j].score.innerHTML = frame.score();
        } else {
          this.players[i].frames[j].score.innerHTML = "&nbsp;";
        }

        // Highlight frame
        if (this.bowling_game.current_player.index() === i && this.bowling_game.current_frame.index() === j) {
          this.players[i].frames[j].classList.add("current");
        } else {
          this.players[i].frames[j].classList.remove("current");
        }

      }

      // Remove winner highlight class
      for (k = 0; k < this.players.length; k++) {
        this.players[k].classList.remove('winner');
      }

      // Highlight winner
      if (this.bowling_game.finished) {
        this.players[this.bowling_game.winner().index()].classList.add('winner');
      }

      // Update total score
      this.players[i].innerHTML = this.bowling_game.players[i].name + " (" + this.bowling_game.players[i].score() + ")";

    }

  };

  // Event handler for changes to the score input field
  BowlingGameView.prototype.score_entered = function(e) {

    // Parse input value
    var score;

    score = parseInt(e.target.value, 10);

    // Allow integers only
    if (score < 0) {

      // Reset value
      e.target.value = '';
      return false;

    }

    // Check for Enter key
    if (e.keyCode === 13) {

      e.target.value = '';

      // Save the score to the model
      this.bowling_game.set_score(score);

    }

    e.stopPropagation();

  };

  return BowlingGameView;

}());
