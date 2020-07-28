/*
GAME RULES:

- Play this Simon game and have fun testing your memory
- Simon lights one of the coloured pads and sounds a tone, then two, then three, etc.
- Player attempts to match Simon by pressing the pads in the proper sequence
- If player fails, he loses a life, if lifes run out - the game is over
- Game HARD MODE has 20 rounds, that means that in the last round player needs to repeat 20 signals, and only 2 lives - player has only one chance for a mistake
- There are 10 rounds in the EASY MODE and 3 lives to lose
- Rack up high scores, improve your memory and enjoy this classic game 

*/



//========================================================================================================

let order = []; //tracks order of lights
let playerOrder = []; 
let flash; //integer - number of flashes
let turn; //what turn is it
let good; //bool - is player write or wrong
let compTurn; //bool - whos turn is it
let intervalId;//
let hardMode = true; //bool for the mode
let noise = true; //bool for sound
let win; //bool for if the player has won
let on = false; //tracks if the game is on
let lives = 1;

const turnCounter = document.querySelector("#turn");
const topLeft = document.querySelector("#topleft");
const topRight = document.querySelector("#topright");
const bottomLeft = document.querySelector("#bottomleft");
const bottomRight = document.querySelector("#bottomright");
const hard = document.querySelector("#hard");
const easy = document.querySelector("#easy");
const start = document.querySelector("#start");
const livesCounter = document.querySelector("#lives");
const newGame = document.querySelector("#reset");


function onHardClick() {
	easy.classList.remove("active");
	hard.classList.add("active");
	document.getElementById("adioPop").play();
	hardMode = true;
	onNewGameClick();
};

function onEasyClick() {
	hard.classList.remove("active");
	easy.classList.add("active");
	document.getElementById("adioPop").play();
	hardMode = false;
	onNewGameClick();
};

function onNewGameClick(){
	document.getElementById("adioPop").play();
	clearColor();
	noise = true;
	turnCounter.innerHTML  = "ROUND: - ";
	livesCounter.innerHTML = "LIVES: - ";
}

function onStartClick(){
	document.getElementById("adioPop").play();
	noise = true;
	//if (on || win)
		play();
}

//new game
function play(){
	//reset all variables
	clearInterval(intervalId);
	win = false;
	if(hardMode){
		lives = 2;
	}else {
		lives = 3;
	}
	order = [];
	playerOrder = [];
	flash = 0;
	intervalId = 0;
	turn = 1;
	turnCounter.innerHTML  = "ROUND: " + "1";
	livesCounter.innerHTML = "LIVES: " + lives;
	good = true;

	//fill order array with new random sequence of colors
	for (i=0; i<20; i++){
		order.push(Math.floor(Math.random()*4)+1);
	}

	compTurn = true;
	//runs game functon every 800 milliseconds to play the sequence automatically
	intervalId = setInterval(gameTurn, 800);
}

function gameTurn(){
	on = false; //doesn`t let player to push buttons while the sequence is played

	if (flash == turn){
		clearInterval(intervalId);
		compTurn = false;
		clearColor();
		on = true;
	}

	if (compTurn){
		clearColor();
		setTimeout(()=>{
			if (order[flash] == 1){
				one();
			}
			if (order[flash] == 2){
				two();
			}
			if (order[flash] == 3){
				three();
			}
			if (order[flash] == 4){
				four();
			}
			flash++;
		}, 200);
	}
}

function one(){
	if (noise){
		let audio = document.getElementById("clip1");
		audio.play();
	}
	if (good) {
		noise = true;
	}
	topLeft.style.backgroundColor = "#00d989";
}

function two(){
	if (noise){
		let audio = document.getElementById("clip2");
		audio.play();
	}
	if (good) {
		noise = true;
	}
	topRight.style.backgroundColor = "#ff71a2";
}

function three(){
	if (noise){
		let audio = document.getElementById("clip3");
		audio.play();
	}
	if (good) {
		noise = true;
	}
	bottomLeft.style.backgroundColor = "#fff590";
}

function four(){
	if (noise){
		let audio = document.getElementById("clip4");
		audio.play();
	}
	if (good) {
		noise = true;
	}
	bottomRight.style.backgroundColor = "#2ef0ff";
}

function flashColor(){
	topLeft.style.backgroundColor = "#00d989";
	topRight.style.backgroundColor = "#ff71a2";
	bottomLeft.style.backgroundColor = "#fff590";
	bottomRight.style.backgroundColor = "#2ef0ff";
}

function clearColor(){
	topLeft.style.backgroundColor = "#009860";
	topRight.style.backgroundColor = "#ed3b72";
	bottomLeft.style.backgroundColor = "#dbcf58";
	bottomRight.style.backgroundColor = "#009896";
}

function onTopLeftClick(){
	if(on){
		playerOrder.push(1);
		check();
		one();
		afterPlayerAction();
	}
};

function onTopRightClick(){
	if(on){
		playerOrder.push(2);
		check();
		two();
		afterPlayerAction()
	}
};

function onBottomLeftClick(){
	if(on){
		playerOrder.push(3);
		check();
		three();
		afterPlayerAction();
	}
};

function onBottomRightClick(){
	if(on){
		playerOrder.push(4);
		check();
		four();
		afterPlayerAction();
	}
};

function afterPlayerAction(){
	if(!win){
		setTimeout(()=>{
			clearColor();
		}, 300);
	}
}

function check(){
	if(playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]){
		good = false;
		document.getElementById("audioWrong").play();
	}

	if(playerOrder.length === 10 && good && !hardMode){
		winGame();
	}

	if(playerOrder.length === 20 && good && hardMode){
		winGame();
	}

	if (!good){
		flashColor();
		setTimeout(()=>{
			if(lives === 1){
				turnCounter.innerHTML = "GAME OVER";
				livesCounter.innerHTML = "";
				noise = false;
				on = false;
				document.getElementById("audioLost").play();
			} else {
				lives--;
				livesCounter.innerHTML = "LIVES: " + lives;
				repeat();
			}
			clearColor();
		}, 800);
		//noise = false;
	}
	if (turn == playerOrder.length && good && !win){
		turn ++;
		repeat();
	}
}

function repeat(){
	compTurn = true;
	on = false;
	flash = 0;
	playerOrder = [];
	good = true;
	setTimeout(()=>{
		turnCounter.innerHTML = "ROUND: " + turn
	}, 200);
	intervalId = setInterval(gameTurn, 800);
}

function winGame(){
	flashColor();
	document.getElementById("audioWin").play();
	turnCounter.innerHTML  = "YOU WiN!";
	livesCounter.innerHTML = "";
	on = false;
	win = true;
}




hard.addEventListener('click', onHardClick);
easy.addEventListener('click', onEasyClick);
start.addEventListener('click', onStartClick);
newGame.addEventListener('click', onNewGameClick);

topLeft.addEventListener("click", onTopLeftClick);
topRight.addEventListener("click", onTopRightClick);
bottomLeft.addEventListener("click", onBottomLeftClick);
bottomRight.addEventListener("click", onBottomRightClick);