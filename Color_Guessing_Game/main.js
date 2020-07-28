var square = document.querySelectorAll(".square");
var colors = randomColor(6);
var header = document.getElementById("header");
var goal = randomChoose();
var textDisplay = document.getElementById("textDisplay");
var guessCount;

//div, which says "lose"/"win" and is placed over screen
var gameOff = document.getElementById("gameOver");
//DOM element where RGB goal value is displayed
var result = document.getElementById("result");
// Get the modal
var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var playAgain = document.getElementById("playAgain");

var easy = document.getElementById("easy");
var hard = document.getElementById("hard");
var help = document.getElementById("help");
var mode = document.getElementsByClassName("mode");
//default mode value
var easyMode = false;

//==================================================Game initialization================================================
function init (){
	//erases all previous displays and updates display information
	gameOff.style.display = "none";
	wrapper.style.display = "none";
	guessCount = 2;
	textDisplay.textContent =  "Guesses: " + guessCount;

	for (i = 0; i < square.length; i++){
		//add colors to squares
		square[i].style.backgroundColor = colors[i];
		//add click listeners to squares
		square[i].addEventListener("click", function(){
		//saves background color of slected element to var
			var clickedColor = this.style.backgroundColor;
		//compare picked color to goal color, changes bck color, changes square colors and says "correct"
			if (clickedColor === goal){
				header.style.backgroundColor = goal;
				textDisplay.textContent = "Correct!";
				changeSquareColor(goal);
				playAgain.textContent = "Play again?";
				document.getElementById("audioWin").play();
				gameOff.innerHTML = "YOU WON"
				gameOff.style.display = "block";
				wrapper.style.display = "block";
				guessCount = 2;
		//changes square colors to transperent (erase them) and says "try again"
			} else {
				this.style.backgroundColor = "#232323";
				guessCount -= 1;
				textDisplay.textContent =  "Guesses: " + guessCount;
					//play sound
				document.getElementById("audioMissed").play();	
			}
			if (guessCount < 1) {
				header.style.backgroundColor = goal;
				gameOff.innerHTML = "YOU LOST"
				playAgain.textContent = "Play again?";
				gameOff.style.display = "block";
				//block any additional action with the game
				wrapper.style.display = "block";
				textDisplay.textContent =  "Guesses: " + guessCount;
				//play sound
				document.getElementById("audioLost").play();
				guessCount = 2;
			}

		})
	}
}



//=============================================Generates new random colors and change square color====================
//function changes all square color to picked color
function changeSquareColor(color){
	for (i = 0; i < square.length; i++){
				square[i].style.backgroundColor = color;
			}
}

//function generates random number to select random goal color
function randomChoose(){
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

function randomColor(numberOfColors){
	//make an array with selected numberOfColors and return these random colors as an array
	var arr = [];
	for (i = 0; i < numberOfColors; i++){
		arr.push(generateRandomRgb());
		}
	return arr;
}

//generates random color and return its value in a format rgb(x, x, x)
function generateRandomRgb(){
	var randomNum1 = Math.floor(Math.random() * 256);
	var randomNum2 = Math.floor(Math.random() * 256);
	var randomNum3 = Math.floor(Math.random() * 256);
	return "rgb(" + randomNum1 + ", " + randomNum2 + ", " + randomNum3 + ")";
}

//================================================Button Control=====================================================
//controls new game button
playAgain.addEventListener("click", function(){
	document.getElementById("adioPop").play();
	//checks if easy or hard mode is on and starts a new game
	if (easyMode == true){
		newGameEasy();
	} else {
		newGameHard();
	}
})

//controlling hard button to start a new game in an easy mode
easy.addEventListener("click", function(){
	document.getElementById("adioPop").play();
	//changing button colors
	easy.classList.add("active");
	hard.classList.remove("active");
	help.classList.remove("active");
	//starts new game
	newGameEasy()
});

//controlling hard button to start a new game in a hard mode
hard.addEventListener("click", function(){
	document.getElementById("adioPop").play();
	//changing button colors
	hard.classList.add("active");
	easy.classList.remove("active");
	help.classList.remove("active");
	
	//starts new game
	newGameHard();
	});


//==================================================New Game Functionality===============================
function reset(NumOfColors){
	//create 3 or 6 random colors
	colors = randomColor(NumOfColors);
	//pick one as a goal color
	goal = randomChoose();
	//displays guesses count in browser
	textDisplay.textContent =  "Guesses: " + guessCount;
	//erases all blocking divs 
	gameOff.style.display = "none";
	wrapper.style.display = "none";
	//displaying new goal color above
	result.textContent = goal;
	//changing squares to 2 or 5 random colors and 1 goal color
	for (i = 0; i < square.length; i++){
	//add colors to squares
		square[i].style.backgroundColor = colors[i];
	}
	//erasing previous game win results to default
	playAgain.textContent = "New colors";
	header.style.backgroundColor = "#009896";
}


function newGameHard(){
	//start a new game by generating new 6 colors and picking new color 
	reset(6);
	for (i = 0; i < square.length; i++){
	//show all 6 squares (erasing easy mode changes)	
		square[i].style.display = "block";
	}
	//pointing game mode to start a new game in the same mode
	easyMode = false;
}

function newGameEasy(){
	//start a new game by generating new 3 colors and picking new color 
	reset(3);
	//hide 3 other squares
	for (i = 3; i<square.length; i++){
		square[i].style.display = "none";
	}
	//pointing game mode to start a new game in the same mode
	easyMode = true;
}


//***********************************************************
//displays goal RGB value
result.textContent = goal; 
//initializes the game
init();
