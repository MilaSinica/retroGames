//var to store newly created by JS <p>
var square;
//classes responsible for creating food picture background
var classes = ["doughnut", "cheese-burger", "cherries", "birthday-cake", "watermelon",
"spaghetti", "pumpkin", "roast-chicken", "salad", "pizza", "rise", "sushi", "pancakes", "shrimp", "muffin", "burrito", 
"chicken-leg", "drink", "french-fries", "hot-dog", "avocado", "cabbage", "eggplant", "fish", "fried-egg", "frozen-yogurt",
"grapes", "lemon", "lemonade", "lobster", "orange", "pear", "pie", "pineapple", "pumpkin", "salt", "sandwich", "skewer", 
"soda-3", "soup", "tomato"];
//var used to attach shuffeled pictures to squares
var shuffeledPictures;
//in witch <p> are created
var container = document.getElementById("container");
//HTML span where counter information is displayed
var counterDisplay = document.getElementById("counter");
//seethrough div on top of the page, which blocks any action after game is over
var wrapper = document.getElementById("wrapper");
//div, which says "win" and is placed over screen after you win
var gameOff = document.getElementById("gameOver");
//previous selected picture`s class
var previous = "";
//previous selected picture
var previousPicture ="";
//this time selected picture`s class
var current;
//this time selected picture`s class
var currentPicture;
//counter to know how any correctly guessed pictures dissapeared
var count = 0;

//counter for countdoqn till the game is over
var counter;
//current counter value
var currentTick;


//default mode value when game is loaded first time
var easyMode = false;
//help span
var help = document.getElementById("help");

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
		//generates random number between 1 and number of all classes (41)
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

//executed when the game is over
function gameOver(){
	//shows all pictures by deleting all upper order classes with bckg
	for (j = 0; j < square.length; j++){
		square[j].classList.remove("empty");
		square[j].classList.remove("default");
	}
	//display words "you lost"
	gameOff.innerHTML = "YOU LOST";
	gameOff.style.display = "block";
	//block any additional action with the game
	wrapper.style.display = "block";
	//stop countdown and reset counter
	stopCountdown();
	//play sound
	document.getElementById("adioLost").play();
}

//stops countdown and reset counter
function stopCountdown() {
	clearInterval(counter);
	counterDisplay.innerHTML = "";
}

//counts time in reverse order and shows it on screen
function tic(){
	if (currentTick > 0){
		counterDisplay.innerHTML = currentTick;
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

//function defines a new game, taking into account mode
function init(numberOfPictures, sec){
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
	gameOff.style.display = "none";
	wrapper.style.display = "none";

	//this part generates new pictures using function...
	var pictures = randomPictureSelection(numberOfPictures / 2, classes);
	//...doubles them...
	var samePictures = pictures.slice();
	//...connects 2 copies together...
	var doublePictures = pictures.concat(samePictures);
	//...using function shuffles them, so they are in a random order
	shuffeledPictures = shuffle(doublePictures);

	//generates all squares (<p>). First cleans all previos squares
	container.innerHTML = "";
	//creates <p> count same as picture count
	for (i = 0; i < numberOfPictures; i++){
		var p = document.createElement("p");
		//adds default class to every square
		p.classList.add("default");
		//adds i id to every square
		p.id = i;
		//push <p> to cointainer div
		container.appendChild(p);
	}
	//selectes just crated <p> - squares
	square = document.getElementsByTagName("p");

	//add to every square image and covers it with default class style to hide it
	for (i = 0; i < square.length; i++){
		square[i].classList.add(shuffeledPictures[i]);
		square[i].classList.add("default");
		//add click listeners to squares
		square[i].addEventListener("click", function(){	
			//when cliked - cover all again with default class and show only clicked square picture
			for (x = 0; x < square.length; x++) {
				square[x].classList.add("default");
				this.classList.remove("default");
			}
			//grabs current  picture and its class
			current = this.classList.value;
			currentPicture = this;
			//checks if previous picture is the same as current and checks if the same picture was not clicked twice
			if (previous === current && currentPicture.id !== previousPicture.id){
				//resets both images/squares from the screen
				previousPicture.classList.add("empty");
				currentPicture.classList.add("empty");
				//updates counter telling that 2 images were deleted
				count+=2;
				//plays sound
				document.getElementById("adioMatch").play();
			} else {
				//if 2 images are not the same plays another sound
				document.getElementById("audioMissed").play();
			}
			//checks if all pictures are removed from the screen
			if (count === numberOfPictures) {
				//shows all images on the screen by removing all upper order classes
				for (j = 0; j < square.length; j++){
					square[j].classList.remove("empty");
					square[j].classList.remove("default");
				}
				gameOff.innerHTML = "YOU WON";
				//dispalys win display and blocks any actions in the game
				gameOff.style.display = "block";
				wrapper.style.display = "block";
				//stops counter and plays sound
				stopCountdown();
				document.getElementById("audioWin").play();
			}
			//updates previous picture values
			previous = current;
			previousPicture  = currentPicture;		
		})		
	}
	//after game started launchs countdown
	startCountdown(sec);
}

//if new game is played in easy mode
function newGameEasy(){
	//updates mode statuss to start a new game in the same mode
	easyMode = true;
	//starts new game with 12 pictures/squares and gives 30 seconds
	init(12, 30);
}

//if new game is played in hard mode
function newGameHard(){
	//updates mode statuss to start a new game in the same mode
	easyMode = false;
	//starts new game with 18 pictures/squares and gives 30 seconds
	init(18, 30);
}

//controls new game button
function playAgain(){
	//checks if easy or hard mode is on and starts a new game
	document.getElementById("adioPop").play();
	if (easyMode === true){
		newGameEasy();
	} else {
		newGameHard();
	}
}

//controls easy mode button
function onEasyClick(){
	//changing button colors
	easy.classList.add("active");
	hard.classList.remove("active");
	help.classList.remove("active");
	document.getElementById("adioPop").play();
	//starts new game
	newGameEasy();
}

//controls hard mode button
function onHardClick(){
	//changing button colors
	easy.classList.remove("active");
	help.classList.remove("active");
	hard.classList.add("active");
	document.getElementById("adioPop").play();
	//starts new game
	newGameHard();
}


//***********************************************************
//controls play again button
document.getElementById("playAgain").addEventListener("click", playAgain);
//controlling buttons to exucute correct function
easy.addEventListener("click", onEasyClick);
hard.addEventListener("click", onHardClick);

//starts new game in hard mode when the page is loaded
newGameHard();




	

