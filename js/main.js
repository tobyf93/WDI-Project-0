var app = app || {};
app.enableAI = true;

app.initialize = function() {
	app.PLAYER = 'X';
	app.PLAYER2 = 'O';
	app.COMPUTER = 'O';
	app.gameOver = false;

	app.board = [];
	app.currentTurn = 'X';
	app.moves = {
		X: 0,
		O: 0
	};


	$('#message').html('Tic Tac Toe');
	$('.cell').html('');
	app.registerEvents();
	app.createBoardArray();
	$('#restart').removeClass('enabled');
	$('.cell').removeClass('wiggle');
};


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
app.complete.cache = [];  //Needs to be implemented a better way.

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

/////////////////////
// ATTENTION
/////////////////////
app.complete.diag = function(board, coordStr, player) {
	var diag1 = ['00', '11', '22'];
	var diag2 = ['02', '11', '20'];
	var testBoth = false;
	this.cache = [];

	var testDiag = function(diag) {
		var firstEl = diag[0];
		
		for (var i = 0; i < diag.length; i++) {
			var thisEl = diag[i];
			var val = board[thisEl[0]][thisEl[1]];

			if (val !== player) {
				return false;
			}
		}

		return true;
	};

	// If coordStr references the center cell both diagonals will need to be tested
	if (coordStr[0] === '1' && coordStr[1] === '1') {
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
app.checkGameState = function(board, player, lastMove) {
	// Win = 10
	// Draw = 0
	// Undefined = -1
	// Loss = -10
	this.complete.cache = [];

	// Tie
	if (this.moves.X + this.moves.O === 9) {
		return 0;
	}

	if (this.complete.row(board[lastMove.row], player)) {
		this.complete.cache = $('.row[data-row="' + lastMove.row + '"]').children();
		return 10;
	}

	// Create an array of elements in column
	var col = [
		board[0][lastMove.col],
		board[1][lastMove.col],
		board[2][lastMove.col]
	];

	if (this.complete.col(col, player)) {
		this.complete.cache = $('.cell[data-col="' + lastMove.col + '"]');
		return 10;
	}

	// If the sum of row and col is even it is on a diagonal path
	var coordSum = parseInt(lastMove.row) + parseInt(lastMove.col);

	var coordStr = lastMove.row + lastMove.col;
	if (coordSum % 2 === 0 && this.complete.diag(board, coordStr, player)) {
		return 10;
	}

	return -1;
};

app.switchMove = function(move) {
	move = move || this.currentTurn;
	move = (move === 'X') ? 'O' : 'X';

	return move;
};

app.setMessage = function(msg) {
	$('#message').html(msg);
};

app.endGame = function() {
	this.gameOver = true;
	$('#board').off('click', '.cell', this.makeMove);
	$('#restart').addClass('enabled');
	$(this.complete.cache).addClass('wiggle');
};

app.makeMove = function() {
	var $this = $(this);
	var row = $this.parent().attr('data-row');
	var col = $this.attr('data-col');

	// Don't allow moves to be overwritten
	if (app.board[row][col] !== '') {
		return;
	}

	// Update View + Model
	$(this).html(app.currentTurn);

	// Update Board (model)
	app.board[row][col] = app.currentTurn;
	
	// Increment player moves
	app.moves[app.currentTurn]++;

	var gameState = app.checkGameState(app.board, app.currentTurn, {row: row, col: col});
	switch (gameState) {
		case 0:
			app.setMessage("Cat's Game");
			app.endGame();
			return;
		case 10:
			app.setMessage('Player ' + app.currentTurn + ' wins');
			app.endGame();
			return;
	}

	// If 1 player game and player has made move, call the computer to make
	// its move.
	if (app.enableAI && app.currentTurn === app.PLAYER) {
		setTimeout(AI.makeMove, 0);
	} 
	// Otherwise pass currentTurn over to other player
	else {
		app.currentTurn = app.switchMove();
	}
};

// Begin
$(document).ready(function() {
	// Connect restart button
	$('#game').on('click', '#restart.enabled', app.initialize);

	$('#toggle').on('click', function() {
		app.enableAI = (app.enableAI) ? false : true;
		app.initialize();
	});

	app.initialize();
	// app.testCase1();
	// app.testCase2();
});







// Test checkGameState
app.testCase1 = function() {
	var cases = [

		'[["O","O","X"],["X","X",""],["X","O","O"]]',

	];

	cases.forEach(function(jsonStr) {
		var board = JSON.parse(jsonStr);
		var player = 'X';

		console.log(board[0]);
		console.log(board[1]);
		console.log(board[2]);
		console.log('Result for ' + player + ': ' + app.checkGameState(board, player, {row: "1", col: "1"}));
		console.log('');
	});
};

// Test AI.makeMove
app.testCase2 = function() {
	app.currentTurn = 'X';

	// Successful
	app.board = [
		['O', '', 'X'],
		['X', '', ''],
		['X', 'O', 'O']
	];

	// Successful
	app.board = [
		['O', 'X', ''],
		['X', '', ''],
		['X', 'O', 'O']
	];

	app.board = [
		['O', 'X', ''],
		['X', '', ''],
		['X', 'O', '']
	];

	AI.makeMove();
};









