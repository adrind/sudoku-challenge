/**
* A single sudoku cell object
*/

function SudokuCell ($cell) {
	this.$cell = $cell;
	this.input = this.$cell.find('input')[0];
	this.id = this.input.id;
	
	
	//Only sets the value if it's a number between 1-9
	this.setValue = function() {
		var newValue = Number(this._getValue());
		
		if(!this.$cell.hasClass('inactive') && newValue) {
			this._setValue(newValue);
		} 
		
		this._clearInput();
	}
	
	/* Select/Unselect cell methods */
	
	this.select = function() {
		this._clearHighlight();
		this.input.focus();
		return this;
	}
	
	this.unSelect = function() {
		this.input.blur();
	}
	
	/* Getter and setter methods */
	
	this.resetValue = function() {
		if(!this.$cell.hasClass('inactive')) {
			this.input.placeholder = '';
		}
	}
	
	this.getId = function() {
		return this.id;
	}
	
	this._getValue = function() {
		return this.input.value;
	}
	
	this._getPlaceholder = function() {
		return this.input.placeholder;
	}
		
	this._clearInput = function() {
		this.input.value = '';
	}
	
	this._setValue = function(value) {
		this.input.placeholder = value;
	}
	
	this.highlightCorrect = function() {
		this.$cell.addClass('correct');
	}
	
	this.highlightIncorrect = function() {
		this.$cell.addClass('incorrect');
	}
	
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
  		_boardSolution= [[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7]
											[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6], 
											[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]];
	
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
	
	this._move = function(id, x, y) {
		var oldCoords = this._getCoords(id),
				newRow = oldCoords.row + y, 
				newCol = oldCoords.col + x,
				newId;
		
		if(newRow > 8) { newRow = 0; }
		else if(newRow < 0) { newRow = 8; }
		if(newCol > 8) { newCol = 0; }
		else if(newCol < 0) { newCol = 8; }
		
		this.unSelectCell(id);
		var newId = _board[newRow][newCol].getId();
		this.selectCell(newId);
	}
	
	this.validate = function() {
		_.map(_board, function(row){
			return _.map(function(number, index){
				
			})
		})
	}
	
	this.checkCellValue = function(value) {
		var cellValue,
				id = this._selectedCellId,
				correctValue = this._getAnswerForCell(id);
		
		if (id) {
			cellValue = this._getCell(id)._getPlaceholder();
			if(cellValue == correctValue) {
				this._getCell(id).highlightCorrect();
			} else {
				this._getCell(id).highlightIncorrect();
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
		$('.check').on('click', _.bind(this._validateCell, this));
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
				case "BUTTON":
					this._buttonPressed(evt);
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
		if (target.hasClass('check')) {
			this._validateCell();
		}
	}
	
	this._keyPressed = function(evt) {
		var id = $(evt.target).attr('id');
		this.board.setValue(id);
	}
		
	this._validateBoard = function(evt) {
		this.board.validate();
	}
	
	this._validateCell = function() {		
		this.board.checkCellValue();
	}
	
}




