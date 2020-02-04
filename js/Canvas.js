"use strict";

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

		// count
		this.resaTime = resaTime;

		document.getElementById("nom").value = localStorage.getItem("nom");
		document.getElementById("prenom").value = localStorage.getItem("prenom");
	}

	initCanvas()
	{
		// Bouton Signer
		$("#signer").click((e) => {
			const blank = this.isCanvasBlank();
			if (blank === false){

				sessionStorage.setItem("nomReserv", localStorage.getItem("nom"));
				sessionStorage.setItem("prenomReserv", localStorage.getItem("prenom"));
				sessionStorage.setItem("stationReserv", sessionStorage.getItem("Station"));
				sessionStorage.setItem("secondes", 60);
				sessionStorage.setItem("count", this.resaTime * 60);
				sessionStorage.setItem("reservation", "valid");

				document.getElementById("reservation").innerHTML = "Vous avez réservé au nom de <b>" +
					sessionStorage.getItem("nomReserv").toUpperCase() + " " + sessionStorage.getItem("prenomReserv") +
					" </b>à la station : <b>" + sessionStorage.getItem("stationReserv") + ".</b>";
				document.getElementById("signInput").style.display = "none";
				document.getElementById("reservationValid").style.display = "block";
				document.getElementById("annulerReserv").style.display = "block";
				document.getElementById("timer").style.display = "block";

				this.countMinutes();
				this.erase(e);
			}
			else {
				alert("Veuillez signer dans la zone indiquée.");
			}
		});

		// Bouton effacer
		$("#effacer").click((e) => {
			this.erase(e);
		});

		// Bouton annuler
		$("#annulerReserv").click((e) => {
			this.cancelReserv();
		});


		//Evenements PC
		this.canvas.addEventListener("mousedown", (e) => {
			this.startPosition(e);
		});
		this.canvas.addEventListener("mouseup", () => {
			this.finishedPosition();
		});
		this.canvas.addEventListener("mousemove", (e) => {
			this.draw(e);
		});

		//Evenements Mobile
		this.canvas.addEventListener("touchstart", (e) => {
			this.startPosition(e);
		});
		this.canvas.addEventListener("touchend", () => {
			this.finishedPosition();
		});
		this.canvas.addEventListener("touchmove", (e) => {
			this.drawMobile(e);
		});
	}

	// Canvas vide
	isCanvasBlank()
	{
	const blank = document.createElement("canvas");

	blank.width = this.canvas.width;
	blank.height = this.canvas.height;

	return this.canvas.toDataURL() === blank.toDataURL();
	}


	// Suppression du contenu du canvas
	erase(e)
	{
		this.ctx.clearRect(0, 0, 300 * 5, 200 * 4);
	}

	// Position de demarrage de la signature
	startPosition(e)
	{
		this.sign = true;
		this.draw(e);
	}


	// Position de fin de la signature
	finishedPosition()
	{
		this.sign = false;
		this.ctx.beginPath();
	}

	// Lors du mouvement de la souris PC
	draw(e)
	{
		if(!this.sign) {
			return;
		}
		this.ctx.lineWidth = 10;
		this.ctx.lineCap = "round";
		var rect = this.canvas.getBoundingClientRect();
		this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
		if ((e.clientX - rect.left) > 300 || (e.clientX - rect.left) < 10 || (e.clientY - rect.top) > 190 || (e.clientY - rect.top) < 10){
			this.finishedPosition();
		}
		this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 4;
		this.ctx.stroke();
	}

	// Lors du mouvement sur Mobile
	drawMobile(e)
	{
		if(!this.sign) {
			return;
		}
		this.ctx.lineWidth = 10;
		this.ctx.lineCap = "round";
		let rect = this.canvas.getBoundingClientRect();
		this.ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
		this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 4;
		this.ctx.stroke();
	}

	cancelReserv()
	{
		sessionStorage.removeItem("reservation");
		sessionStorage.setItem("reservation", "annuler");
		document.getElementById("annulerReserv").style.display = "none";
		document.getElementById("timer").style.display = "none";
		this.stopCountMinutes();
		this.validReserv();
	}

	// Vérification de l"état de réservation
	validReserv() {
		if (sessionStorage.getItem("reservation") === "valid") {

			document.getElementById("reservation").innerHTML = "Vous avez réservé au nom de <b>" +
				sessionStorage.getItem("nomReserv").toUpperCase() + " " + sessionStorage.getItem("prenomReserv") +
				" </b>à la station : <b>" + sessionStorage.getItem("stationReserv") + ".</b>";
			document.getElementById("formInput").style.display = "none";
			document.getElementById("reservationValid").style.display = "block";
			document.getElementById("annulerReserv").style.display = "block";
			this.countMinutes();

		} else if (sessionStorage.getItem("reservation") === false) {

			document.getElementById("formInput").style.display = "block";
			document.getElementById("reservationValid").style.display = "none";
			document.getElementById("annulerReserv").style.display = "none";
			document.getElementById("reservation").textContent = "Aucune réservation en cours...";

		} else if (sessionStorage.getItem("reservation") === "annuler") {

			document.getElementById("formInput").style.display = "block";
			document.getElementById("reservationValid").style.display = "none";
			document.getElementById("annulerReserv").style.display = "none";
			document.getElementById("reservation").textContent = "Réservation annulée...";

		}
	}

	countMinutes()
	{
		this.secondes = parseInt(sessionStorage.getItem("secondes"));
		this.count = parseInt(sessionStorage.getItem("count"));
		this.count = this.count - 1;
		this.minutes = Math.floor(this.count/60);
		this.secondes = this.secondes - 1;

		if(this.secondes < 0){
			this.secondes = 59;
		} else if(this.count === 0){
			this.cancelReserv();
			document.location.reload(true);
		}

		sessionStorage.setItem("secondes", this.secondes);
		sessionStorage.setItem("count", this.count);
		document.getElementById("timer").innerHTML = "<i style='transform: scale(1.5); margin-right: 10px;' class='far fa-clock'></i> " + this.minutes + " minutes " + this.secondes + " secondes";
		this.countTimer = setTimeout((e) => {
			this.countMinutes();
		}, 1000);
	}

	stopCountMinutes()
	{
		clearTimeout(this.countTimer);
	}

}