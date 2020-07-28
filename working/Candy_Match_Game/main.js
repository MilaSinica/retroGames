//var to store newly created by JS <p>
var square;
//classes responsible for creating food picture background
var classes = ["donut", "strawberry", "candy", "cupcake", "macaron", "icecream", "cookie"];

//logo link to main menu, which blinks
var logo = document.getElementById("logo");
var logo2 = document.getElementById("logo2");
var logo3 = document.getElementById("logo3");
var checkWhichLogo = true;

//var used to attach shuffeled pictures to squares
var shuffeledPictures;
//in witch <p> are created
var container = document.getElementById("container");
//previous selected picture`s class
var previous = "";
//previous selected picture
var previousPicture ="";
//this time selected picture`s class
var current;
//this time selected picture`s class
var currentPicture;
var currentPictureIndex;
var previousPictureIndex;

//empty div on top, which blocks any actions after the game is over
var wrapper = document.getElementById("wrapper");
//div, which says "win" and is placed over screen after you win
var win = document.getElementById("win");
//div, which says "lose" and is placed over screen after you lose
var lost = document.getElementById("lost");

var newPictures;
//selects all images without class(empty squares)
var withoutClass = document.getElementsByClassName("none");
//help span
var help = document.getElementById("help");
// Get the modal
var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//variables to detect picture match in a row and column
var currentSquare;
var previousSquareH;
var prepreviousSquareH;
var preprepreviousSquareH;
var prepreprepreviousSquareH;
var previousSquareV;
var prepreviousSquareV;
var preprepreviousSquareV;
var prepreprepreviousSquareV;

//default starting value of points
var points = 200;
var pointDisplay = document.getElementById("points");
var counterDisplay = document.getElementById("counter");
//counter to know how any correctly guessed pictures dissapeared
var count = 0;
//counter for countdoqn till the game is over
var counter;
//current counter value
var currentTick;

var gameOn = true;

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
//=======================Block responsible for logo blinking and hover effect==================================================

//initiates logo blinking
var logoChange = setInterval(changeLogo, 1000);
//change logo on hover by hiding all other logos and stopping interval
function logoChangeOnMouseEnter() {
	logo.style.display = "none";
	logo2.style.display = "none";
	logo3.style.display = "inline-block";
	clearInterval(logoChange);
}
//make onhover work for both color logo images
logo.addEventListener("mouseover", logoChangeOnMouseEnter);
logo2.addEventListener("mouseover", logoChangeOnMouseEnter);
//after unhovering - initiates blinking again
logo3.addEventListener("mouseout", function(){
	logoChange = setInterval(changeLogo, 1000);
})
logo3.addEventListener("click", function(){
	document.getElementById("adioPop").play();
	window.location.href = "../index.html";
})
//function checks which logo is displayed now and shows the next one
function changeLogo(){
	if (checkWhichLogo === true){
		logo.style.display = "none";
		logo3.style.display = "none";
		logo2.style.display = "inline-block";
		checkWhichLogo = false;
	} else {
		logo.style.display = "inline-block";
		logo2.style.display = "none";
		logo3.style.display = "none";
		checkWhichLogo = true;
	}
}

//============================Block responsible for new image creation=======================================
//check if a picture is already in the array (no repetitions in a game)
function in_array(array, el) {
   for(var i = 0 ; i < array.length; i++) 
   	//if in array - return true, if not - false
       if(array[i] == el) return true;
   return false;
}

//select specific number of pictures of all pictures
function randomPictureSelection(numberOfPictures, listOfPictures){
	//create array and counts how many pictures are already in the array
	var arr = [];
	var countAdded = 0;
	//loops while in the array is less pictures than required by mode
	while (countAdded < numberOfPictures){
		//generates random number between 1 and number of all classes
		var index = Math.floor(Math.random()*listOfPictures.length);
		//specific picture in the loop cycle
		var picture = listOfPictures[index];
		//if this picture is already in the array - do nothing, if not - push to the array
		if (!in_array(arr, picture)){
			arr.push(picture);
			//update counter of images in the array
			countAdded++;
		}
	}
	return arr;
}

//function shuffles all generated pictures in the array in random order
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//===================================================Game Over and Win=====================================================
//executed when the game is over
function gameOver(){
	//stop countdown and reset counter
	stopCountdown();
	//display words "you lost"
	lost.style.display = "block";
	//block any additional action with the game
	wrapper.style.display = "block";
	//play sound
	document.getElementById("audioLost").play();
	gameOn = false;
}
//executes when the game is won
function youWin(){
	//displays word "win" and blocks any additional actions
	win.style.display = "block";
	wrapper.style.display = "block";
	//stops counter and plays sound
	stopCountdown();
	document.getElementById("audioWin").play();
	gameOn = false;
}


//============================================New Game initialization============================================
function createPictures(numberOfPictures){
	//Every image/class is repeated 11 times
	var pictureCreationNumber = Math.floor(numberOfPictures / 11);
	//this part generates new pictures using function...
	var pictures = randomPictureSelection(pictureCreationNumber, classes);
	//...connects 2 copies together...
	var doublePictures = pictures.concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures).concat(pictures);
	//...using function shuffles them, so they are in a random order
	shuffeledPictures = shuffle(doublePictures);

	//generates all squares (<p>). First cleans all previos squares
	container.innerHTML = "";
	//creates <p> count same as picture count
	for (i = 0; i < numberOfPictures; i++){
		var p = document.createElement("p");
		//adds i id to every square
		p.id = i;
		//push <p> to cointainer div
		container.appendChild(p);
	}
	//selectes just crated <p> - squares
	square = document.getElementsByTagName("p");
}

//gets <p> numerical index in container div
function whichChild(elem){
    var  i= 0;
    while((elem=elem.previousSibling)!=null) ++i;
    return i;
}

//function defines a new game, taking into account mode
function init(numberOfPictures){
	gameOn = true;
	points = 200;
	//previous selected picture`s class
	previous = "";
	//previous selected picture
	previousPicture ="";
	//this time selected picture`s class
	current;
	//this time selected picture`s class
	currentPicture;
	//counter to know how any correctly guessed pictures dissapeared
	count = 0;
	//update lost, win and block display as not visible
	lost.style.display = "none";
	wrapper.style.display = "none";
	win.style.display = "none";
	//creates new <p> and generates random pictures
	createPictures(numberOfPictures);
	//add to every square image and covers it with default class style to hide it
	for (i = 0; i < square.length; i++){
		square[i].classList.add(shuffeledPictures[i]);
		//add click listeners to squares
		square[i].addEventListener("click", function(){	
			document.getElementById("audioClick").play();
			//gives selected img border
			this.style.border = "2px solid white";
			//defines urrently selected item`s class/image
			current = this.classList.value;
			//defines urrently selected item itself
			currentPicture = this;
			//gets current and previous picture`s numerical index in container
			currentPictureIndex = whichChild(currentPicture) + 1;
			previousPictureIndex = whichChild(previousPicture) + 1;
//=======================Swip 2 pictures===============================================
			//lets swip two images only if they are located next to each other
			if (count % 2 !== 0 && (currentPictureIndex + 1 === previousPictureIndex || currentPictureIndex - 1 === previousPictureIndex
				|| currentPictureIndex -9 === previousPictureIndex || currentPictureIndex + 9 === previousPictureIndex) 
				&& currentPictureIndex - 1 !== previousPictureIndex - 1) {	
				//swips class names to change pictures
				currentPicture.className = "";
				previousPicture.className = "";
				currentPicture.classList.add(previous);
				previousPicture.classList.add(current);
				//erases border after images has swiped
				for (x = 0; x < square.length; x++) {
					square[x].style.border = "2px solid  #232323";
				}
			} 
			//doesn`t swip images and updates previously clicked image info
			else {
				previous = current;
				previousPicture  = currentPicture;	
			}
			//if 2 selected images did not swiped - erases border
			if (count > 0 && count % 2 !== 0) {
				for (x = 0; x < square.length; x++) {
					square[x].style.border = "2px solid #232323";
				}
			}
			//updates counter of moves
			count++;
		})
	}
	startCountdown(60);
}


//========================================Checks Matched Pictures, Delets Them and Replaces===========================================
//checks if there are matched pictures in a row
function checkMatchInLine(){
	if (gameOn){
		for (k = 0; k < square.length; k++){
			//LENGTH CHANGES!!!!!!!!!!!!
			var len = square.length;
			//gets info about 5 pictures in a row by horizontal and vertical line
			currentSquare = square[k];
			previousSquareH = square[(k+len-1)%len];
			prepreviousSquareH = square[(k+len-2)%len];
			preprepreviousSquareH = square[(k+len-3)%len];
			prepreprepreviousSquareH = square[(k+len-4)%len];
			previousSquareV = square[(k+len-9)%len];
			prepreviousSquareV = square[(k+len-18)%len];
			preprepreviousSquareV = square[(k+len-27)%len];
			prepreprepreviousSquareV = square[(k+len-36)%len];
			//checks if goal is achieved and shoess win display with music
			if (points <= 0){
				youWin();
			}
			//checkes match in a row or column in 3 conditions: 5, 4 or 3 match in horizontal dimension 
			if (currentSquare.className === previousSquareH.className && 
				previousSquareH.className === prepreviousSquareH.className && 
				prepreviousSquareH.className === preprepreviousSquareH.className 
				&& preprepreviousSquareH.className === prepreprepreviousSquareH.className){
				removeFiveHorizontal();
				console.log("5");
			} else if (previousSquareH.className === prepreviousSquareH.className && 
				prepreviousSquareH.className === preprepreviousSquareH.className && 
				preprepreviousSquareH.className === prepreprepreviousSquareH.className){
				removeFourHorizontal();
				console.log("4");
			} else if (prepreviousSquareH.className === preprepreviousSquareH.className && 
				preprepreviousSquareH.className === prepreprepreviousSquareH.className) {
				removeThreeHorizontal();
				console.log("3");
			}
			//checkes match in a row or column in 3 conditions: 5, 4 or 3 match in vertical dimension 
			if (currentSquare.className === previousSquareV.className && 
				previousSquareV.className === prepreviousSquareV.className && 
				prepreviousSquareV.className === preprepreviousSquareV.className 
				&& preprepreviousSquareV.className === prepreprepreviousSquareV.className){
				removeFiveVertical();
				console.log("5");
			} else if (previousSquareV.className === prepreviousSquareV.className && 
				prepreviousSquareV.className === preprepreviousSquareV.className && 
				preprepreviousSquareV.className === prepreprepreviousSquareV.className){
				removeFourVertical();
				console.log("4");
			} else if (prepreviousSquareV.className === preprepreviousSquareV.className && 
				preprepreviousSquareV.className === prepreprepreviousSquareV.className) {
				removeThreeVertical();
				console.log("3");
			}
		}
	}
}
//If 3 images match by horizontal - removes them
function removeThreeHorizontal(){
	prepreviousSquareH.className = "none";
	preprepreviousSquareH.className = "none";
	prepreprepreviousSquareH.className = "none";
	//gets info about deleted picture
	var numberOfP = withoutClass.length;
	//replaces them
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	//updates points counter and display, plays music
	points -= 5;
	pointDisplay.innerHTML = "Goal:"+ points;
	document.getElementById("audioSwitch").play();
}
//If 3 images match by vertical - removes them
function removeThreeVertical(){
	prepreviousSquareV.className = "none";
	preprepreviousSquareV.className = "none";
	prepreprepreviousSquareV.className = "none";
	//gets info about deleted picture
	var numberOfP = withoutClass.length;
	//replaces them
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	//updates points counter and display, plays music
	points -= 5;
	pointDisplay.innerHTML = "Goal:"+ points;
	document.getElementById("audioSwitch").play();
}
//If 4 images match by horizontal - removes them
function removeFourHorizontal(){
	previousSquareH.className = "none";
	prepreviousSquareH.className = "none";
	preprepreviousSquareH.className = "none";
	//gets info about deleted picture
	prepreprepreviousSquareH.className = "none";
	var numberOfP = withoutClass.length;
	//replaces them
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	//updates points counter and display, plays music
	points -= 15;
	pointDisplay.innerHTML = "Goal:"+ points;
	document.getElementById("audioSwitch").play();
}
//If 4 images match by vertical - removes them
function removeFourVertical(){
	previousSquareV.className = "none";
	prepreviousSquareV.className = "none";
	preprepreviousSquareV.className = "none";
	prepreprepreviousSquareV.className = "none";
	//gets info about deleted picture
	var numberOfP = withoutClass.length;
	//replaces them
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	//updates points counter and display, plays music
	points -= 15;
	pointDisplay.innerHTML = "Goal:"+ points;
	document.getElementById("audioSwitch").play();
}
//If 5 images match by horizontal - removes them
function removeFiveHorizontal(){
	currentSquare.className = "none";
	previousSquareH.className = "none";
	prepreviousSquareH.className = "none";
	preprepreviousSquareH.className = "none";
	prepreprepreviousSquareH.className = "none";
	//gets info about deleted picture
	var numberOfP = withoutClass.length;
	//replaces them
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	//updates points counter and display, plays music
	points -= 25;
	pointDisplay.innerHTML = "Goal:"+ points;
	document.getElementById("audioSwitch").play();
}
//If 5 images match by vertical - removes them
function removeFiveVertical(){
	currentSquare.className = "none";
	previousSquareV.className = "none";
	prepreviousSquareV.className = "none";
	preprepreviousSquareV.className = "none";
	prepreprepreviousSquareV.className = "none";
	//gets info about deleted picture
	var numberOfP = withoutClass.length;
	//replaces them
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	replaceRemovedPictures(numberOfP);
	//updates points counter and display, plays music
	points -= 25;
	pointDisplay.innerHTML = "Goal:"+ points;
	document.getElementById("audioSwitch").play();
}
//Replaces removed picture with random new pictures
function replaceRemovedPictures(numberOfPictures){
	//this part generates new pictures using function...
	newPictures = randomPictureSelection(numberOfPictures, classes);
	//assigns new class to empty squares
	for (i = 0; i < withoutClass.length; i++){
		withoutClass[i].className = newPictures[i];
	}
}

//==================================================Game Buttons Controls================================================

//controls new game button
function playAgain(){
	//starts new game with 18 pictures/squares and gives 30 seconds
	init(81);
}

//controls help button
function onHelpClick(){
	document.getElementById("adioPop").play();
	// When the user clicks the button, open the modal 
	modal.style.display = "block";
}

//controls play again button
document.getElementById("playAgain").addEventListener("click", function(){
	playAgain();
	document.getElementById("adioPop").play();
});

//===========================================Modal===============================================================
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	document.getElementById("adioPop").play();
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("adioPop").play();
    }
}

//***********************************************************

//Displays goal points in div
pointDisplay.innerHTML = "Goal:"+ points;

//controlling buttons to exucute correct function
help.addEventListener("click", onHelpClick);

//starts new game in hard mode when the page is loaded
playAgain();

//every 0,01 second checks for match in a game
var interval = setInterval(checkMatchInLine, 10);




	

