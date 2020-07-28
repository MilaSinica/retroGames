
var games = document.getElementsByClassName("game-block");

for (i = 0; i < games.length; i++){
	games[i].addEventListener("mouseover", function(){
		document.getElementById("audioShuh").play();
	})
}


var screenWidth = $(document).width() - 400;
var body = document.getElementById("body");

var nyanCat = document.getElementById("animate");
$(document).ready(function(e) {
	body.classList.add("overflowBlock");
    var width = "+=" + $(document).width();
    $("#animate").animate({
    left: width
  }, 5000, function() {
    // Animation complete.
    nyanCat.style.display = "none";
    body.classList.remove("overflowBlock");
  });
});

// setInterval(function(){
	
// }, 3200);
