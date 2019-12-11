class Canvas
{
	constructor(canvasElt, canvasCtx, resaTime)
	{
		this.canvas = canvasElt;
		this.ctx = this.canvas.getContext(canvasCtx);
		this.sign = false;

		// Hauteur du canvas
		this.canvas.width = 310;
		this.canvas.height = 200;
		this.validReserv();

		// Decompte
		this.resaTime = resaTime;
		this.secondes;
		this.decompte;
		this.decompteTimer;
	}

	initCanvas()
	{
		// Bouton effacer
		$('#effacer').click((e) => {
			this.erase(e);
		});

		// Bouton Signer
		$('#signer').click((e) => {
			const blank = this.isCanvasBlank();
			if (blank === false)
			{
				localStorage.setItem("nomReserv", localStorage.getItem("nom"));
				localStorage.setItem("prenomReserv", localStorage.getItem("prenom"));
				localStorage.setItem("stationReserv", localStorage.getItem("Station"));
				document.getElementById("reservation").innerHTML = "Vous avez réservé au nom de <b>" +
					localStorage.getItem("nomReserv").toUpperCase() + " " + localStorage.getItem("prenomReserv") +
					" </b>à la station : <b>" + localStorage.getItem("stationReserv") + ".</b>";
				document.getElementById("signInput").style.display = "none";
				document.getElementById("reservationValid").style.display = "block";
				document.getElementById("annulerReserv").style.display = "block";
				localStorage.setItem("reservation", "valid");
				document.getElementById("timer").style.display = "block";
				localStorage.setItem("secondes", 60);
				localStorage.setItem("decompte", this.resaTime * 60);
				this.decompteMinutes();
			}
			else
				{
				alert("Veuillez signer dans la zone indiquer.");
			}
		});

		$('#annulerReserv').click((e) => {
			this.annulerReservation();
		});


		//Evenements PC
		this.canvas.addEventListener('mousedown', (e) => {
			this.startPosition(e);
		});
		this.canvas.addEventListener('mouseup', () => {
			this.finishedPosition();
		});
		this.canvas.addEventListener('mousemove', (e) => {
			this.draw(e);
		});

		//Evenements Mobile
		this.canvas.addEventListener('touchstart', (e) => {
			this.startPosition(e);
		});
		this.canvas.addEventListener('touchend', () => {
			this.finishedPosition();
		});
		this.canvas.addEventListener('touchmove', (e) => {
			this.drawMobile(e);
		});
	}


	isCanvasBlank()
	{
	const blank = document.createElement('canvas');

	blank.width = this.canvas.width;
	blank.height = this.canvas.height;

	return this.canvas.toDataURL() === blank.toDataURL();
	}

	erase(e){
		this.ctx.clearRect(0, 0, 300 * 5, 200 * 4);
	}

	startPosition(e)
	{
		this.sign = true;
		this.draw(e);
	}

	finishedPosition()
	{
		this.sign = false;
		this.ctx.beginPath();
	}

	draw(e)
	{
		if(!this.sign) return;
		this.ctx.lineWidth = 10;
		this.ctx.lineCap = 'round';
		let rect = this.canvas.getBoundingClientRect();
		this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
		if ((e.clientX - rect.left) > 300 || (e.clientX - rect.left) < 10 || (e.clientY - rect.top) > 190 || (e.clientY - rect.top) < 10)
		{
			this.finishedPosition();
		}
		this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 4;
		this.ctx.stroke();
	}

	drawMobile(e)
	{
		if(!this.sign) return;
		this.ctx.lineWidth = 10;
		this.ctx.lineCap = 'round';
		let rect = this.canvas.getBoundingClientRect();
		this.ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
		this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 4;
		this.ctx.stroke();
	}

	annulerReservation()
	{
		localStorage.removeItem("reservation");
		localStorage.setItem("reservation", "annuler");
		document.getElementById("annulerReserv").style.display = "none";
		document.getElementById("timer").style.display = "none";
		this.stopDecompteMinutes();
		this.validReserv();
	}

	validReserv() {
		if (localStorage.getItem("reservation") === "valid") {
			document.getElementById("reservation").innerHTML = "Vous avez réservé au nom de <b>" +
				localStorage.getItem("nomReserv").toUpperCase() + " " + localStorage.getItem("prenomReserv") +
				" </b>à la station : <b>" + localStorage.getItem("stationReserv") + ".</b>";
			document.getElementById("formInput").style.display = "none";
			document.getElementById("reservationValid").style.display = "block";
			document.getElementById("annulerReserv").style.display = "block";
			this.decompteMinutes();
		} else if (localStorage.getItem("reservation") === false) {
			document.getElementById("formInput").style.display = "block";
			document.getElementById("reservationValid").style.display = "none";
			document.getElementById("annulerReserv").style.display = "none";
			document.getElementById("reservation").textContent = "Aucune réservation en cours...";
		} else if (localStorage.getItem("reservation") === "annuler") {
			document.getElementById("formInput").style.display = "block";
			document.getElementById("reservationValid").style.display = "none";
			document.getElementById("annulerReserv").style.display = "none";
			document.getElementById("reservation").textContent = "Réservation annuler...";
		}
	}

	decompteMinutes()
	{
		this.secondes = parseInt(localStorage.getItem("secondes"));
		this.decompte = parseInt(localStorage.getItem("decompte"));
		this.decompte = this.decompte - 1;
		this.minutes = Math.floor(this.decompte/60);
		this.secondes = this.secondes - 1;
		if(this.secondes < 0){
			this.secondes = 59;
		}
		if(this.decompte === 0){
			this.annulerReservation();
		}
		localStorage.setItem("secondes", this.secondes);
		localStorage.setItem("decompte", this.decompte);
		document.getElementById("timer").innerHTML = "<i style='transform: scale(1.5); margin-right: 10px;' class='far fa-clock'></i> " + this.minutes + " minutes " + this.secondes + " secondes";
		this.decompteTimer = setTimeout((e) => {
			this.decompteMinutes();
		}, 1000);
	}

	stopDecompteMinutes(){
		clearTimeout(this.decompteTimer);
	}

}