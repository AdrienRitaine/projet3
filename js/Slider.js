'use strict';

class Slider
{

	constructor(slideElt)
	{
		this.slidePos = 0;
		this.slideElt = slideElt;
	}

	sliderDelayRight()
	{
		this.slidePos = this.slidePos - 25;
		if (this.slidePos < -75){
			this.slidePos = 0;
		}
		for (var i = 0; i < this.slideElt.length; i++){
			this.slideElt[i].style.left = this.slidePos + "%";
			this.slideElt[i].style.transition = "2s";
		}
	}

	sliderDelayLeft()
	{
		this.slidePos = this.slidePos + 25;
		if (this.slidePos > 0){
			this.slidePos = -75;
		}
		for (var i = 0; i < this.slideElt.length; i++){
			this.slideElt[i].style.left = this.slidePos + "%";
			this.slideElt[i].style.transition = "2s";
		}
	}

	launchSlider()
	{
		this.delay();
		var keyPause = 0;

		$('#right_arrow').click((e) => {
			this.sliderDelayRight();
		});

		$('#left_arrow').click((e) => {
			this.sliderDelayLeft();
		});

		$('#play').click((e) => {
			this.keyPlay();
		});

		$('#pause').click((e) => {
			this.keyPause();
		});

		$('body').on('keydown', function(e){ // Fleche clavier
			if (e.keyCode === 37) {
				slider.sliderDelayLeft();
			} else if(e.keyCode === 39){
				slider.sliderDelayRight();
			} else if(e.keyCode === 32){
				e.preventDefault();
				switch (keyPause) {
					case 0:
						slider.keyPause()
						keyPause++;
						break;
					case 1:
						slider.keyPlay();
						keyPause--;
						break;
				}
			}
		});
	}

	keyPause()
	{
		$('#pause').css('display', 'none');
		$('#play').css('display', 'block');
		clearInterval(this.sliderInterval);
	}

	keyPlay(){
		$('#play').css('display', 'none');
		$('#pause').css('display', 'block');
		this.delay();
	}

	delay()
	{
		this.sliderInterval = setInterval((e) => {
			this.sliderDelayRight();
		}, 5000);
	}

}

