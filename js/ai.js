AI = {};

AI.optimalMove = undefined;

//temp
AI.scores = undefined;
AI.moves = undefined;


AI.checkGameState = function(board, player) {
	var oppositePlayer = app.switchMove(player);

	var result = -1;
	['00', '11', '22'].forEach(function(coordStr) {
		var row = coordStr[0];
		var col = coordStr[1];
		var lastMove = {row: row, col: col};
		var playerResult = app.checkGameState(board, player, lastMove);
		var opponentResult = app.checkGameState(board, oppositePlayer, lastMove);

		if (opponentResult === 10) {
			result = -10;
		} else if (result !== -10 && playerResult > result) {
			result = playerResult;
		}
	});

	return result;
};

AI.minmax = function(board, theoreticalTurn) {
	var scores = [];
	var moves = [];

	// When the computer looks ahead it must use theoretical turns.  We only want
	// app.currentTurn to change once the computer has analysed its possibilities
	// and picked the best move possible.
	theoreticalTurn = theoreticalTurn || app.currentTurn;

	// console.log(JSON.stringify(board));
	// debugger;

	var currentGameState = AI.checkGameState(board, app.switchMove(app.currentTurn)); //hack
	if (currentGameState !== -1) {
		return currentGameState;
	}

	// If moves still available recurse
	var availableMoves = this.getAvailableMoves(board);
	for (var i = 0; i < availableMoves.length; i++) {
		var coord = availableMoves[i];
		var row = coord[0];
		var col = coord[1];
		var possibleBoard = $.extend(true, [], board);

		var oppositeTurn = app.switchMove(theoreticalTurn);
		possibleBoard[row][col] = oppositeTurn;
		scores.push(AI.minmax(possibleBoard, oppositeTurn));
		moves.push(coord);
	}








	var returnVal;
	// var gs = app.checkGameState(board);
	// debugger;
	// If node has no children return the gamestate for the board.
	if (!availableMoves.length) {
		var gs = AI.checkGameState(board, app.currentTurn);
		returnVal = gs;
	}
	// Otherwise analyse the scores that the nodes children pushed up to them
	// and select the best score to pass on.  AI.optimalMove is also set so we can
	// use it within AI.makeMove.
	else {

		if (theoreticalTurn === app.PLAYER) {
			var max = Math.max.apply(null, scores);
			var maxIDX = scores.indexOf(max);
			this.optimalMove = moves[maxIDX];
			this.scores = scores;
			this.moves = moves;
			returnVal = scores[maxIDX];
		}
		else {
			var min = Math.min.apply(null, scores);
			var minIDX = scores.indexOf(min);
			this.optimalMove = moves[minIDX];
			this.scores = scores;
			this.moves = moves;
			returnVal = scores[minIDX];
		}
	}

	return returnVal;
};



// Returning from function
	//
	// Note: moves array should work the same way
	//
	// For the bottom nodes (ones without children) we want to return the gameState
	// for its caller.  This will ensure each parent receives a scores array as a
	// result of all it's children pushing their states.
	//
	// All other nodes in the middle of the tree we want them to compile their scores
	// array before analysing what they push up to their parent depending on what
	// the theoretical move is.
	//
	// For the root node we want it to analyse scores but instead of pushing up a
	// score we want to return a move.  This is so that we can use AI.minmax like..
	// var move = AI.minmax(app.board);

AI.getAvailableMoves = function(board) {
	var result = [];

	for (var row = 0; row < 3; row++) {
		for (var col = 0; col < 3; col++) {
			if (board[row][col] === '') {
				result.push(row+''+col);
			}
		}
	}

	return result;
};

AI.makeMove = function() {
	// var $moves = $('.cell:empty');
	// var availableMoves = $moves.length;
	// var idx = Math.random() * (availableMoves - 1);
	// idx = Math.round(idx);

	AI.minmax(app.board);
	console.log(AI.scores);
	console.log(AI.moves);
	console.log(AI.optimalMove);
	console.log('');
	var row = AI.optimalMove[0];
	var col = AI.optimalMove[1];

	var $row = $('.row[data-row="' + row + '"]');
	var $cell = $row.children('.cell[data-col="' + col + '"]');
	// console.log(cell);

	app.currentTurn = app.switchMove();
	app.makeMove.bind($cell[0])();
};

