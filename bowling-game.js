/*jslint white: true */
/*jslint indent: 2 */
/*jslint plusplus: true */
var BABBEL;
BABBEL = BABBEL || {};

// class BowlingGame
BABBEL.BowlingGame = (function() {

  "use strict";

  // Constructor
  function BowlingGame(player_names, selector) {

    this.model = new BABBEL.BowlingGameModel(player_names);
    this.view = new BABBEL.BowlingGameView(selector, this.model);
    this.controller = new BABBEL.BowlingGameController(this.model, this.view);

  }

  return BowlingGame;

}());
