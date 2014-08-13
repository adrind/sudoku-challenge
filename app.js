/**
* A single sudoku cell object
*/

function SudokuCell ($cell) {
	this.$cell = $cell;
	this.input = this.$cell.find('input')[0];
	this.id = this.input.id;


 /*
  * Save the current user input as value if it's a number between 1-9
	*/
	this.setValue = function() {
		var newValue = Number(this._getUserInput());

		if(!this.$cell.hasClass('inactive') && newValue) {
			this._setValue(newValue);
		}

		this._clearUserInput();
	}

  /*****************************/
  /* Select/Unselect methods   */
  /*****************************/

 /* Focus on this cell */
	this.select = function() {
		this._clearHighlight();
		this.input.focus();
		return this;
	}

 /* Remove focus from this cell */
	this.unSelect = function() {
		this.input.blur();
	}

	/* Clears the value unless it's a starting cell */
	this.resetValue = function() {
		if(!this.$cell.hasClass('inactive')) {
			this.input.placeholder = '';
		}
	}

	/* Get id of the cell in the grid */
	this.getId = function() {
		return this.id;
	}

 /* Add an highlight when the current value is not correct */
	this._getUserInput = function() {
		return this.input.value;
	}

 /* Clears any input the user has entered */
	this._getPlaceholder = function() {
		return this.input.placeholder;
	}

 /* Clears any input the user has entered */
	this._clearUserInput = function() {
		this.input.value = '';
	}

 /*
  * Sets the value of cell
  * {@param} Number the new value of the cell
	*/
	this._setValue = function(value) {
		this.input.placeholder = value;
	}

 /* Add an highlight when the current value is correct */
	this.highlightCorrect = function() {
		this.$cell.addClass('correct');
	}

 /* Add an highlight when the current value is not correct */
	this.highlightIncorrect = function() {
		this.$cell.addClass('incorrect');
	}

 /* Remove all highlights from the cell */
	this._clearHighlight = function() {
		this.$cell.removeClass('correct');
		this.$cell.removeClass('incorrect');
	}
}

/**
* A sudoku board
* Stores the current state of all the game cells
*/

function SudokuBoard () {
  var selectedCellId = '',
  		_board = [],
  		_boardSolution= [[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
											[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
											[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]];

 /* Creates a new board of SudokuCells */
	this.initBoard = function() {
		var cells = $('.board').find('.cell');
			_.each(cells, function(cell, index){
				var rowIndex = Math.floor(index/9);

				if(!_board[rowIndex]) {
					_board[rowIndex] = new Array();
				}

				_board[rowIndex].push(new SudokuCell($(cell)));
			});
	}

	/* Getter and setter methods */
	this._getCell = function(id) {
		var row = Math.floor(id/9),
			col = id%9;

	  return _board[row][col];
	}

	this._getAnswerForCell = function(id) {
		var coords = this._getCoords(id);
		return _boardSolution[coords.row][coords.col];
	}

	this._getCoords = function(id) {
		return {
			row : Math.floor(id/9),
			col : id%9
		}
	}

	this.setValue = function(id) {
		this._getCell(id).setValue();
	}

	this.resetValue = function(id) {
		this._getCell(id).resetValue();
	}

	this.unFocus = function() {
		this.unSelectCell(this._selectedCellId);
	}

	/* Select/Unselect cell methods */

	this.selectCell = function(id) {
		this._getCell(id).select();
		this._selectedCellId = id;
	}

	this.unSelectCell = function(id) {
		this._getCell(id).unSelect();
		this._selectedCellId = '';
	}

	/* Navigation methods */

	this.moveLeft = function(id) {
	  this._move(id, -1, 0);
	}

	this.moveRight = function(id) {
	  this._move(id, 1, 0);
	}

	this.moveUp = function(id) {
		this._move(id, 0, -1);
	}

	this.moveDown = function(id) {
		this._move(id, 0, 1);
	}

	/*
	 * Moves the focus on the board
	 * {@param} Number id of the starting cell
	 * {@param} Number direction to move horizontally [-1,0,1]
	 * {@param} Number direction to move vertically [-1,0,1]
	 */
	this._move = function(id, x, y) {
		var oldCoords = this._getCoords(id),
				newRow = oldCoords.row + y,
				newCol = oldCoords.col + x,
				newId;

		//Handle cases when you move past the row/col end
		if(newRow > 8) { newRow = 0; }
		else if(newRow < 0) { newRow = 8; }
		if(newCol > 8) { newCol = 0; }
		else if(newCol < 0) { newCol = 8; }

		this.unSelectCell(id);
		var newId = _board[newRow][newCol].getId();
		this.selectCell(newId);
	}

	this.restart = function() {
		_.each(_board, function(row){
			_.each(row, function(cell){
				cell.resetValue();
			});
		});
	}

	this.validate = function() {
		return _.map(_board, _.bind(function(row){
			var truthRow = _.map(row, _.bind(function(cell){
				return this.checkCellValue(cell._getPlaceholder(), cell.getId());
			},this));
			return truthRow;
		},this));
	}

	this.checkCellValue = function(value, id) {
		var cellValue,
				id = id || this._selectedCellId,
				correctValue = this._getAnswerForCell(id);

		if (id) {
			cellValue = this._getCell(id)._getPlaceholder();
			if(cellValue == correctValue) {
				this._getCell(id).highlightCorrect();
				return true;
			} else {
				this._getCell(id).highlightIncorrect();
				return false;
			}
		}
	}
}

/**
* A sudoku game
* Uses the sudoku board to manipulate the view
*/

function Sudoku () {

	var KEY_DOWN = 40,
			KEY_UP = 38,
			KEY_RIGHT = 39,
			KEY_LEFT = 37,
			ESC = 27,
			$board = $('.board'),
			board;

	this.init = function() {

		this.board = new SudokuBoard ();
		this.board.initBoard();
		this._setEventListeners();
	}

	this._setEventListeners = function() {
		$board.on('click', '.cell', _.bind(this._selectCell,this));
		$('.submit').on('click', _.bind(this._validateBoard, this));
		this._setClickListeners();
		this._setKeyPressListeners();
	}

	this._selectCell = function(evt) {
		var id = $(evt.target).attr('id');
		evt.stopPropagation();
		this.board.selectCell(id);
	}

	this._setKeyPressListeners = function() {
		$('input').on('keyup', _.bind(function(evt){
			var id = $(evt.target).attr('id');

			switch (evt.keyCode){
				case KEY_UP:
					this.board.moveUp(id);
					return false;
				case KEY_DOWN:
					this.board.moveDown(id);
					return false;
				case KEY_LEFT:
					this.board.moveLeft(id);
					return false;
				case KEY_RIGHT:
					this.board.moveRight(id);
					return false;
				case ESC:
					this.board.resetValue(id);
				default:
					this._keyPressed(evt);
					return false;
			}
		},this));
	}

	this._setClickListeners = function() {
		$('body').on('click', _.bind(function(evt){
			var targetNode = $(evt.target)[0].nodeName;

			switch (targetNode){
				case "INPUT":
					this._selectCell(evt);
					return false;
				case "BUTTON":
					this._buttonPressed(evt);
					return false;
				default:
					this._boardUnfocused(evt);
			}
		},this));
	}

	this._boardUnfocused = function(evt) {
		this.board.unFocus();
	}

	this._buttonPressed = function(evt) {
		var target = $(evt.target);
		evt.stopPropagation();
		if (target.hasClass('check')) {
			this.board.checkCellValue();
		} else if (target.hasClass('restart')){
			this.board.restart();
		}
	}

	this._keyPressed = function(evt) {
		var id = $(evt.target).attr('id');
		this.board.setValue(id);
	}

	this._validateBoard = function(evt) {
		this.board.validate();
	}

}




