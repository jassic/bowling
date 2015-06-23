(function() {
  
  // Stub console if not present
  if (typeof console === "undefined") {
    console = {
        log: function() { },
        warn: function() { },
        error: function() { },
    }
  }
  
  // Player names for test
  var players = ['Marge', 'Homer'];
  
  // Test objects
  var bowling_game;
  var player;
  var frame;
  var roll;
  var bowling_game_view;
  
  var failures = 0;
  var successes = 0;
  var missing = 0;
  
  // Test helper
  var it_should = function(title, test_method) {
    
    bowling_game = new BABBEL.BowlingGameModel(players);
    player = bowling_game.players[0];
    frame = player.frames[0];
    roll = frame.rolls[0];
    
    if (!title) {
      console.warn("Missing: it should " + title);
      missing++;
    } else if (test_method()) {
      console.log("Success: it should " + title);
      successes++;
    } else {
      console.error("Failed: it should " + title);
      failures++;
    }
    
  }
  
  console.log("Testing...");
  
  /*
    BowlingGameModel
  */
  var BowlingGameModelTest = function() {
    
    /*
      new()
    */
    it_should("have loaded 4 players", function() {
      return bowling_game.players.length == 2;
    });

    it_should("start with the first player", function() {
      return bowling_game.current_player.index() == 0;
    });

    it_should("not be finished", function() {
      return bowling_game.finished == false;
    });

    /*
      validate()
    */
    it_should("allow a 0", function() {
      return bowling_game.validate(0) == 0;
    })

    it_should("allow a 4", function() {
      return bowling_game.validate(4) == 4;
    })

    it_should("allow a 10", function() {
      return bowling_game.validate(10) == 10;
    })

    it_should("not allow a non-numerical value", function() {
      return bowling_game.validate("x") == null;
    })

    /*
      next()
    */
    it_should("proceed to the next roll", function() {
      bowling_game.next();
      return bowling_game.current_player.index() == 0 &&
             bowling_game.current_frame.index() == 0 &&
             bowling_game.current_roll.index() == 1;
    });

    it_should("proceed to the next player", function() {
      bowling_game.next();
      bowling_game.next();
      return bowling_game.current_player.index() == 1 &&
             bowling_game.current_frame.index() == 0 &&
             bowling_game.current_roll.index() == 0;
    });

    it_should("proceed to the next frame", function() {
      bowling_game.next();
      bowling_game.next();
      bowling_game.next();
      bowling_game.next();
      return bowling_game.current_player.index() == 0 &&
             bowling_game.current_frame.index() == 1 &&
             bowling_game.current_roll.index() == 0;
    });

    /*
      set_score()
    */

    it_should("proceed to the next roll", function() {
      bowling_game.set_score(5);
      return bowling_game.current_player.index() == 0 &&
             bowling_game.current_frame.index() == 0 &&
             bowling_game.current_roll.index() == 1;
    });

    it_should("proceed to the next player if a strike has been scored", function() {
      bowling_game.set_score(10);
      return bowling_game.current_player.index() == 1 &&
             bowling_game.current_frame.index() == 0 &&
             bowling_game.current_roll.index() == 0;
    });
    
    /*
      winner()
    */
    it_should("return the winner", function() {
      // Mock score
      bowling_game.players[0].score = function() { return 100; }
      bowling_game.players[1].score = function() { return 130; }
      bowling_game.finished = true;
      return bowling_game.winner() == bowling_game.players[1];
    });
    
    /*
      roll()
    */
    it_should("return a value between 0 and 10 in the first roll", function() {
      score = bowling_game.roll();
      return score >= 0 && score <= 10;
    });
    
    it_should("return a value between 0 and 5 in the second roll", function() {
      bowling_game.set_score(5);
      score = bowling_game.roll();
      return score >= 0 && score <= 5;
    });
    
    /*
      run()
    */
    it_should("run a full game and set the status to finished", function() {
      bowling_game.run();
      return bowling_game.finished;
    });
    
    /*
      reset()
    */
    it_should("reset a game", function() {
      bowling_game.reset();
      return !bowling_game.finished;
    });
    
  }();


  /*
    Player
  */
  var PlayerTest = function() {
  
    /*
      index()
    */
    it_should("return the index of the player", function() {
      return player.index() == 0;
    });
  
    /*
      score()
    */
    it_should("return the initial score for the player", function() {
      return player.score() == 0;
    });
    
    it_should("return the score for the player after a score of 5", function() {
      bowling_game.set_score(5);
      return player.score() == 5;
    });
    
    it_should("return the score for the player after a strike", function() {
      bowling_game.set_score(10);
      return player.score() == 10;
    });
    
    it_should("return the score for the player after roll 2", function() {
      bowling_game.set_score(5);
      bowling_game.set_score(1);
      return player.score() == 6;
    });
    
    it_should("return the score for the player after frame 2", function() {
      bowling_game.set_score(5); // Player 1
      bowling_game.set_score(1); // Player 1
      bowling_game.set_score(1); // Player 2
      bowling_game.set_score(2); // Player 2
      bowling_game.set_score(7); // Player 1
      bowling_game.set_score(2); // Player 1
      return player.score() == 15;
    });
    
  }();


  /*
    Frame
  */
  var FrameTest = function() {

    /*
      add_roll()
    */
    it_should("add another roll to the last frame", function() {
      frame.add_roll();
      return frame.rolls.length = 3;
    });
  
    /*
      is_last()
    */
    it_should("return false for the first frame", function() {
      return !player.frames[0].is_last();
    });
    
    it_should("return true for the last frame", function() {
      return player.frames[BABBEL.BowlingGameModel.NUMBER_OF_FRAMES - 1].is_last();
    });
  
    /*
      strike()
    */
    it_should("return false for a regular frame", function() {
      frame.rolls[0].score = 6;
      frame.rolls[1].score = 3;
      return !frame.strike();
    });
    
    it_should("return false for a spare", function() {
      frame.rolls[0].score = 6;
      frame.rolls[1].score = 4;
      return !frame.strike();
    });
    
    it_should("return true for a strike", function() {
      frame.rolls[0].score = 10;
      frame.rolls[1].score = 0;
      return frame.strike();
    });
    
    /*
      spare()
    */
    it_should("return false for a regular frame", function() {
      frame.rolls[0].score = 4;
      frame.rolls[1].score = 3;
      return !frame.spare();
    });
    
    it_should("return false for a strike", function() {
      frame.rolls[0].score = 10;
      frame.rolls[1].score = 0;
      return !frame.spare();
    });
    
    it_should("return true for a spare", function() {
      frame.rolls[0].score = 4;
      frame.rolls[1].score = 6;
      return frame.spare();
    });
    
    /*
      next_frame()
    */
    it_should("return the next frame", function() {
      return frame.next_frame() == frame.player.frames[frame.index() + 1];
    });
    
    it_should("return null if the last frame has been reached", function() {
      frame = player.frames[BABBEL.BowlingGameModel.NUMBER_OF_FRAMES - 1]
      return frame.next_frame() == null;
    });
    
    /*
      score()
    */
    it_should("return 0 if the frame has not been played", function() {
      return frame.score() == 0;
    });
    
    it_should("return 7 if the frame score is 3 and 4", function() {
      frame.rolls[0].score = 3;
      frame.rolls[1].score = 4;
      return frame.score() == 7;
    });
    
    it_should("return 10 if the frame is a strike and the next frame has not been played", function() {
      frame.rolls[0].score = 10;
      frame.rolls[1].score = 0;
      return frame.score() == 10;
    });
    
    it_should("return 10 if the frame is a spare and the next frame has not been played", function() {
      frame.rolls[0].score = 4;
      frame.rolls[1].score = 6;
      return frame.score() == 10;
    });
    
    it_should("return 15 if the frame is a strike and the next frame scored 2 and 3 points", function() {
      frame.rolls[0].score = 10;
      frame.rolls[1].score = 0;
      frame.next_frame().rolls[0].score = 2;
      frame.next_frame().rolls[1].score = 3;
      return frame.score() == 15;
    });
    
    it_should("return 12 if the frame is a spare and the next frame scored 2 and 3 points", function() {
      frame.rolls[0].score = 4;
      frame.rolls[1].score = 6;
      frame.next_frame().rolls[0].score = 2;
      frame.next_frame().rolls[1].score = 3;
      return frame.score() == 12;
    });
    
  }();

  /*
    Roll
  */
  var RollTest = function() {

    it_should("return 0 for the first roll's index", function() {
      return frame.rolls[0].index() == 0;
    });
    
    it_should("return 1 for the second roll's index", function() {
      return frame.rolls[1].index() == 1;
    });
    
  }();
  
  // Finish test
  console.log(successes + " successes, " + failures + " failures, " +  missing + " missing.");
  
})();