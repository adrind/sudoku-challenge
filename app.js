




setEventListeners: function() {
	$('.board').on('click', '.cell', function(evt){
		var cell = $(this);
		cell.addClass('selected');
	})
}


initializeBoard: function() {
	setEventListeners();
}


$(document).ready(initializeBoard);
