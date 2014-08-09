
function SudokuCell ($cell) {
	this.$cell = $cell;
	this.value = $cell.innerHTML;
	
	this.setValue = function(newValue) {
		this.$cell.html(newValue);
	}
}


function Sudoku () {

	var KEY_DOWN = 40,
			KEY_UP = 38, 
			KEY_RIGHT = 39, 
			KEY_LEFT = 37, 
			$board = $('.board'),
			board = [];
			
	this.init = function() {
		var cells = $board.find('.cell');
		_.each(cells, function(cell){
			board.push(cell);
		});
		
		this.setEventListerns();
	}

	this.setEventListeners = function() {
		$board.on('click', '.cell', function(evt){
			var cell = $(this),
					cells = $('.cell');
			
			cells.removeClass('selected');
			cell.addClass('selected');
		});
	}
	
	this._setKeyPressListeners = function() {
		$board.on('keyUp', '.cell', function(evt){
			switch (evt.keyCode):
				case KEY_UP:
					this._keyUpPressed(evt);
				case KEY_DOWN: 
					this._keyDownPressed(evt);
				case KEY_RIGHT: 
		})
	}
}




