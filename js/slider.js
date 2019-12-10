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
		if (this.slidePos < -75)
		{
			this.slidePos = 0;
		}
		for (var i = 0; i < this.slideElt.length; i++)
		{
			this.slideElt[i].style.left = this.slidePos + "%";
			this.slideElt[i].style.transition = "2s";
		}
	}

	sliderDelayLeft()
	{
		this.slidePos = this.slidePos + 25;
		if (this.slidePos > 0)
		{
			this.slidePos = -75;
		}
		for (var i = 0; i < this.slideElt.length; i++)
		{
			this.slideElt[i].style.left = this.slidePos + "%";
			this.slideElt[i].style.transition = "2s";
		}
	}

	launchSlider()
	{
		this.delay();

		$('#right_arrow').click((e) => {
			this.sliderDelayRight();
		});

		$('#left_arrow').click((e) => {
			this.sliderDelayLeft();
		});

		$('#play').click((e) => {
			$('#play').css('display', 'none');
			$('#pause').css('display', 'block');
			this.delay();
		});

		$('#pause').click((e) => {
			$('#pause').css('display', 'none');
			$('#play').css('display', 'block');
			clearInterval(this.sliderInterval);
		});

		$('body').on('keydown', function(e){ // Fleche clavier
			if (e.keyCode === 37) {
				slider.sliderDelayLeft();
			}
			else if(e.keyCode === 39){
				slider.sliderDelayRight();
			}
		});
	}

	delay()
	{
		this.sliderInterval = setInterval((e) => {
			this.sliderDelayRight();
		}, 5000);
	}

}

