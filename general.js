//**********************************************Logo Effect****************************************************
//Block responsible for logo blinking and hover effect
var logo = document.getElementById("logo");
var logo2 = document.getElementById("logo2");
var logo3 = document.getElementById("logo3");
var checkWhichLogo = true;
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


//===========================================Modal===============================================================
//help span
var help = document.getElementById("help");
// Get the modal
var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

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

//controls help button
function onHelpClick(){
	document.getElementById("adioPop").play();
	// When the user clicks the button, open the modal 
	modal.style.display = "block";
}

//controlling buttons to exucute correct function
help.addEventListener("click", onHelpClick);



