


function Sudoku () {

	this.setEventListeners = function() {
		$('.board').on('click', '.cell', function(evt){
			var cell = $(this);
			cell.addClass('selected');
		});
	}
}




