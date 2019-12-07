// SLIDER //
class Slider{
	constructor(){
		var slidePos = 0;
		var slide = document.getElementsByClassName("slideImg");
		document.getElementById("right_arrow").addEventListener("click", sliderDelayRight); // Bouton Droit
		document.getElementById("left_arrow").addEventListener("click", sliderDelayLeft); // Bouton Gauche
		document.addEventListener('keydown', function(e){ // Fleche clavier
			if (e.keyCode === 37) {
				sliderDelayLeft();
			}
			else if(e.keyCode === 39){
				sliderDelayRight();
			}
		});
		
		// Slide vers la gauche
		function sliderDelayLeft(){
			slidePos = slidePos + 25;
			if (slidePos > 0) {
				slidePos = -75;
			}
			for (var i = 0; i < slide.length; i++) {
				slide[i].style.left = slidePos + "%";
				slide[i].style.transition = "2s";
			}	
		}
		
		// Slide vers la droite
		function sliderDelayRight(){
			slidePos = slidePos - 25;
			if (slidePos < -75) {
				slidePos = 0;
			}
			for (var i = 0; i < slide.length; i++) {
				slide[i].style.left = slidePos + "%";
				slide[i].style.transition = "2s";
			}
		
		}
		
		// Interval de 5s du Slider
		var timerSlide = setInterval(sliderDelayRight, 5000); // 10s ici
		
		// Bouton pause
		document.getElementById("pause").addEventListener("click", function(){
			this.style.display = "none";
			document.getElementById("play").style.display = "block";
			clearInterval(timerSlide);
		});
		
		// Bouton play
		document.getElementById("play").addEventListener("click", function(){
			this.style.display = "none";
			document.getElementById("pause").style.display = "block";
			timerSlide = setInterval(sliderDelayRight, 10000); 
		});		
	}
}