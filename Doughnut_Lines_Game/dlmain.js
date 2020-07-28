var classes = ["white", "teal", "yellow", "green", "orange", "pink", "purple"];

var settings = {
	width: 9,
	height: 9,
	numberOfFirstBalls: 3,
	numberOfNextBalls: 3,
	colors: classes.length,
	lineLength: 5
};

//container in witch <p> are created
var container = document.getElementById("container");
//div, which says "lose" and is placed over screen after you lose
var lost = document.getElementById("lost");

var gameBody = [];
for(x = 0; x < settings.height; x++){
	gameBody.push([]);
}

//previous selected p info to use it in swap function
var previous = "";
var prevPicture;
var prevPicIdx;

var count = 0;
var gameOn = true;

//empty div on top, which blocks any actions after the game is over
var wrapper = document.getElementById("wrapper");

var points = 0;
var pointDisplay = document.getElementById("points");

let cellsCleared = false;

let needNewBalls = false;

//*************************************Game Body***************************************************************
function createNewDeck(){
	points = 0;
	pointDisplay.innerHTML = "Points:"+ points;	
	//update lost, win and block display as not visible
	lost.style.display = "none";
	wrapper.style.display = "none";
	count = 0;
	previous = "";
	prevPicture = "";
	prevPicIdx = "";
	gameOn = true;
	//generates all squares (<p>). First cleans all previos squares
	container.innerHTML = "";
	//creates random pictures puts them to arrays and creates <p> 
	for (i = 0; i < settings.height; i++){
		for (j = 0; j < settings.width; j++){
		//this part generates new random picture
			var newPic = "square";
			//put it into array
			gameBody[i][j]=newPic;
			//creates new p element for it
			var p = document.createElement("p");
			//adds id to every square
			p.id = i+"-"+j;
			//changes background img to random pic
			p.style.backgroundImage = "url(assets/"+newPic+".png)";
			//push <p> to cointainer div
			container.appendChild(p);
			p.classList.add("empty");

			//adds click listener to every p to enable 2 pictures swap 
			p.addEventListener("click", swapP);
	    }
	}
	addRandPic(settings.numberOfFirstBalls);
}

function findCell(par){
	var cellRow = parseInt(par.id.charAt(0));
	var cellCol = parseInt(par.id.slice(-1));
	var cell = {row: cellRow, col: cellCol};
	return cell;
}

function addRandPic(numOfPic){
	for(x=0; x< numOfPic; x++){
		var emptySquares = document.getElementsByClassName("empty");
		var randSquare = emptySquares[Math.floor(Math.random()*emptySquares.length)];
		var randPic = randomPicture(classes); 
		randSquare.style.backgroundImage = "url(assets/"+randPic+".png)";
		randSquare.classList = "doughnut";
	    gameBody[findCell(randSquare).row][findCell(randSquare).col] = randPic;
		// console.log(randPic);
	}
}

//select specific number of pictures of all pictures
function randomPicture(listOfPictures){
	//var picture = listOfPictures[0];
	//generates random number between 1 and number of all classes
	var index = Math.floor(Math.random()*listOfPictures.length);
	//specific picture in the loop cycle
	var picture = listOfPictures[index];
	return picture;
	
}

function swapP(){
	document.getElementById("audioClick").play();
	//puts border around selected p
	this.style.border = "2px solid white";
	//saves values of currently selected p
	var current = this;
	var currPicture = gameBody[findCell(this).row][findCell(this).col];
	currPicIdx = whichChild(current) + 1;
	prevPicIdx = whichChild(previous) + 1;
	//swaps images only next to each other
	if (count % 2 !== 0) {
		if (findPath(previous, current)){
			needNewBalls = true;
			// console.log("changes made");
		//updates array`s values and background images
			document.getElementById(current.id).style.backgroundImage = "url(assets/"+prevPicture+".png)";
			document.getElementById(previous.id).style.backgroundImage = "url(assets/"+currPicture+".png)";
			document.getElementById(current.id).classList = "doughnut";
			document.getElementById(previous.id).classList = "empty";
			gameBody[findCell(this).row][findCell(this).col] = prevPicture;
			gameBody[findCell(previous).row][findCell(previous).col] = currPicture;
			//when imgs replaced - erases border around them
			clearBordersFromAllP();
			//checks if there are any matches after the swap
		} else {			
			// console.log("no changes made, don`t need balls");
			needNewBalls = false;
			//no path found
			document.getElementById("adioWrong").play();
		}
	} 
	//if imgs were not replaced - erases border around them
	if (count > 0 && count % 2 !== 0) {
		clearBordersFromAllP();
	}
	//updates values
	count++;
	previous = current;
	prevPicture = currPicture;
	checkMatchCol();
	checkMatchesRow();
	var diagonalCleared = checkDiagonal();
	//console.log("dcleared = " + diagonalCleared);
    if(diagonalCleared) {
		cellsCleared = true;
	}
	var freeSquaresLeft = checkIfSpaceLeft();
	if (!cellsCleared && needNewBalls && count % 2 === 0 ){
		if (freeSquaresLeft >= 3 ){
			addRandPic(settings.numberOfNextBalls);
		} else if (freeSquaresLeft < 3 && freeSquaresLeft > 0 ){
			addRandPic(freeSquaresLeft);
		}
		// console.log("adding new balls");
		needNewBalls = false;
		checkMatchCol();
		checkMatchesRow();
		var diagonalCleared = checkDiagonal();
	}
	freeSquaresLeft = checkIfSpaceLeft();
	if (freeSquaresLeft === 0 ){
		gameOver();
	}
	cellsCleared = false;	
}

function checkIfSpaceLeft(){
	var freeSquaresLeft = 0;
	for (i = 0; i < 9; i++){
		for (j = 0; j < 9; j++){
			//if any empty square left
			if (gameBody[i][j] === "square"){
				freeSquaresLeft++;
			} 
		}
	}
	return freeSquaresLeft;
}

function gameOver(){
	document.getElementById("audioLost").play();
	//display words "you lost"
	lost.innerHTML = "SCORE: " + points;
	lost.style.display = "block";
	//block any additional action with the game
	wrapper.style.display = "block";
}

function clearBordersFromAllP() {
	// assuming that grid is always 9x9
	for(i = 0; i < settings.height; i++) {
	    for(j = 0; j < settings.height; j++) {
			document.getElementById(i + "-" + j).style.border = "2px solid #232323";
		}	
	}
}

//gets <p> numerical index in container div
function whichChild(elem){
    var  i= 0;
    while((elem=elem.previousSibling)!=null) ++i;
    return i;
}

//using id of selected p finds if it is taken or not
function valueOnTheBoard(par){
	var columnPrev = parseInt(par.id.slice(-1));
	var rowPrev = parseInt(par.id.charAt(0));
	return gameBody[rowPrev][columnPrev];
}




//creates 4 paragraphs using selected p
function findNeighbors(par){
//gets x and y values from p id
	var x = parseInt(par.id.charAt(0));
	var y = parseInt(par.id.slice(-1)); 
//finds neighborous to the left/right/top/bottom modifing id values
	var bott = {x: x, y: y+1};
	var top = {x: x, y: y-1};
	var left = {x: x-1, y: y};
	var right = {x: x+1, y: y};
	var all = [bott, top, left, right];
	var neighbours = [];
//checks if such p is on board (not smaller of bigger than cell number)
	for (i=0; i<all.length; i++){
		if(all[i].x >= 0 && all[i].y >= 0 && all[i].x < settings.height && all[i].y < settings.width){
			neighbours.push(document.getElementById(all[i].x+"-"+all[i].y));
		}
	}
	return neighbours;
}

//****************************************************************************
//checks matching between picture rows and columns

function checkMatchesRow(){
	for (i = 0; i < gameBody.length; i++){
		var start = 0;
		var end = 0;
		var etalon = "";
		for (j = 0; j < gameBody[i].length; j++){
			var current = gameBody[i][j];
			//if current is empty square
			if (current === "square"){
				//reset the sequence
				clearCells(i, start, end, "row");
				//reset previous sequence
				etalon = "";
				start = 0;
				end = 0;
			} //if the ball matches etalon
			else if(current === etalon){
				//move the end point of sequence (shows how many balls are in sequence)
				end = j;
				//if balls count in the sequence is 5 or more
				if (j === settings.width - 1){
					//clears balls from the deck
					clearCells(i, start, end, "row");
				}
			} else {
				//reset the sequence
				clearCells(i, start, end, "row");
				//update the etalon and sequence
				etalon = current;
				start = j;
				end = j;
			}
		}
	}
}

//same as CheckMatchRow comments
function checkMatchCol(){
	for (j = 0; j < settings.width; j++){
		var start = 0;
		var end = 0;
		var etalon = "";
		for (i = 0; i < settings.height; i++){
			var current = gameBody[i][j];
			if (current === "square"){
				clearCells(j, start, end, "col");
				etalon = "";
				start = 0;
				end = 0;
			} else if(current === etalon){
				end = i;
				if (i === settings.height - 1){
					clearCells(j, start, end, "col");
				}
			} else {
				clearCells(j, start, end, "col");
				etalon = current;
				start = i;
				end = i;
			}
		}
	}
}

function checkDiagonalImpl(row, col, rowInc, colInc) {
	var currentRow = row;
	var currentCol = col;
	var etalon = "";
	var cells = [];
	var cleared = false;

	//console.log("check diagonal: row = " + row + ", col = " + col);
	//checking every diagonal in the limit of [0][0] and [8][8]
	while (checkPointIsValid(currentRow, currentCol)) {
        
		var cell = document.getElementById(currentRow + "-" + currentCol);
		var current = gameBody[currentRow][currentCol];
		//if this is the first ball in the row or the ball matcthes the etalon - we add it to new sequence
        if (etalon === "" && current !== "square" || etalon === current && current !== "square") {
			cells.push(cell);			 
			etalon = current;
			//console.log("push cell: " + current);
		} else {
			//if the sequence is long enough and we need to clear it
			if(cells.length >= settings.lineLength) {
				updatePoints(cells);
				cells.forEach(cell => {
					setTimeout(()=>{
						cell.style.backgroundImage = "url(assets/square.png)";
						cell.classList = "empty";
						document.getElementById("audioSwitch").play();
					}, 300);
					var xy = cell.id.split("-");
					gameBody[xy[0]][xy[1]] = "square";
				});
				cleared = true;
				cells = [];
			} 
			//if the previous sequence is not long enough and we find ball of another clour
			else {
				//update sequence and etalon
				cells = [];
				cells.push(cell);			 
				etalon = current;
				//console.log("push cell: " + current);
			}
		}
		//change the diagonal (row & col)
		currentRow = rowInc(currentRow);
		currentCol = colInc(currentCol);
	}

	//if the diagonal checked - maybe the last ball was the 5th so we check the sequence && clear the diagonal
	if(cells.length >= settings.lineLength) {
		updatePoints(cells);
		cells.forEach(cell => {
			setTimeout(()=>{
				cell.style.backgroundImage = "url(assets/square.png)";
				cell.classList = "empty";
				document.getElementById("audioSwitch").play();
			}, 300);
			var xy = cell.id.split("-");
			gameBody[xy[0]][xy[1]] = "square";
		});
		cleared = true;
	}
	return cleared;
}

function updatePoints(cells){
	if (cells.length === 5){
		points += 50;
	} else if (cells.length === 6){
		points += 100;
	} else if (cells.length === 7){
		points += 200;
	}  else if (cells.length === 8){
		points += 350;
	} else if (cells.length === 9){
		points += 500;
	}
	setTimeout(()=>{
		pointDisplay.innerHTML = "Points:"+ points;	
	}, 300);
}


function checkDiagonal() {
	//checks all 4 different dimensions of diagonal on the field
	var cleared = false;
	for(i = 0; i < 9; i++) {
		cleared = cleared || checkDiagonalImpl(i, 0, row => row - 1, col => col + 1);
		// console.log("diag-1-checked");
	}
	for(i = 8; i >= 0; i--) {
		cleared = cleared || checkDiagonalImpl(i, 8, row => row + 1, col => col - 1);
		// console.log("diag-2-checked");
	}
	for(i = 8; i >= 0; i--) {
		cleared = cleared || checkDiagonalImpl(0, i, row => row + 1, col => col + 1);
		// console.log("diag-3-checked");
	}
	for(i = 0; i < 9; i++) {
		cleared = cleared || checkDiagonalImpl(8, i, row => row - 1, col => col - 1);
		// console.log("diag-4-checked");
	}
	return cleared;
}

//keeps the frame for diagonal on the field between [0][0] and [8][8]
function checkPointIsValid(row, col) {
	return row >= 0 && row < 9 && col >= 0 && col < 9;
}


function clearCells(cell, start, end, rorc){
	//updates points
	if (end - start +1 >= settings.lineLength){
		if ((end - start) === 4){
			points += 50;
		} else if ((end - start) === 5){
			points += 100;
		} else if ((end - start) === 6){
			points += 200;
		}  else if ((end - start) === 7){
			points += 350;
		} else if ((end - start) === 8){
			points += 500;
		}
		setTimeout(()=>{
			pointDisplay.innerHTML = "Points:"+ points;	
		}, 300);
		// console.log(cell +"," + start +","+ end);
		//calls clear cells function 
		for (x = start; x <= end; x++){
			if(rorc === "col"){
				clearCellsCol(cell, x);	
			} else if (rorc === "row"){
				clearCellsRow(cell, x);
			}
		}
		cellsCleared = true;
	}
}


function clearCellsCol(cell, x){
	setTimeout(()=>{
		document.getElementById(x+"-"+cell).style.backgroundImage = "url(assets/square.png)";
		document.getElementById(x+"-"+cell).classList = "empty";
		gameBody[x][cell] = "square";
		document.getElementById("audioSwitch").play();
	}, 300);
}
function clearCellsRow(cell, x){
	setTimeout(()=>{
		document.getElementById(cell+"-"+x).style.backgroundImage = "url(assets/square.png)";
		document.getElementById(cell+"-"+x).classList = "empty";
		gameBody[cell][x] = "square";
		document.getElementById("audioSwitch").play();
	}, 300);
}


//checks if ball can be moved or not - if there is way to the place where we want to move it
function findPath(startPoint, target){
	if(valueOnTheBoard(startPoint) !== "square" && valueOnTheBoard(target) === "square"){
		//array were are preserved cells which are supposed to be checked
		var inProcess = [];
		inProcess.push(startPoint);
		//array for cells which have already been checked and are not empty - ball can`t get through
		var finished = [];
		//while we have something to check - continue cycle
		while(inProcess.length>0){
			//we delete 1 value from inProcess aray and start checking it
			var current = inProcess.pop();
			//if it is the same cell as target cell - function finished and there is a path
			if (current.id === target.id){
				return true;
			}
			//finding all neighbours of this cell to now review them
			var neighbours = findNeighbors(current);
			//if not - cell is not right and we move it to finished
			finished.push(current);
			//creating temporary array to sort neighbours whick are empty and not and later sort them by main arrays
			var onHold = [];
			for (x = 0; x < neighbours.length; x++){
				//creating temporary var to control checked cell in a loop
				var found = false;
				//checking if our cell was already checked - looking for it in finished array. If it was - stap check
				for (i = 0; i < finished.length; i++){
					if (finished[i].id === neighbours[x].id){
						found = true;
						break;
					}
				}
				//if the cell was not checked yet - check if it is empty or not
				if (!found){
					//if it is emty - move to onHold to later remove to inProcess and repeat cycle with this cell
					if(valueOnTheBoard(neighbours[x])=== "square"){
						onHold.push(neighbours[x]);
					//if it is not empty - move to finished
					} else {
						finished.push(neighbours[x]);
					}
				}
			}
			//all onHold cells move to inProcess to repeat all cycle with all of them
			for (j=0; j < onHold.length; j++){
				inProcess.push(onHold[j]);
			}
		}
		//if neither of cells found was the target cll - return false, there is no path
		return false;
	}
}

createNewDeck();
findPath(document.getElementById("4-6"), document.getElementById("0-0"));
pointDisplay.innerHTML = "Points:"+ points;

document.getElementById("playAgain").addEventListener("click", function(){
	createNewDeck();
	document.getElementById("adioPop").play();
});
