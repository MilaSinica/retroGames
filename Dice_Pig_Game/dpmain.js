/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var infoText = document.getElementById("info-text");
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
var p1Panel = document.getElementById("container-pl1");
var p1Name = document.getElementById("name-0");

var p2ScDisplay = document.getElementById("score-1");
var p2Score = 0;
var roundScore = 0;
var p2CurrScDisplay = document.getElementById("current-1");
var p2Panel = document.getElementById("container-pl2");
var p2Name = document.getElementById("name-1");

var btnNewGame = document.getElementById("reset");
var btnRoll = document.getElementById("btn-roll");
var btnHold = document.getElementById("btn-hold");

var p1Turn = true;
var imgDice = document.getElementById("dice1");
var imgDice2 = document.getElementById("dice2");

var diceValues = [1, 2, 3, 4, 5, 6];
var randRoll;
var randRoll2;


var firstRoll = false;
//========================================================================================================
imgDice.style.backgroundImage = "url(assets/dice-6.png)";
imgDice2.style.backgroundImage = "url(assets/dice-6.png)";

var gamePlaying = true;
console.log("gamePlaying = true");

function goalScoreF(){
	var input = document.getElementById("input").value;
		//null, undefined, "" and 0 are coerced to FALSE!!!!!!!!!!!!!!!
		//anithing else == true!
	var goalScore;
	if(input){
		goalScore = input;
	} else {
		goalScore = 30;
	}
	return goalScore;
}


function computerRoll(){
	if(!p1Turn && gamePlaying){
		if(!p1Turn){
			setTimeout(function(){
				generateRandomRoll();
				if(!p1Turn && roundScore <= 10 && (roundScore + p2Score < 30)){
					setTimeout(function(){
						generateRandomRoll();
						if(!p1Turn){
							setTimeout(onHoldClick, 1000);	
						}
					}, 1000);
				} else if(!p1Turn){
					setTimeout(onHoldClick, 1000);	
				}
			}, 1000);
		}	
	}
}

function onRollClick(){
	if (gamePlaying){
		firstRoll = true;
		generateRandomRoll();
	}
}

function diceIt(){
	document.getElementById("audioDice").play();
	imgDice.style.backgroundImage = "url(assets/dice-" + randRoll + ".png)";
	imgDice2.style.backgroundImage = "url(assets/dice-" + randRoll2 + ".png)";
}

function displayScore(){
	if (p1Turn === true){
		p1CurrScDisplay.innerHTML = roundScore;
	} else {
		p2CurrScDisplay.innerHTML = roundScore;
	}
}

function newGame(){
	btnNewGame.innerHTML = "New Game";
	document.getElementById("adioPop").play();
	p1Score = 0;
	p2Score = 0;
	p1ScDisplay.innerHTML = p1Score;
	p2ScDisplay.innerHTML = p2Score;
	p1CurrScDisplay.innerHTML = 0;
	p2CurrScDisplay.innerHTML = 0;
	p2Panel.classList.remove("active");
	p1Panel.classList.add("active");
	p1Name.innerHTML = "Player";
	p2Name.innerHTML = "Computer";
	p2Panel.classList.remove("winner");
	p1Panel.classList.remove("winner");
	gamePlaying = true;
	console.log("gamePlaying = true");
	infoText.innerHTML = "Roll dice!";
	roundScore = 0;
	firstRoll = false;
}


function onHoldClick(){
	var goalScore= goalScoreF();
	console.log("hold clicked");
	if (gamePlaying){
		if (p1Turn) {
			infoText.innerHTML = "Computer turn!";
		} else {
			infoText.innerHTML = "Your turn!";
		}
		afterHoldClick();
		document.getElementById("adioPop").play();
		if (p1Score >= goalScore ){
			document.getElementById("audioWin").play();
			p1Name.innerHTML = "WINNER!";
			win();
			p1Panel.classList.add("winner");
		} else if (p2Score >= goalScore ) {
			document.getElementById("audioLost").play();
			p2Name.innerHTML = "WINNER!";
			win();
			p2Panel.classList.add("winner");
		}
		roundScore = 0;
	}
}

function afterHoldClick(){
	var goalScore= goalScoreF();
	if (p1Turn === true) {
		p1Turn = false;	
		console.log("p1False");
		anotherPlayer();
		p1Score += roundScore;
		p1ScDisplay.innerHTML = p1Score;
		if(p1Score < goalScore && p2Score < goalScore){
			computerRoll();
		}
	} else {
		anotherPlayer();
		p2Score += roundScore;
		p2ScDisplay.innerHTML = p2Score;
		p1Turn = true;	
		console.log("p1True");
	}
}

function win(){
	if(p1Turn){
		infoText.innerHTML = "You lost!";
	} else{
		infoText.innerHTML = "You won!";
	}
	btnNewGame.innerHTML = "Play Again?";
	p1Turn = true;
	console.log("p1True");
	imgDice.style.backgroundImage = "url(assets/dice-6.png)";
	imgDice2.style.backgroundImage = "url(assets/dice-6.png)";
	p2Panel.classList.remove("active");
	p1Panel.classList.remove("active");
	gamePlaying = false;
	console.log("gamePlaying = false WIN");
}

function anotherPlayer(){
	if (p1Turn === true) {
		p1Panel.classList.toggle("active");
		p2Panel.classList.toggle("active");
		p1CurrScDisplay.innerHTML = 0;

	} else {
		p2Panel.classList.toggle("active");
		p1Panel.classList.toggle("active");
		p2CurrScDisplay.innerHTML = 0;
	}
}


function generateRandomRoll(){
	console.log("random roll");
	if (gamePlaying){
		randRoll = Math.floor(Math.random() * 6) + 1;
		randRoll2 = Math.floor(Math.random() * 6) + 1;
		if ((randRoll === 1 || randRoll2 === 1) && p1Turn){
			oneRoll();
			p1Turn = false;
			console.log("p1False");
			computerRoll();
		} else if((randRoll === 1 || randRoll2 === 1) && !p1Turn){
			oneRoll();
			p1Turn = true;
			console.log("p1True");
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

function oneRoll(){
	console.log("1 rolled");
	document.getElementById("audioWrong").play();	
	anotherPlayer();
	imgDice.style.backgroundImage = "url(assets/dice-" + randRoll + ".png)";
	imgDice2.style.backgroundImage = "url(assets/dice-" + randRoll2 + ".png)";
	roundScore = 0;
	if (p1Turn === true){
		p1CurrScDisplay.innerHTML = 0;
		infoText.innerHTML = "Computer turn!";
	} else {
		p2CurrScDisplay.innerHTML = 0;
		infoText.innerHTML = "Your turn!";
	}
}



//***********************************************************

//==========================================================================================================
btnHold.addEventListener("click", function(){
	if (p1Turn){
		onHoldClick();
	}
});
btnRoll.addEventListener("click", function(){
	if (p1Turn){
		onRollClick();
	}
});
btnNewGame.addEventListener("click", function(){
	if (p1Turn){
		newGame();
	}
});

