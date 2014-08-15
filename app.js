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
		this.clearHighlighting();
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
		this.$cell.find('input').addClass('correct');
	}

 /* Add an highlight when the current value is not correct */
	this.highlightIncorrect = function() {
		this.$cell.find('input').addClass('incorrect');
	}

 /* Remove all highlights from the cell */
	this.clearHighlighting = function() {
		this.$cell.find('input').removeClass('correct');
		this.$cell.find('input').removeClass('incorrect');
	}
	
	this.highlight = function() {
		this.$cell.find('input').addClass('highlight');
		this._clearUserInput();
	}
	
	this.clearHighlight = function() {
		this.$cell.find('input').removeClass('highlight');
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
			_.each(cells, _.bind(function(cell, index){
				var rowIndex = Math.floor(index/9),
						sudokuCell = new SudokuCell($(cell));

				if(!_board[rowIndex]) {
					_board[rowIndex] = new Array();
				}

				_board[rowIndex].push(sudokuCell);
				this._initializeBackground(cell, rowIndex, _board[rowIndex].indexOf(sudokuCell));
			},this));
	}

	/* Getter and setter methods */
	this._getCell = function(id) {
		var row = Math.floor(id/9),
			col = id%9;

	  return _board[row][col];
	}
	
	this._getRow = function(id) {
		var row = Math.floor(id/9);
		return _board[row];
	}
	
	this._getCol = function(id) {
		var col = id%9,
				cells = [];
		_.each(_board, function(cellRow) { 
			return _.each(cellRow, function(cell,colIndex) {
				 if(colIndex === col){
				 	cells.push(cell);
				 };
			});
		 });
		 return cells;
	}
	
	this._getBox = function(id){
		var coords = this._getCoords(id),
				section = Math.floor(coords.col/3) + Math.floor(coords.row/3) * 3,
				cells = [];
		
		 _.each(_board, function(cellRow, rowIndex){
					_.each(cellRow, function(cell, colIndex){
						var cellSection = Math.floor(colIndex/3) + Math.floor(rowIndex/3) * 3;
						if(section === cellSection) {
							cells.push(cell);
						} 
					});
				}); 
		return cells;
	}
	
	/* 
	 * Returns the expected solution value for a cell
	 * @param {Number} id of cell to check
	 */
	this._initializeBackground = function(cell, row, col) {
		if( (Math.floor(row/3) + Math.floor(col/3))%2) {
			$(cell).addClass('darken');
		}
	}

	/* 
	 * Returns the expected solution value for a cell
	 * @param {Number} id of cell to check
	 */
	this._getAnswerForCell = function(id) {
		var coords = this._getCoords(id);
		return _boardSolution[coords.row][coords.col];
	}

	/* 
	 * Returns the coordinates of the cell in the board 
	 * @param {Number} id of cell to check
	 */
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
		if(this._selectedCellId) {
			this.unSelectCell(this._selectedCellId);
		}
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
	
	this.highlightRow = function(id) {
		var row = this._getRow(id);
		this._highlightCells(row);
	}
	
	this.highlightCol = function(id) {
		var col = this._getCol(id);
		this._highlightCells(col);
	}

	this.highlightBox = function(id) {
		var box = this._getBox(id);
		this._highlightCells(box);
	}

	
	this._highlightCells =function(cells) {
		_.each(_board, function(cellRow){
			_.each(cellRow, function(cell){
				cell.clearHighlight();
			});
		});
		
		_.each(cells, function(cell){
			cell.highlight();
		});
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
	 * Moves the focus on the board to a different cell
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

	/* Clears the entire board */
	this.restart = function() {
		_.each(_board, function(row){
			_.each(row, function(cell){
				cell.clearHighlighting();
				cell.resetValue();
			});
		});
	}
	
	this.clearHighlighting = function() {
		_.each(_board, function(row){
			_.each(row, function(cell){
				cell.clearHighlighting();
				cell.clearHighlight();
			});
		});
	}
	

	/* Validates the entire board */
	this.validateBoard = function() {
		this.clearHighlighting();
		return _.map(_board, _.bind(function(row){
			var truthRow = _.map(row, _.bind(function(cell){
				return this.validateCell(cell.getId());
			},this));
			return truthRow;
		},this));
	}

	/*
	 * Validates a single cell and highlights it accordingly
	 * @param {Number} id of the cell to validate
	 * @return {Boolean} whether the cell is correct
	 */
	this.validateCell = function(id) {
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
			HIGHLIGHT_ROW = 82,
			HIGHLIGHT_COL = 67,
			HIGHLIGHT_BOX = 66,
			$board = $('.board'),
			board;

	/* Init the game */
	this.init = function() {

		this.board = new SudokuBoard ();
		this.board.initBoard();
		this._setClickListeners();
		this._setKeyPressListeners();
	}

	/* Sets key press event listeners on the page */
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
					return false;
				case HIGHLIGHT_ROW:
					this.board.highlightRow(id);
					return false;
				case HIGHLIGHT_COL:
					this.board.highlightCol(id);
					return false;
				case HIGHLIGHT_BOX: 
					this.board.highlightBox(id);
					return false;
				default:
					this._keyPressed(evt);
					return false;
			}
		},this));
	}

	/* Sets click event listeners on the page */
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
	
	/* 
	 * Select a cell on click
	 * @param {Event} click event 
	 */
	this._selectCell = function(evt) {
		var id = $(evt.target).attr('id');
		this.board.selectCell(id);
	}

	/* 
	 * Unfocuses the entire board
	 * @param {Event} click event 
	 */
	this._boardUnfocused = function(evt) {
		this.board.unFocus();
	}

	/* 
	 * Unfocuses the entire board
	 * @param {Event} button event 
	 */
	this._buttonPressed = function(evt) {
		var buttonClass = $(evt.target).attr('class');
		
		switch(buttonClass) {
			case 'check':
				this.board.validateCell();
				return false;
			case 'restart':
				this.board.restart();
				return false;
			case 'submit': 
				this.board.validateBoard();
				return false;
			case 'clear-highlighting':
				this.board.clearHighlighting();
				return false;
			default:
				return false;
		}
	}

	/* 
	 * Handle the user input  
	 * @param {Event} keyUp event 
	 */
	this._keyPressed = function(evt) {
		var id = $(evt.target).attr('id');
		this.board.setValue(id);
	}

}




