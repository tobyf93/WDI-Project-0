var app = app || {};

//////////////////////////////
// Object Variables
//////////////////////////////
app.PLAYER = 'X';
app.PLAYER2 = 'O';
app.COMPUTER = 'O';

app.board = [];
app.currentMove = 'X';
app.moves = {
	X: 0,
	O: 0
};
app.enableAI = true;



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
app.complete.row = function(row) {
	for (var i = 0; i < row.length; i++) {
		if (row[i] !== row[0])
			return false;
	}

	return true;
};

// Returns true if col is complete
app.complete.col = function(col) {
	for (var i = 0; i < col.length; i++) {
		if (col[i] !== col[0])
			return false;
	}

	return true;
};

// Returns true if diagonal is complete.  The reason for passing a coordStr
// rather than an array of coords is due to the use of indexOf - you can't pass
// an array into indexOf and expect to get anything useful back.
app.complete.diag = function(board, coordStr) {
	var diag1 = ['00', '11', '22'];
	var diag2 = ['02', '11', '20'];
	var testBoth = false;

	var testDiag = function(diag) {
		var firstEl = diag[0];
		var compareVal = board[firstEl[0]][firstEl[1]];

		for (var i = 1; i < diag.length; i++) {
			var thisEl = diag[i];
			var val = board[thisEl[0]][thisEl[1]];

			if (val !== compareVal) {
				return false;
			}
		}

		return true;
	};

	// If coordStr references the center cell both diagonals will need to be tested
	if (coordStr[0] === 1 && coordStr[1] === 1) {
		if (testDiag(diag1))return true;
		if (testDiag(diag2))return true;
	}

	// Check whatever diagonal path coordStr belongs to
	if (diag1.indexOf(coordStr) >= 0)return testDiag(diag1);
	if (diag2.indexOf(coordStr) >= 0)return testDiag(diag2);
};


// Checks game board for a win/draw/loss situation.  lastMove is passed into
// the function to ensure the check is made with max efficiency.
app.checkGameState = function(board, lastMove) {
	if (this.moves[this.currentMove] < 3) {
		return;
	}

	if (this.complete.row(board[lastMove.row])) {
		console.log('winner by row');
		return 1;
	}

	// Create an array of elements in column
	var col = [
		board[0][lastMove.col],
		board[1][lastMove.col],
		board[2][lastMove.col]
	];

	if (this.complete.col(col)) {
		console.log('winner by col');
		return 1;
	}

	// If the sum of row and col is even it is on a diagonal path
	var coordSum = lastMove.row + lastMove.col;

	var coordStr = lastMove.row + lastMove.col;
	if (coordSum % 2 === 0 && this.complete.diag(board, coordStr)) {
		console.log('winner by diag');
		return 1;
	}

	// Tie
	if (this.moves.X + this.moves.Y === 9) {
		return 0;
	}

	// Indicates that there is no result thus far
	return undefined;
};

app.makeMove = function() {
	$this = $(this);
	var row = $this.parent().attr('data-row');
	var col = $this.attr('data-col');

	// Don't allow moves to be overwritten
	if (app.board[row][col] !== '') {
		return;
	}

	// Update View
	$(this).html(app.currentMove);

	// Update Board (model)
	app.updateBoard(row, col, app.currentMove);
	
	// Increment player moves
	app.moves[app.currentMove]++;

	app.checkGameState(app.board, {row: row, col: col});

	// If 1 player game and player has made move, call the computer to make
	// its move.
	if (app.enableAI && app.currentMove === app.PLAYER) {
		app.currentMove = (app.currentMove === 'X') ? 'O' : 'X';
		AI.makeMove();
	} 
	// Otherwise pass currentMove over to other player
	else {
		app.currentMove = (app.currentMove === 'X') ? 'O' : 'X';
	}
};

app.updateBoard = function(row, col, move) {
	this.board[row][col] = move;
};


// Begin
$(document).ready(function() {
	app.registerEvents();
	app.createBoardArray();
});