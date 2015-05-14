var app = app || {};

//////////////////////////////
// Object Variables
//////////////////////////////
app.PLAYER = 'X';
app.PLAYER2 = 'O';
app.COMPUTER = 'O';

app.board = [];
app.currentTurn = 'X';
app.moves = {
	X: 0,
	O: 0
};
app.enableAI = false;



//////////////////////////////
// Object Methods
//////////////////////////////


app.registerEvents = function() {
	$('#board').on('click', '.cell', this.makeMove);
};

// Create a blank 2D array for moves.
app.createBoardArray = function() {
	$('.row').each(function() {
		var row = [];

		$('.cell', this).each(function() {
			row.push('');
		});

		app.board.push(row);
	});
};

app.complete = {};

// Caches elements involved with last checked win condition.  E.g. if row 0
// was checked, array would store ['0 0', '0 1', '0 2'].  Cache can be used
// to highlight a win condition.
app.complete.cache = [];

// Returns true if row is complete
app.complete.row = function(row, player) {
	for (var i = 0; i < row.length; i++) {
		if (row[i] !== player) {
			return false;
		}
	}

	return true;
};

// Returns true if col is complete
app.complete.col = function(col, player) {
	for (var i = 0; i < col.length; i++) {
		if (col[i] !== player) {
			return false;
		}
	}

	return true;
};

// Returns true if diagonal is complete.  The reason for passing a coordStr
// rather than an array of coords is due to the use of indexOf - you can't pass
// an array into indexOf and expect to get anything useful back.
app.complete.diag = function(board, coordStr, player) {
	var diag1 = ['00', '11', '22'];
	var diag2 = ['02', '11', '20'];
	var testBoth = false;

	var testDiag = function(diag) {
		var firstEl = diag[0];

		for (var i = 1; i < diag.length; i++) {
			var thisEl = diag[i];
			var val = board[thisEl[0]][thisEl[1]];

			if (val !== player) {
				return false;
			}
		}

		return true;
	};

	// If coordStr references the center cell both diagonals will need to be tested
	if (coordStr[0] === 1 && coordStr[1] === 1) {
		if (testDiag(diag1) || testDiag(diag2)) {
			return true;
		}
	}

	// Check whatever diagonal path coordStr belongs to
	if (diag1.indexOf(coordStr) >= 0) {
		return testDiag(diag1);
	}
	if (diag2.indexOf(coordStr) >= 0) { 
		return testDiag(diag2);
	}
};


// Checks game board for a win/draw/loss situation.  lastMove is passed into
// the function to ensure the check is made with max efficiency.
app._checkGameState = function(board, player, lastMove) {
	// Tie
	if (this.moves.X + this.moves.O === 9) {
		return 0;
	}


	if (this.complete.row(board[lastMove.row], player)) {
		return 10;
	}

	// Create an array of elements in column
	var col = [
		board[0][lastMove.col],
		board[1][lastMove.col],
		board[2][lastMove.col]
	];

	if (this.complete.col(col, player)) {
		return 10;
	}

	// If the sum of row and col is even it is on a diagonal path
	var coordSum = lastMove.row + lastMove.col;

	var coordStr = lastMove.row + lastMove.col;
	if (coordSum % 2 === 0 && this.complete.diag(board, coordStr, player)) {
		return 10;
	}

	// Indicates that there is no result thus far
	return -1;
};

app.checkGameState = function(board, player, lastMove) {
	// If no lastMove is passed we cannot optimize the check.  We have to check
	// the entire board.
	if (lastMove === undefined) {
		var result = -1;
		['00', '11', '22'].forEach(function(coordStr) {
			var row = coordStr[0];
			var col = coordStr[1];
			var thisResult = app._checkGameState(board, player, {row: row, col: col});
			if (thisResult > result) {
				result = thisResult;
			}
		});

		return result;
	}

	return this._checkGameState(board, player, lastMove);
};

app.switchMove = function(move) {
	move = move || this.currentTurn;
	move = (move === 'X') ? 'O' : 'X';

	return move;
};

app.makeMove = function() {
	var $this = $(this);
	var row = $this.parent().attr('data-row');
	var col = $this.attr('data-col');

	// Don't allow moves to be overwritten
	if (app.board[row][col] !== '') {
		return;
	}

	// Update View
	$(this).html(app.currentTurn);

	// Update Board (model)
	app.board[row][col] = app.currentTurn;
	
	// Increment player moves
	app.moves[app.currentTurn]++;

	var gameState = app.checkGameState(app.board, {row: row, col: col});
	switch (gameState) {
		case 0:
			alert('Draw');
			return;
		case 1:
			alert('Player ' + app.currentTurn + ' wins');
			return;
	}

	// If 1 player game and player has made move, call the computer to make
	// its move.
	if (app.enableAI && app.currentTurn === app.PLAYER) {
		app.currentTurn = app.switchMove();
		setTimeout(AI.makeMove, 0);
	} 
	// Otherwise pass currentTurn over to other player
	else {
		app.currentTurn = app.switchMove();
	}
};





app.testCases = function() {
	var cases = [

		'[["X","O","X"],["O","X","O"],["X","O","X"]]',
		'[["X","O","X"],["X","O","X"],["X","O","O"]]',
		'[["X","X","O"],["O","O","X"],["X","X","O"]]',
		'[["X","",""],["","X",""],["","","O"]]'

	];

	cases.forEach(function(jsonStr) {
		var board = JSON.parse(jsonStr);
		var player = 'O';

		console.log(board[0]);
		console.log(board[1]);
		console.log(board[2]);
		console.log('Result for ' + player + ': ' + app.checkGameState(board, player));
		console.log('');
	});

};



// Begin
$(document).ready(function() {
	app.registerEvents();
	app.createBoardArray();

	app.testCases();
});