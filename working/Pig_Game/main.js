/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var p1ScDisplay = document.getElementById("score-0");
var p1Score = 0;

//OR
// var playerScore = [0, 0];
// var activePlayer = 0; 
//var ScDisplay = document.getElementById("score-" + activePlayer);
// var CurrScDisplay = document.getElementById("current-" + activePlayer);
// var Panel =  document.getElementsByClassName("player-" + activePlayer + "-panel")[0];
//var Name = document.getElementById("name-" + activePlayer);

var p1CurrScDisplay = document.getElementById("current-0");
var p1Panel = document.getElementsByClassName("player-0-panel")[0];
var p1Name = document.getElementById("name-0");

var p2ScDisplay = document.getElementById("score-1");
var p2Score = 0;
var roundScore = 0;
var p2CurrScDisplay = document.getElementById("current-1");
var p2Panel = document.getElementsByClassName("player-1-panel")[0];
var p2Name = document.getElementById("name-1");

var btnNewGame = document.getElementsByClassName("btn-new")[0];
var btnRoll = document.getElementsByClassName("btn-roll")[0];
var btnHold = document.getElementsByClassName("btn-hold")[0];
var help = document.getElementById("help");
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

var p1Turn = true;
var imgDice = document.getElementsByClassName("dice")[0];
var imgDice2 = document.getElementsByClassName("dice2")[0];

var diceValues = [1, 2, 3, 4, 5, 6];
var randRoll;
var randRoll2;

//logo link to main menu, which blinks
var logo = document.getElementById("logo");
var logo2 = document.getElementById("logo2");
var logo3 = document.getElementById("logo3");
var checkWhichLogo = true;


//========================================================================================================
imgDice.style.display = "none";
imgDice2.style.display = "none";
var gamePlaying = true;

function onRollClick(){
	if (gamePlaying){
		generateRandomRoll();
		imgDice.style.display = "block";
		imgDice2.style.display = "block";
		if (randRoll === 1 || randRoll2 === 1 ){
			document.getElementById("audioWrong").play();	
			anotherPlayer();
			imgDice.src = "assets/dice-" + randRoll + ".png";
			imgDice2.src = "assets/dice-" + randRoll2 + ".png";
			roundScore = 0;
			if (p1Turn === true){
				p1CurrScDisplay.innerHTML = 0;
			} else {
				p2CurrScDisplay.innerHTML = 0;
			}
		} else if(randRoll === randRoll2){
			diceIt();
			roundScore += randRoll*4;
			displayScore();
		} else {
			diceIt();
			roundScore += (randRoll + randRoll2);
			displayScore();
		}
	}
}

function diceIt(){
	document.getElementById("audioDice").play();
	imgDice.src = "assets/dice-" + randRoll + ".png";
	imgDice2.src = "assets/dice-" + randRoll2 + ".png";
}

function displayScore(){
	if (p1Turn === true){
		p1CurrScDisplay.innerHTML = roundScore;
	} else {
		p2CurrScDisplay.innerHTML = roundScore;
	}
}

function newGame(){
	document.getElementById("adioPop").play();
	p1Score = 0;
	p2Score = 0;
	p1ScDisplay.innerHTML = p1Score;
	p2ScDisplay.innerHTML = p2Score;
	p1CurrScDisplay.innerHTML = 0;
	p2CurrScDisplay.innerHTML = 0;
	p2Panel.classList.remove("active");
	p1Panel.classList.add("active");
	p1Turn = true;
	p1Name.innerHTML = "PLAYER 1";
	p2Name.innerHTML = "PLAYER 2";
	p2Panel.classList.remove("winner");
	p1Panel.classList.remove("winner");
	gamePlaying = true;
	roundScore = 0;
}

function onHelpClick(){
	document.getElementById("adioPop").play();
	// When the user clicks the button, open the modal 
	modal.style.display = "block";
}

function onHoldClick(){
	if (gamePlaying){
		afterHoldClick();
		document.getElementById("adioPop").play();
		var input = document.getElementById("input").value;
		var goalScore;
		//null, undefined, "" and 0 are coerced to FALSE!!!!!!!!!!!!!!!
		//anithing else == true!
		if(input){
			goalScore = input;
		} else {
			goalScore = 30;
		}

		if (p1Score >= goalScore ){
			document.getElementById("audioWin").play();
			p1Name.innerHTML = "WINNER!";
			win();
			p1Panel.classList.add("winner");
		} else if (p2Score >= goalScore ) {
			document.getElementById("audioWin").play();
			p2Name.innerHTML = "WINNER!";
			win();
			p2Panel.classList.add("winner");
		}
		roundScore = 0;
	}
}

function afterHoldClick(){
	if (p1Turn === true) {
		anotherPlayer();
		p1Score += roundScore;
		p1ScDisplay.innerHTML = p1Score;
		p1Turn = false;	
	} else {
		anotherPlayer();
		p2Score += roundScore;
		p2ScDisplay.innerHTML = p2Score;
		p1Turn = true;	
	}
}

function win(){
	imgDice.style.display = "none";
	imgDice2.style.display = "none";
	p2Panel.classList.remove("active");
	p1Panel.classList.remove("active");
	gamePlaying = false;
}

function anotherPlayer(){
	if (p1Turn === true) {
		p1Turn = false;
		p1Panel.classList.toggle("active");
		p2Panel.classList.toggle("active");
		p1CurrScDisplay.innerHTML = 0;

	} else {
		p1Turn = true;
		p2Panel.classList.toggle("active");
		p1Panel.classList.toggle("active");
		p2CurrScDisplay.innerHTML = 0;
	}
}
// function generateRandomRoll(){
// 	randRoll = parseInt(diceValues[Math.floor(Math.random() * diceValues.length)]);
// }
//OR
function generateRandomRoll(){
	randRoll = Math.floor(Math.random() * 6) + 1;
	randRoll2 = Math.floor(Math.random() * 6) + 1;
}

//===========================================Modal===============================================================
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	// document.getElementById("adioPop").play();
    modal.style.display = "none";
    document.getElementById("adioPop").play();
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("adioPop").play();
    }
}

//***********************************************************
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


//==========================================================================================================
btnHold.addEventListener("click", onHoldClick);
btnRoll.addEventListener("click", onRollClick);
btnNewGame.addEventListener("click", newGame);
help.addEventListener("click", onHelpClick);

