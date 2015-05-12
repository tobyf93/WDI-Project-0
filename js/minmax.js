AI = {};

// app.checkGameState


// need to modify checkGameState to check an entire board

AI.minmax = function(board) {
	if (app.checkGameState(board) === 0) {
		return 0;
	}		
};


AI.makeMove = function() {
	var $emptyCells = $('.cell:empty');
	var emptyCells = $emptyCells.length;

	var i = Math.random() * (emptyCells - 1);
	i = Math.round(i);


	// Tricky use of app.makeMove but essentially what it does is that it takes
	// the empty element that was selected at random and ensure 'this' references
	// the new element.  Without binding app.makeMove will think 'this' refers
	// to the app object.
	app.makeMove.bind( $emptyCells[i] )();
};

