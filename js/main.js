var app = app || {};

//////////////////////////////
// Object Variables
//////////////////////////////
app.board = [];
app.currentMove = 'X';
app.moves = {
	X: 0,
	O: 0
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


// Checks game board for a win/draw/loss situation.  lastMove is passed into
// the function to ensure the check is made with max efficiency.
app.checkGameState = function(board, lastMove) {
	if (this.moves[this.currentMove] < 3) {
		return;
	}

	if (this.complete.row(board[lastMove.row])) {
		console.log('winner');
	}

	var col = [
		board[0][lastMove.col],
		board[1][lastMove.col],
		board[2][lastMove.col]
	];
	if (this.complete.col(col)) {
		console.log('winner');
	}
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

	// Alternate moves
	app.currentMove = (app.currentMove === 'X') ? 'O' : 'X';
};

app.updateBoard = function(row, col, move) {
	this.board[row][col] = move;
};


// Begin
$(document).ready(function() {
	app.registerEvents();
	app.createBoardArray();
});