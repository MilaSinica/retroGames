//classes responsible for creating food picture background
var classes = ["fish", "lampfish", "roundfish", "starfish", "octopus", "turtle", "fishx"];

var settings = {
	width: 9,
	height: 9,
	numberOfFirstBalls: 3,
	numberOfNextBalls: 3,
	colors: classes.length,
	lineLength: 3
};

//container in witch <p> are created
var container = document.getElementById("container");

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

var points = 500;
var pointDisplay = document.getElementById("points");

var counterDisplay = document.getElementById("counter");

//div, which says "win" and is placed over screen after you win
var win = document.getElementById("win");
//div, which says "lose" and is placed over screen after you lose
var lost = document.getElementById("lost");

//counter for countdoqn till the game is over
var counter;
//current counter value
var currentTick;
//counter of clicks to control which click is it numerically (even/uneven/first)

//was the first click made or not
var firstclick = false;

//************************************************************
//================================Counter ===========================================

//stops counter after the time run out
function stopCountdown() {
	clearInterval(counter);
	counterDisplay.innerHTML = "";
}

//counts time in reverse order and shows it on screen
function tic(){
	if (currentTick > 0){
		counterDisplay.innerHTML = "Time:" + currentTick;
		currentTick -= 1;
	} else {
		stopCountdown();
		//stops game when time runs out
		gameOver();
	}
}

//function reset previos counter value and starts new one
function startCountdown(sec){
	stopCountdown();
	//starts counter in reverse order
	currentTick = sec; 
	//every second execute tic function (to reduse counter by 1 every second)
	counter = setInterval(tic, 1000); 
}

//===================================================Game Over and Win=====================================================
//executed when the game is over
function gameOver(){
	//play sound
	document.getElementById("audioLost").play();
	//display words "you lost"
	lost.style.display = "block";
	wrapper.style.display = "block";
}
//executes when the game is won
function youWin(){
	//play sound
	document.getElementById("audioWin").play();
	//displays word "win" and blocks any additional actions
	win.style.display = "block";
	wrapper.style.display = "block";
	//stops countdown, resets conter, blocks actons
	stopGame();
}

//stops countdown, resets conter, blocks actons
function stopGame(){
	//stop countdown and reset counter
	stopCountdown();
	//block any additional action with the game
	wrapper.style.display = "block";
	gameOn = false;
}

//============================================New Game initialization============================================
function createNewDeck(){
	points = 500;
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
			var newPic = randomPicture(classes);
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
			p.classList.add("fish");

			//adds click listener to every p to enable 2 pictures swap 
			p.addEventListener("click", swapP);
	    }
	}
	checkMatch();
}

//select specific number of pictures of all pictures
function randomPicture(listOfPictures){
	//generates random number between 1 and number of all classes
	var index = Math.floor(Math.random()*listOfPictures.length);
	//specific picture in the loop cycle
	var picture = listOfPictures[index];
	return picture;
}

function swapP(){
	firstclick = true;
	document.getElementById("audioClick").play();
	//puts border around selected p
	this.style.border = "2px solid white";
	//saves values of currently selected p
	var current = this;
	var currPicture = gameBody[findCell(this).row][findCell(this).col];
	currPicIdx = whichChild(current) + 1;
	prevPicIdx = whichChild(previous) + 1;
	//swaps images only next to each other
	if (count % 2 !== 0 && (currPicIdx + 1 === prevPicIdx || currPicIdx - 1 === prevPicIdx || currPicIdx -9 === 
		prevPicIdx || currPicIdx + 9 === prevPicIdx) && currPicIdx - 1 !== prevPicIdx - 1) {
		//updates array`s values and background images
		document.getElementById(current.id).style.backgroundImage = "url(assets/"+prevPicture+".png)";
		document.getElementById(previous.id).style.backgroundImage = "url(assets/"+currPicture+".png)";
		document.getElementById(current.id).classList = "fish";
		document.getElementById(previous.id).classList = "empty";
		gameBody[findCell(this).row][findCell(this).col] = prevPicture;
		gameBody[findCell(previous).row][findCell(previous).col] = currPicture;
		//when imgs replaced - erases border around them
		clearBordersFromAllP();
		//checks if there are any matches after the swap
	} else if (count > 0 && count % 2 !== 0) {
		clearBordersFromAllP();
	}
	//updates values
	count++;
	previous = current;
    prevPicture = currPicture;
	checkMatch();
}

function findCell(par){
	var cellRow = parseInt(par.id.charAt(0));
	var cellCol = parseInt(par.id.slice(-1));
	var cell = {row: cellRow, col: cellCol};
	return cell;
}

//gets <p> numerical index in container div
function whichChild(elem){
    var  i= 0;
    while((elem=elem.previousSibling)!=null) ++i;
    return i;
}

function clearBordersFromAllP() {
	// assuming that grid is always 9x9
	for(i = 0; i < settings.height; i++) {
	    for(j = 0; j < settings.height; j++) {
			document.getElementById(i + "-" + j).style.border = "2px solid #232323";
		}	
	}
}

function checkMatch() {
	//checks all 4 different dimensions of diagonal on the field
	for(i = 0; i < 9; i++) {
		checkMatchByDirection(i, 0, row => row, col => col + 1);
		checkMatchByDirection(0, i, row => row + 1, col => col);
	}
}


function checkMatchByDirection(row, col, rowInc, colInc) {
	var currentRow = row;
	var currentCol = col;
	var etalon = "";
	var cells = [];

	//checking every diagonal in the limit of [0][0] and [8][8]
	while (checkPointIsValid(currentRow, currentCol)) {
        
		var cell = document.getElementById(currentRow + "-" + currentCol);
		var current = gameBody[currentRow][currentCol];
		//if this is the first ball in the row or the ball matcthes the etalon - we add it to new sequence
        if (etalon === current) {
			cells.push(cell);			 
			etalon = current;
			//console.log("push cell: " + current);
		} else {
			//if the sequence is long enough and we need to clear it
			if(cells.length >= settings.lineLength) {
				updatePoints(cells);
				cells.forEach(cell => {
					var cellRow = parseInt(cell.id.charAt(0));
					var cellCol = parseInt(cell.id.slice(-1));
					//starts animation
					animate(cell);
					var newPic = randomPicture(classes);
					gameBody[cellRow][cellCol]=newPic;					
					updateImgs(cellRow, cellCol, newPic);
					document.getElementById("audioSwitch").play();
				});
				cells = [];
				checkMatch();
			} 
			//if the previous sequence is not long enough and we find ball of another clour
			else {
				//update sequence and etalon
				cells = [];
				cells.push(cell);			 
				etalon = current;
			}
		}
		//change row & col
		currentRow = rowInc(currentRow);
		currentCol = colInc(currentCol);
	}

	//if the line checked - maybe the last ball was the 5th so we check the sequence && clear the line
	if(cells.length >= settings.lineLength) {
		updatePoints(cells);
		cells.forEach(cell => {
				var newPic = randomPicture(classes);
				var cellRow = parseInt(cell.id.charAt(0));
				var cellCol = parseInt(cell.id.slice(-1));
				animate(cell);
				gameBody[cellRow][cellCol]=newPic;
				updateImgs(cellRow, cellCol, newPic);
				document.getElementById("audioSwitch").play();
		});
		checkMatch();
	}
}

function animate(cell){
	//starts animation
	cell.animate([
	// keyframes
	{ 
	transform: 'translateY(0px)' }, 
	{ 
	transform: 'translateY(-400px)' }
	], {
	// timing options
		duration: 1500, iterations: 1 
	});
}

function updateImgs(row, col, pic){
	setTimeout(()=>{
		document.getElementById(row+"-"+col).style.backgroundImage = "url(assets/"+pic+".png)";
	}, 1400);
}


//keeps the frame for diagonal on the field between [0][0] and [8][8]
function checkPointIsValid(row, col) {
	return row >= 0 && row < 9 && col >= 0 && col < 9;
}

function updatePoints(cells){
	if (firstclick){
		if (cells.length === 3){
			points -= 15;
		} else if (cells.length === 4){
			points -= 25;
		} else if (cells.length === 5){
			points -= 35;
		}  else if (cells.length === 6){
			points -= 45;
		} else if (cells.length === 7){
			points -= 55;
		} else if (cells.length === 8){
			points -= 65;
		} else if (cells.length === 9){
			points -= 75;
		}
	}
	pointDisplay.innerHTML = "Points:"+ points;	
	if (points <= 0){
		youWin();
	}
}

//function defines a new game, taking into account mode
function newGame(){
	points = 500;
	firstclick = false;
	//update lost, win and block display as not visible
	lost.style.display = "none";
	wrapper.style.display = "none";
	win.style.display = "none";
	createNewDeck();
	startCountdown(60);
}



// // //==================================================Game Buttons Controls================================================


//controls play again button
document.getElementById("playAgain").addEventListener("click", function(){
	newGame();
	document.getElementById("adioPop").play();
});



//****************************************************************************
//Displays goal points in div
pointDisplay.innerHTML = "Goal:"+ points;
//creates new deck
createNewDeck();
//starts countows
startCountdown(60);







	

