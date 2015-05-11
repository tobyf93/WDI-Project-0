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

// Create a 2D array for moves.
app.createBoardArray = function() {
	$('.cell').each(function() {
		
	});
};

app.makeMove = function() {
	$this = $(this);

	// Don't allow moves to be overwritten
	if ($this.html() !== '') {
		return;
	}

	$(this).html(app.currentMove);
	app.currentMove = (app.currentMove === 'X') ? 'O' : 'X';
};




// Begin
$(document).ready(function() {
	app.registerEvents();
	app.createBoardArray();
});