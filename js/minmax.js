AI = {};

// app.checkGameState


// need to modify checkGameState to check an entire board

/*
def minimax(game)
    return score(game) if game.over?
    scores = [] # an array of scores
    moves = []  # an array of moves

    # Populate the scores array, recursing as needed
    game.get_available_moves.each do |move|
        possible_game = game.get_new_state(move)
        scores.push minimax(possible_game)
        moves.push move
    end

    # Do the min or the max calculation
    if game.active_turn == @player
        # This is the max calculation
        max_score_index = scores.each_with_index.max[1]
        @choice = moves[max_score_index]
        return scores[max_score_index]
    else
        # This is the min calculation
        min_score_index = scores.each_with_index.min[1]
        @choice = moves[min_score_index]
        return scores[min_score_index]
    end
end
*/

AI.minmax = function(board) {
	if (app.checkGameState(board) === 0) {
		return 0;
	}

	var scores = [];
	var boards = [];

	var availableMoves = this.getAvailableMoves();
	availableMoves.each(function() {
		var possibleBoard = app.board;
		
	});
};

AI.getAvailableMoves = function() {
	return $('.cell:empty');
};

AI.makeMove = function() {
	var $emptyCells = this.getAvailableMoves();
	var emptyCells = $emptyCells.length;

	// Play dumb
	var i = Math.random() * (emptyCells - 1);
	i = Math.round(i);

	// Tricky use of app.makeMove but essentially what it does is that it takes
	// the empty element that was selected at random and ensure 'this' references
	// the new element.  Without binding app.makeMove will think 'this' refers
	// to the app object.
	app.makeMove.bind( $emptyCells[i] )();
};

