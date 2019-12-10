// CANVAS //

class Canvas{
	constructor(){
			var effacer = document.getElementById("effacer");
			var signer = document.getElementById("signer");
			effacer.addEventListener("click", erase);
			signer.addEventListener("click", function(e){
				const blank = isCanvasBlank(document.getElementById('canvas'));
				if (blank === false) {
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
					localStorage.setItem("decompte", 1200);
					decompteMinutes();
				}
				else{
					alert("Veuillez signer dans la zone indiquer.");
				}
			});
			
			function isCanvasBlank(canvas) {
			  const blank = document.createElement('canvas');
			
			  blank.width = canvas.width;
			  blank.height = canvas.height;
			
			  return canvas.toDataURL() === blank.toDataURL();
			}
			
			function erase(e){
				ctx.clearRect(0, 0, 300 * 5, 200 * 4);
			}
		
			const canvas = document.querySelector("#canvas");
			const ctx = canvas.getContext("2d");
		
			// Hauteur du canvas
			canvas.width = 310;
			canvas.height = 200;
		
			let sign = false;
			
			function startPosition(e){
				sign = true;
				draw(e);
			}
		
			function finishedPosition(){
				sign = false;
				ctx.beginPath();
			}
		
			function draw(e){
				if(!sign) return;
				ctx.lineWidth = 10; 
				ctx.lineCap = 'round';
				let rect = canvas.getBoundingClientRect();
				ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
				ctx.strokeStyle = "red";
				ctx.lineWidth = 4;
				ctx.stroke();
			}
		
			function drawMobile(e){
				if(!sign) return;
				ctx.lineWidth = 10; 
				ctx.lineCap = 'round';
				let rect = canvas.getBoundingClientRect();
				ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
				ctx.strokeStyle = "red";
				ctx.lineWidth = 4;
				ctx.stroke();		
			}
		
			//Evenements PC
			canvas.addEventListener('mousedown', startPosition);
			canvas.addEventListener('mouseup', finishedPosition);
			canvas.addEventListener('mousemove', draw);
		
			//Evenements Mobile
			canvas.addEventListener('touchstart', startPosition);
			canvas.addEventListener('touchend', finishedPosition);
			canvas.addEventListener('touchmove', drawMobile);

		
		// TIMER & RESERVATION //
		
		document.getElementById("annulerReserv").addEventListener("click", function(e){
			annulerReservation();
		});
		
		function annulerReservation(){
			localStorage.removeItem("reservation");
			localStorage.setItem("reservation", "annuler");
			document.getElementById("annulerReserv").style.display = "none";
			document.getElementById("timer").style.display = "none";
			stopDecompteMinutes();
			validReserv();
		}
		
		function validReserv(){
			if (localStorage.getItem("reservation") === "valid") {
					document.getElementById("reservation").innerHTML = "Vous avez réservé au nom de <b>" + 
						localStorage.getItem("nomReserv").toUpperCase() + " " + localStorage.getItem("prenomReserv") + 
						" </b>à la station : <b>" + localStorage.getItem("stationReserv") + ".</b>";
					document.getElementById("formInput").style.display = "none";
					document.getElementById("reservationValid").style.display = "block";
					document.getElementById("annulerReserv").style.display = "block";
					decompteMinutes();
			}
			else if(localStorage.getItem("reservation") === false){
				document.getElementById("formInput").style.display = "block";
				document.getElementById("reservationValid").style.display = "none";
				document.getElementById("annulerReserv").style.display = "none";
				document.getElementById("reservation").textContent = "Aucune réservation en cours...";
			}	
			else if(localStorage.getItem("reservation") === "annuler"){
				document.getElementById("formInput").style.display = "block";
				document.getElementById("reservationValid").style.display = "none";
				document.getElementById("annulerReserv").style.display = "none";
				document.getElementById("reservation").textContent = "Réservation annuler...";
			}	
		}
		
		validReserv();
		
		var secondes;
		var decompte;
		var decompteTimer;
		
		function decompteMinutes(){
			secondes = parseInt(localStorage.getItem("secondes"));
			decompte = parseInt(localStorage.getItem("decompte"));
			decompte = decompte - 1;
			var minutes = Math.floor(decompte/60);
			secondes = secondes - 1;
			if(secondes === 0){
				secondes = 60;
			}
			if(decompte === 0){
				annulerReservation();
			}
			localStorage.setItem("secondes", secondes);
			localStorage.setItem("decompte", decompte);
			document.getElementById("timer").innerHTML = "<i style='transform: scale(1.5); margin-right: 10px;' class='far fa-clock'></i> " + minutes + " minutes " + secondes + " secondes";
			decompteTimer = setTimeout(decompteMinutes, 1000);
		}
		
		function stopDecompteMinutes(){
			clearTimeout(decompteTimer);
		}
	}
}