//*****************************************game Logic VARs*************************************
//place for players` cards on the desk
var square = document.getElementsByClassName("square");

//empty deck
var deck = [];
var suits = ["clubs", "diamonds", "hearts", "spades"];
var ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
//each individual card`s object
var card;

//all hidden dealer`s cards are located in this array
var dealerCards=[];
//counter to keep dealt cards number
var cardsDealtToPlayer = 0;
var cardsDealtToDealer = 0;
//hardcoded standard bet and balance
var currentBid = 10;
var creditBalance = 60;
//each user cards saved in these objects
var userHand;
var computerHand;

//********************************************Button Selectors**********************************************

//get reset button
var reset = document.getElementById("reset");


var hitBtn = document.getElementById('hit');
var standBtn = document.getElementById('stand');
var doubleBtn = document.getElementById('double');
var playAgainBtn = document.getElementById('playAgain');

//*****************************Top-divs selectors for result show******************************************
//div, which says "win" and is placed over screen after you win
var win = document.getElementById("win");
//div, which says "lose" and is placed over screen after you lose
var lost = document.getElementById("lost");
var tied = document.getElementById("tied");

//********************************Text information blocs` selectors********************************************
//players` score divs
var dealerScore = document.getElementById("dealer-score");
var playerScore = document.getElementById("player-score");
//bid and balance info divs
var creditBalanceDisplay = document.getElementById("credit-balance");
var currentBidDisplay = document.getElementById("current-bid");



//******************************************Game Logic**********************************************


//show credit balance on the top
creditBalanceDisplay.innerHTML = creditBalance;


//*****************************Creating a deck and assign values to cards****************************
//creates new desk of 52 cards
function createNewDeck(){
	deck = [];
	//filling deckwith cards
	for (i = 0; i < suits.length; i++){
	    for (j = 0; j < ranks.length; j++){
            //object card has 3 properties: suit, name and rank
	        var card = {"rank": ranks[j], "suit": suits[i], "name": ranks[j] + suits[i].charAt(0) + ".png"};
	        deck.push(card);
	    }
	}
	//This will shuffle the deck
	deck.sort(function(){
	  return 0.5 - Math.random();
	});
}

//assigns values to cards
function getValue(card){
    //if ace 11
    if (card.rank === "A"){
        return 11;
    // if face card 10 
    } else if (card.rank === "Q" || card.rank === "J" || card.rank === "K"){
        return 10;
    // if number card
    } else {
        return card.rank;
    }
}

//**********************************Dealing random cards and drawing them***************************
//dealing our cards choosing them randomly
function deal(){
    //create random number
    var randNum = Math.floor(Math.random()*deck.length);
    //select this card from the deck
    card = deck[randNum];
    //delete this card from the deck
    deck.splice(randNum, 1);
    return card;
}

//draws user cards on a screen
function drawCardsPlayer(){
    //keeps score of dealt cards
    cardsDealtToPlayer++;
    //shows cards in a background of square
    square[cardsDealtToPlayer-1].style.backgroundImage = "url(cards/"+card.name+")";
    //shows score in a display
    playerScore.innerHTML = userHand.score();
}

//draws dealer`s cards on a screen
function drawCardsDealer(){
    //keeps score of dealt cards
    cardsDealtToDealer++;
    //shows first in a background of square
    if (cardsDealtToDealer <= 1){
        document.getElementsByClassName("square")[6+cardsDealtToDealer].style.backgroundImage = "url(cards/"+card.name+")";
    } else {
    //the other cards are face down, however info 
    //about them is stored in the array so later it can be used to draw them
        dealerCards[cardsDealtToDealer-2] = card;
        document.getElementsByClassName("square")[6+cardsDealtToDealer].style.backgroundImage = "url(cards/back.png)";
    }
}

//************************Creating User with 2 cards and Dealer Hands and Logic********************************
//Hand constructor for dealer and player hands
var Hand = function(){
    //array, which containes all player`s cards
    this.handDeal = [];
    //loop throug the hand and calculate sum of all cards` values
    this.score = function(){
        //keep all sum of cards in a hand
        var sum = 0;
        //keep number of aces
        var aces = 0;
        for (x = 0; x < this.handDeal.length; x++){
        //calculates sum of dealt cards
        sum += getValue(this.handDeal[x]);
        //counts how many aces was dealt    
            if(getValue(this.handDeal[x]) === 11){
                aces++; 
            }
        }
        //if you have aces AND score is bigger than 21, treat aces not as 11, but as 1. 
        //Do it for all aces in a deal
        while (sum > 21 && aces !== 0){
            sum -= 10;
            aces--;
        }
        return sum;
    } 
    //add one more card to Player
    this.hitPlayer = function(){
        //to limit cards` count to 7
        if (cardsDealtToPlayer < 7 && userHand.score() <= 21){
            //add card
            document.getElementById("adioHit").play();
            this.handDeal.push(deal());
            //draw it on screen
            drawCardsPlayer();
            //restrict to push "double" button again
            doubleBtn.classList.add("btn-block");
            doubleBtn.classList.remove("btn-action");
            double.classList.remove("btn-coursor");   
        }
        else {
            document.getElementById("adioError").play();
            hitBtn.classList.add("btn-block");
            hitBtn.classList.remove("btn-action");
            hitBtn.classList.remove("btn-coursor");
        }
    }
    //add one more card to Dealer
    this.hitDealer = function(){
        this.handDeal.push(deal());
        drawCardsDealer();
    }
}

//function to create dealer hand
function playAsDealer(){
    computerHand = new Hand();
    //creating array of 2 random cards and drawing them on a screen
    computerHand.handDeal[0] = deal();
    drawCardsDealer();
    computerHand.handDeal[1] = deal();
    drawCardsDealer();
    return computerHand;
}

//creates new hand - gives user 2 cards
function playAsUser(){
    userHand = new Hand();
    //shows user his cards and offer to hit more
    //creating array of 2 random cards
    userHand.handDeal[0] = deal();
    drawCardsPlayer();
    userHand.handDeal[1] = deal();
    drawCardsPlayer();
    return userHand;
}

//**************************************Reset Game and Double a bet***************************************
//double current bet
function doubleDeal(){
    //only if have enough money
    if(creditBalance>=20 && cardsDealtToPlayer <= 2){
        document.getElementById("adioCoin").play();
        currentBid = 20;
        //show on the screen
        currentBidDisplay.innerHTML = currentBid;
    } else {
        document.getElementById("adioError").play();
    }
}

//reset game
function resetGame(){
    //resets balance and initiates a new game
    creditBalance = 60;
    creditBalanceDisplay.innerHTML = creditBalance;
    playGame();
}

//************************************Computing and comparing scores********************************
//compute scores
function declareWinner(){
    //after pressed STAND - show computer score
    //automatically add cards while sum is less than 17
    while (computerHand.score() < 17 && userHand.score() <= 21 && userHand.score() > computerHand.score()){
        computerHand.hitDealer();
    }
    dealerScore.innerHTML = computerHand.score();
    //show hidden cards of a computer in the end of a game
    for (x=0; x< cardsDealtToDealer-1; x++){
        document.getElementsByClassName("square")[8+x].style.backgroundImage = "url(cards/"+dealerCards[x].name+")";
    }
    //save scores to variables
    var player = userHand.score();
    var dealer = computerHand.score();
    //compares scores to evaluate winner
    if ((player > dealer && player <= 21) || (dealer > 21 && player <= 21)){
        //adds bet to balance
        document.getElementById("adioWin").play();
        creditBalance = creditBalance + currentBid;
        creditBalanceDisplay.innerHTML = creditBalance;
        //displays word "win" and blocks any additional actions
        win.style.display = "block";
        turnOffBtns();      
    } else if (player < dealer && dealer <= 21){
        //extracts bet from balance
        document.getElementById("adioLost").play();
        creditBalance = creditBalance - currentBid;
        creditBalanceDisplay.innerHTML = creditBalance;
        //display words "you lost"
        lost.innerHTML = "YOU LOST";
        lost.style.display = "block";
        //block any additional action with the game
        turnOffBtns();      
    } else if (dealer <= 21 && player > 21) {
        //extracts bet from balance
        document.getElementById("adioLost").play();
        creditBalance = creditBalance - currentBid;
        creditBalanceDisplay.innerHTML = creditBalance;
        //display words "you lost"
        lost.innerHTML = "YOU LOST";
        lost.style.display = "block";
        //block any additional action with the game
        turnOffBtns();      
        //same score || both > 21
    }
     //same score || both > 21
    else{
        document.getElementById("adioTied").play();
        //only blocks any actions and shows "tied"
        tied.style.display = "block";
        turnOffBtns();       
    }
}

//blocks buttons to prevent actions with them
function turnOffBtns(){
    hitBtn.removeEventListener("click", hitUser);
    standBtn.removeEventListener("click", declareWinner);
    hitBtn.classList.add("btn-block");
    hitBtn.classList.remove("btn-action");
    standBtn.classList.add("btn-block");
    standBtn.classList.remove("btn-action");
    doubleBtn.removeEventListener("click", doubleDeal);
    doubleBtn.classList.add("btn-block");
    doubleBtn.classList.remove("btn-action");
    hitBtn.classList.remove("btn-coursor");
    standBtn.classList.remove("btn-coursor");
    double.classList.remove("btn-coursor");
}

function turnOnBtns(){
    hitBtn.addEventListener("click", hitUser);
    standBtn.addEventListener("click", declareWinner);
    doubleBtn.addEventListener("click", doubleDeal);
    hitBtn.classList.remove("btn-block");
    hitBtn.classList.add("btn-action");
    standBtn.classList.remove("btn-block");
    standBtn.classList.add("btn-action");
    double.classList.remove("btn-block");
    double.classList.add("btn-action");
    hitBtn.classList.add("btn-coursor");
    standBtn.classList.add("btn-coursor");
    double.classList.add("btn-coursor");
}

//***************************************Initiates new game**********************************************
//starts a new game, runs functions to distribute cards, count and compare scores
function playGame(){
    //can start new deal only if have money to bet (10 coins)
    document.getElementById("adioCards").play();
    //turns on `double` option
    turnOnBtns();
    //resets all old cards
    for (x = 0; x < square.length; x++){
        square[x].style.backgroundImage = "none";
    }
    //hides dealer score
    dealerScore.innerHTML = "?";
    //resets current bid
    currentBid = 10;
    currentBidDisplay.innerHTML = currentBid;
     //hides all wrapper divs from the screen
    lost.style.display = "none";
    win.style.display = "none";
    tied.style.display = "none";
    //resets number of cards dealt to players
    cardsDealtToPlayer = 0;
    cardsDealtToDealer = 0;
    //creates new deck and runs functions to deal first cards
    createNewDeck();
    var user = playAsUser();
    var dealer = playAsDealer();
}

//init
playGame();

function hitUser(){
    userHand.hitPlayer();
}

function newGame(){
    if (creditBalance >=10){
        playGame();
    } else{
        document.getElementById("adioError").play();
    }
}

//***********************************************************
//controls play again button
playAgainBtn.addEventListener("click", newGame);
//controlling buttons to exucute correct function
reset.addEventListener("click", resetGame);
help.addEventListener("click", onHelpClick);






