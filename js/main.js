var app = app || {};

//////////////////////////////
// Object Variables
//////////////////////////////
app.board = [];
app.currentMove = 'X';






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