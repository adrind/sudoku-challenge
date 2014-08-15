# Sudoku, by Adrienne Dreyfus 

UI design: I only had time to implement a one board/one solution game. 
I chose to focus on a great user experience, so a board generator 
could be easily added underneath in the future without any changes to UI. 

All the cells are accessible by click/keyboard events. Additionally I made
keyboard shortcuts to "highlight" rows/columns/sections to allow the user 
to focus their attention to whatever set of 9 numbers they were trying to
solve. 

The buttons will provide hints to the user by checking the value of one cell,
or the entire board. It also lets the user easily clear the board or highlights.

###HTML

The sudoku board is structured as a basic table with inputs in the cells. I 
chose to take advantage of the placeholder attribute to temporarily store 
the value entered by the user so the user inputting experience was smooth. 
This was fine since I only had to support the most modern browsers, but any 
older versions would have required a backup implementation. 

I enjoy minimal markup so I only have the basics: a header, table, and divs for
the button rows. This was my first time working with Jade which was pretty fun. 

If I had more time I would have implemented a solution to support browsers
without placeholders. This would have consisted of clearing the value before 
user input on each focus (click), verifying, and then re-setting the value. 

###CSS

For the CSS I used SASS.

My CSS technique usually involves setting classes via Javascript rather than 
directly manipulating the css via jQuery methods. I find that this is an easier 
approach to maintain as designs change. It's much cleaner to make a new class
and swap the class name in an addClass method than it is to refactor the JS code

I used a couple of mixins where I thought it would be helpful, as well as
globals for colors so I could easily change them as I implemented the game.

I would have made a more thorough mobile design if I had time, by taking 
advantage of media queries and setting a new size/button layout. 

###Javascript

I'm a big fan of a "facade" design pattern. By writing small methods that do one
task, you decouple the structure and design of the front end from the Javascript
logic behind it. Image if I had to support browsers that didn't support the 
placeholder attribute; simply modifying the `getValue` and `setValue` methods in
SudokuCell would do the trick. Designs change all the time so structuring your
Javascript in this fashion is the best way to quickly iterate on these changes
without having to re-write a ton of code. It also helps a new person going into
the codebase understand what's going on because they don't have to track the 
state of global variables and just need to pay attention to the method name.

I used jQuery and Underscore.js libraries to help me easily manipulate DOM events
and Object/Array iterations. I like to prefix private variables with an 
underscore (_) so it's easy to tell what you exposing. 

Additionally I made sure to make my board as keyboard accessible as possible. 
This is important for the general user experience as well as supporting the
atypical user experience. If someone was disabled and could not easily move
a mouse, they could still play the game with simple keyboard motions. 

The biggest trade-off I came across was decided whether to use a one dimensional
array or a two dimensional array to store the SudokuCells. I chose 2D because
the math to calculate the indices seemed more intuitive to me than a 1D array. 

A couple of things I would have liked to do if I had more time to work on this:
	* Create a sudoku board generator. Ran out of time :(
	* Create an abstract "2D board game" class where I could define the move and 
	   set/get cell value methods. Then SudokuBoard could have extended this class
	   with some methods specific to Sudoku (such as board validation). The cool 
	   thing about this approach is you can use the abstracted 2D board game class 
	   to easily create other similar games (like Tic Tac Toe). 
	* I would have also like to use some dependency management so my JS wasn't in
		 one huge file. Libraries like require.js make this pretty easy to manage. 
		 
Overall this was a fun project that I think everyone should do at one point, 
I had a blast! 