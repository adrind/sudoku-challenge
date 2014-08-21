/**
* Methods to control the state of a single sudoku cell
*
* @class SudokuCell
* @constructor
*/

function SudokuCell ($cell) {
  this._$cell = $cell; //jQuery DOM reference
  this._$input = this._$cell.find('input'); //DOM reference

 /**
  * Validates the user input & sets the value of the cell if it's valid input
  * @param {String} the current user input
  */
  this.setValue = function(value) {
    //input only accepts one character we can reject anything that is not a number
    var numericValue = Number(value);

    if(!this._$cell.hasClass('inactive') && numericValue) {
      this._setValue(numericValue);
    }

    this._clearUserInput();
  }


  /* Sets focus on this cell */
  this.select = function() {
    this.clearSolutionHighlighting();
    this._$input.focus();
    return this;
  }

  /* Removes focus from this cell */
  this.unSelect = function() {
    this._$input.blur();
  }

  /* Clears the value unless it's an initial starting cell */
  this.resetValue = function() {
    if(!this._$cell.hasClass('inactive')) {
      this._$input.attr('placeholder', '');
    }

    if(this._$input.val()) {
      this._$input.val('');
    }
  }

 /**
  * Returns the id of the cell
  * {@return} Number cell id
  */
  this.getId = function() {
    return this._$input.attr('id');
  }

 /**
  * Gets the value the user has currently input
  * @return {String} the current user input
  */
  this._getUserInput = function() {
    return this._$input.val();
  }

  /* Clears any input the user has entered */
  this._clearUserInput = function() {
    this._$input.val('');
  }

 /**
  * Gets the current saved value of the cell
  * @return {String} the saved value
  */
  this.getValue = function() {
    return this._$input.attr('placeholder');
  }

 /**
  * Sets the value of cell
  * @param {Number} the new value of the cell
  */
  this._setValue = function(value) {
    this._$input.attr('placeholder', value);
  }

  /* Adds a green highlight when the current value is correct */
  this.highlightCorrect = function() {
    this._$input.addClass('correct');
  }

  /* Adds a red highlight when the current value is not correct */
  this.highlightIncorrect = function() {
    this._$input.addClass('incorrect');
  }

  /* Removes all solution related highlights from the cell */
  this.clearSolutionHighlighting = function() {
    this._$input.removeClass('correct incorrect');
  }

  /* Adds a general yellow highlight to the cell */
  this.highlight = function() {
    this._$input.addClass('highlight');
    this._clearUserInput();
  }

  /* Removes the general highlight from the cell */
  this.clearHighlight = function() {
    this._$input.removeClass('highlight');
  }

  /* Darkens the background of a cell */
  this.darken = function() {
    this._$cell.addClass('darken');
  }
}

/**
* Methods to control the state of a sudoku board
*
* @class SudokuBoard
* @constructor
*/

function SudokuBoard () {
  var _selectedCellId = '', //current selected/focused cell
      _board = [], //board of user inputted values
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
        this._initializeBackground(sudokuCell);
      },this));
  }

  /* Fetch cell(s) methods */
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

    //cycle through the board and return the cells in the same column
    _.each(_board, function(cellRow) {
      _.each(cellRow, function(cell,colIndex) {
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

    //cycle through the board and return the cells in the same box section
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

  /**
   * Initializes the background of a cell
   * @param {Object} cell to initialize
   */
  this._initializeBackground = function(cell) {
    var coords = this._getCoords(cell);

    //Only darken cells of every other section
    if( (Math.floor(coords.row/3) + Math.floor(coords.col/3))%2) {
      cell.darken();
    }
  }

  /**
   * Returns the expected solution value for a single cell
   * @param {Number} id of cell to check
   */
  this._getAnswerForCell = function(id) {
    var coords = this._getCoords(id);
    return _boardSolution[coords.row][coords.col];
  }

  /**
   * Returns the coordinates of the cell in the board
   * @param {Number|Object} either the id of a cell or a cell to look up
   */
  this._getCoords = function(param) {
    var id = typeof param === 'object' ? param.getId() : param;

    return {
      row : Math.floor(id/9),
      col : id%9
    }
  }

  /**
   * Sets the value on a cell
   * @param {Number} the id of a cell
   * @param {String} the value the user input
   */
  this.setValue = function(id, value) {
    this._getCell(id).setValue(value);
  }

  this.resetValue = function(id) {
    this._getCell(id).resetValue();
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

  this.unFocus = function() {
    if(this._selectedCellId) {
      this.unSelectCell(this._selectedCellId);
    }
  }

  /* Hightlight cell methods */

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

  /**
   * Highlights a given subset of cells
   * @param {Array} the cells to highlight
   */
  this._highlightCells =function(cells) {

    //Unhighlight all cells
    _.each(_board, function(cellRow){
      _.each(cellRow, function(cell){
        cell.clearHighlight();
      });
    });

    //Highlight newly selected cells
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

  /**
   * Moves the focus on the board to a different cell
   * @param {Number} id of the starting cell
   * @param {Number} direction to move horizontally [-1,0,1]
   * @param {Number} direction to move vertically [-1,0,1]
   */
  this._move = function(id, x, y) {
    var oldCoords = this._getCoords(id),
        newRow = oldCoords.row + y,
        newCol = oldCoords.col + x,
        newId;

    //Handle cases when you move past the end of a row/col
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
        cell.clearSolutionHighlighting();
        cell.resetValue();
      });
    });
  }

  /* Clears all highlighting from the board */
  this.clearHighlighting = function() {
    _.each(_board, function(row){
      _.each(row, function(cell){
        cell.clearSolutionHighlighting();
        cell.clearHighlight();
      });
    });
  }


  /**
   * Validates the entire board and highlights it accordingly
   * @return {Array} an array of booleans that signifies whether a cell is correct
   */
  this.validateBoard = function() {
    this.clearHighlighting();

    return _.map(_board, _.bind(function(row){
      var truthRow = _.map(row, _.bind(function(cell){
        return this.validateCell(cell.getId());
      },this));
      return truthRow;
    },this));
  }

  /**
   * Validates a single cell and highlights it accordingly
   * @param  {Number} id of the cell to validate
   * @return {Boolean} whether the cell is correct
   */
  this.validateCell = function(id) {
    var cellValue,
        id = id || this._selectedCellId,
        correctValue = this._getAnswerForCell(id);

    if (id) {
      cellValue = this._getCell(id).getValue();
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
* Methods to control the state of a sudoku game
* Focuses on handling events made on the board
*
* @class Sudoku
* @constructor
*/

function Sudoku () {

  //Globals
  var KEY_DOWN = 40,
      KEY_UP = 38,
      KEY_RIGHT = 39,
      KEY_LEFT = 37,
      ESC = 27,
      HIGHLIGHT_ROW = 82,
      HIGHLIGHT_COL = 67,
      HIGHLIGHT_BOX = 66,
      CHECK_CLASS = 'check',
      RESTART_CLASS = 'restart',
      SUBMIT_CLASS = 'submit',
      CLEAR_HIGHLIGHTING_CLASS = 'clear-highlighting',
      INPUT = 'INPUT',
      BUTTON = 'BUTTON',
      _board;

  /* Inits the game */
  this.init = function() {

    this._board = new SudokuBoard();
    this._board.initBoard();
    this._setClickListeners();
    this._setKeyPressListeners();
  }

  /* Sets key press event listeners on the page */
  this._setKeyPressListeners = function() {
    $('input').on('keyup', _.bind(function(evt){
      var id = $(evt.target).attr('id');

      switch (evt.keyCode){
        case KEY_UP:
          this._board.moveUp(id);
          return false;
        case KEY_DOWN:
          this._board.moveDown(id);
          return false;
        case KEY_LEFT:
          this._board.moveLeft(id);
          return false;
        case KEY_RIGHT:
          this._board.moveRight(id);
          return false;
        case ESC:
          this._board.resetValue(id);
          return false;
        case HIGHLIGHT_ROW:
          this._board.highlightRow(id);
          return false;
        case HIGHLIGHT_COL:
          this._board.highlightCol(id);
          return false;
        case HIGHLIGHT_BOX:
          this._board.highlightBox(id);
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
        case INPUT:
          this._selectCell(evt);
          return false;
        case BUTTON:
          this._buttonPressed(evt);
          return false;
        default:
          this._boardUnfocused(evt);
      }
    },this));
  }

  /**
   * Selects a cell on click
   * @param {Event} click event
   */
  this._selectCell = function(evt) {
    var id = $(evt.target).attr('id');
    this._board.selectCell(id);
  }

  /**
   * Unfocuses the board when a click is outside the board
   * @param {Event} click event
   */
  this._boardUnfocused = function(evt) {
    this._board.unFocus();
  }

  /**
   * Event handler when a button is pressed
   * Switch on the classname
   * @param {Event} button event
   */
  this._buttonPressed = function(evt) {
    var buttonClass = $(evt.target).attr('class');

    switch(buttonClass) {
      case CHECK_CLASS:
        this._board.validateCell();
        return false;
      case RESTART_CLASS:
        this._board.restart();
        return false;
      case SUBMIT_CLASS:
        this._board.validateBoard();
        return false;
      case CLEAR_HIGHLIGHTING_CLASS:
        this._board.clearHighlighting();
        return false;
      default:
        return false;
    }
  }

  /**
   * Handles the user input
   * @param {Event} keyUp event
   */
  this._keyPressed = function(evt) {
    var $target = $(evt.target), //cache the reference
        id = $target.attr('id'),
        value = $target.val();
    this._board.setValue(id, value);
  }

}




