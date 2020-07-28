
//selects all players action options
var square = document.getElementsByClassName("square-player");
//keeps track of game - if it is over or not
var gameOver = false;
//empty string to hold players choise
var player = "";
var result = "";

//options for computer to choose from
var choices = ["rock", "paper", "scissors", "spock", "lizard"];

//var to keep computer choise
var computer;

//div, which says "win" and is placed over screen after you win
var winDiv = document.getElementById("win");
//div, which says "lose" and is placed over screen after you lose
var lostDiv = document.getElementById("lost");
var tiedDiv = document.getElementById("tied");

//selects speech bubbles to replace them
var speechComp = document.getElementById('speech-computer');
var speechPlayer = document.getElementById('speech-player');

//score display selectors to change score on screen
var playerScoreDisplay = document.getElementById("player-score");
var computerScoreDisplay = document.getElementById("computer-score");

//button selectors
var newGameBtn = document.getElementById("reset");

//div where information about current fight is displayed
var infoText = document.getElementById("info-text");

//default value for scores
var userScore = 0;
var computerScore = 0;

//divs where player and computer choises (images) are displayed on background
var playerChoise = document.getElementById("choise-player");
var computerChoise = document.getElementById("choise-computer");


//==================================================Game Logic=====================================================


//when user has chosen a hero 
function optionClicked(){
    //player choise is saved to var to compare it 
    player = this.id;
    //if game is already over - plays error sound
    if (gameOver){
        document.getElementById("adioError").play();
    } else{
        playerChoise.style.backgroundImage="url(heros/" + this.id + ".png)";
        //computer make his move
        computerChoiseInit();
    }
    //initiates function to compare scores
    winner();
}

//creates compuer choise by randomly choosing hero and changing image on background of big hero div
function computerChoiseInit(){
    computer = choices[Math.floor(Math.random()*5)];
    computerChoise.style.backgroundImage="url(heros/" + computer + ".png)";
}

//calculates who is the winner, initiates win/lost or tied function in a round, changes info text on a screen
function winner(){
    if (!gameOver){
        if (player === computer){
            draw();
            infoText.innerHTML = "Same heros chosen - it`s a draw!";
        } else if(player === "rock"){
            if(computer === "scissors"){
                win();
                infoText.innerHTML = "Rock crushes scissors - you won!";
            } else if(computer === "lizard"){
                win();
                infoText.innerHTML = "Rock smashes lizard - you won!";
            } else if(computer === "paper"){
                lost();
                infoText.innerHTML = "Paper covers Rock - you lost!";
            } else if(computer === "spock"){
                lost();
                infoText.innerHTML = "Spock vaporizes Rock - you lost!";
            }
        } else if(player === "paper"){
            if(computer === "rock"){
                win();
                infoText.innerHTML = "Paper covers Rock - you won!";
            } else if(computer=== "spock"){
                win();
                infoText.innerHTML = "Paper disproves Spock - you won!";
            } else if(computer === "scissors"){
                lost();
                infoText.innerHTML = "Scissors cuts Paper - you lost!";
            } else if (computer === "lizard"){
                lost();
                infoText.innerHTML = "Lizard eats Paper - you lost!";
            }
        } else if(player === "scissors"){
            if(computer === "paper"){
                win();
                infoText.innerHTML = "Scissors cuts Paper - you won!";
            } else if (computer === "lizard"){
                win();
                infoText.innerHTML = "Scissors decapitates Lizard - you won!";
            } else if(computer === "rock"){
                lost();
                infoText.innerHTML = "Rock crushes Scissors - you lost!";
            } else if(computer === "spock"){
                lost();
                infoText.innerHTML = "Spock smashes Scissors - you lost!";
            }
        } else if(player === "lizard"){
            if(computer === "paper"){
                win();
                infoText.innerHTML = "Lizard eats Paper - you won!";
            } else if(computer === "spock"){
                win();
                infoText.innerHTML = "Lizard poisons Spock - you won!";
            } else if(computer === "rock"){
                lost();
                infoText.innerHTML = "Rock crushes Lizard - you lost!";
            } else if(computer === "scissors"){
                lost();
                infoText.innerHTML = "Scissors decapitates Lizard - you lost!";
            }
        } else if(player === "spock"){
            if(computer === "scissors"){
                win();
                infoText.innerHTML = "Spock smashes Scissors - you won!";
            } else if(computer === "rock"){
                win();
                infoText.innerHTML = "Spock vaporizes Rock - you won!";
            } else if(computer === "paper"){
                lost();
                infoText.innerHTML = "Paper disproves Spock - you lost!";
            } else if(computer === "lizard"){
                lost();
                infoText.innerHTML = "Lizard poisons Spock - you lost!";
            }
        }
    }
}

//if player wins - changes speech bubbles images, adds 1 point to user score, if 5 points achieved - stops the game
function win(){
    document.getElementById("adioWin").play();
    speechComp.src = "assets/no.png";
    speechPlayer.src= "assets/won.png"; 
    userScore++;
    reloadScore();
    if (userScore >= 5 || computerScore >= 5){
        stopGameIfScoreAchieved();
    }
}

//if player loses - changes speech bubbles images, adds 1 point to computer score, if 5 points achieved - stops the game
function lost(){
    document.getElementById("adioLose").play();
    speechComp.src = "assets/loser.png";
    speechPlayer.src= "assets/lost.png"; 
    computerScore ++;
    reloadScore();
    if (userScore >= 5 || computerScore >= 5){
        stopGameIfScoreAchieved();
    }
}

//if same heros chosen - changes speech bubbles images
function draw(){
    document.getElementById("adioTied").play();
    speechComp.src = "assets/regret.png";
    speechPlayer.src= "assets/draw.png"; 

}

//updates score values after they were changed
function reloadScore(){
    playerScoreDisplay.innerHTML = userScore;
    computerScoreDisplay.innerHTML = computerScore;
}

//if someone got 5 points stops the game
function stopGameIfScoreAchieved(){
    gameOver = true;
    //removes hover effect from heros divs
    for (x = 0; x < square.length; x++){
        square[x].classList.remove("square-player-hover");
    }
    //displays win or lost divs on the screen
    if (userScore === 5){
        document.getElementById("adioWon").play();
        winDiv.style.display = "block";
    } else if(computerScore === 5){
        document.getElementById("adioLost").play();
        lostDiv.style.display = "block";
    }
}

//starts new game after button is clicked
function playAgain(){
    document.getElementById("adioPop").play();
    //adds back hover effect to little squares
    for (x = 0; x < square.length; x++){
        square[x].classList.add("square-player-hover");
    }
    //changes main hero images to default
    undoPic();
    gameOver = false;
}

//resets game to a new game
function resetGame(){
    //resets user scores 
    userScore = 0;
    computerScore = 0;
    reloadScore();
    //resets info text on the screen
    infoText.innerHTML = "Make your move now!";
    speechComp.src = "assets/evil.png";
    speechPlayer.src= "assets/fight.png";
     //hides all wrapper divs from the screen
    lostDiv.style.display = "none";
    winDiv.style.display = "none";
    tiedDiv.style.display = "none";
    //starts a new game
    playAgain();
}

//resets backgrounds to default
function undoPic() {
    playerChoise.style.backgroundImage="url(heros/rock.png)";
    computerChoise.style.backgroundImage="url(heros/scissors.png)";
}

//===============================================Game Buttons==================================================

//controlling buttons to exucute correct function
newGameBtn.addEventListener("click", resetGame);

//adds event listener to all squares (each square is inside array)
for (x = 0; x < square.length; x++){
   square[x].addEventListener("click", optionClicked);
}

