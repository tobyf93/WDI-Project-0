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

	// console.log( $emptyCells[i] );
	console.log(i);
	app.makeMove.bind($emptyCells[i].get());
};

