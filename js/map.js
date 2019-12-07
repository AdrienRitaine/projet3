// MAP //

class Maps{
	constructor(api_key, longLat, station, id){
		this.longLat = longLat; // Coordonnées de la carte
		this.api_key = api_key; // Clé pour l'API
		this.id = id; // id de la map
		this.station = station; // Station selectionnée
		var map = L.map(this.id).setView(this.longLat, 14);

		// Ajout de la carte
		L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// Creation de la requête
		var request = new XMLHttpRequest();
		request.open('GET', 'https://api.jcdecaux.com/vls/v1/stations?contract=' + this.station + '&apiKey=' + this.api_key, true);
		request.onload = function() {
			
			var data = JSON.parse(this.response);
			var greenIcon = L.icon({
				iconUrl: 'images/marker_icon_green.png',
				iconSize:     [38, 48]
			});
			var orangeIcon = L.icon({
				iconUrl: 'images/marker_icon_orange.png',
				iconSize:     [38, 48]
			});
			var redIcon = L.icon({
				iconUrl: 'images/marker_icon_red.png',
				iconSize:     [38, 48]
			});
			
			for (var i = 0; i < data.length; i++) {

				// Variables
				var latMarker = data[i].position.lat;
				var longMarker = data[i].position.lng;
				var longLatMarker = [latMarker, longMarker];
				var veloPlace = data[i].bike_stands;
				var veloAddr = data[i].address;
				var veloDisp = data[i].available_bikes;
				var station = data[i].name;
				var status = data[i].status;

				// Ajout marker
				if (status === "OPEN") {
					status = "OUVERT";
					if (veloDisp >= 8) {
						var marker = new L.Marker(longLatMarker, {
							draggable: false,
							icon: greenIcon
						});
					}
					else if (veloDisp >= 5){
						var marker = new L.Marker(longLatMarker, {
							draggable: false,
							icon: orangeIcon
						});
					}
					else if (veloDisp <= 4){
						var marker = new L.Marker(longLatMarker, {
							draggable: false,
							icon: redIcon
						});
					}
					map.addLayer(marker);
					marker.veloPlace = veloPlace;
					marker.veloAddr = veloAddr;
					marker.veloDisp = veloDisp;
					marker.station = station;
					marker.status = status;
					marker.bindPopup(data[i].name + "<br>" + data[i].address);
					// Ajout d'évenement de clique sur les marqueurs
					marker.addEventListener("click", function(e){
						
						document.getElementById("form").style.display = "flex";
						document.getElementById("formPlace").textContent = e.target.veloPlace;
						document.getElementById("formAddr").textContent = e.target.veloAddr;
						document.getElementById("formDisp").textContent = e.target.veloDisp;
						document.getElementById("formStation").textContent = e.target.status + " | "  + e.target.station;
						document.getElementById("formStation").style.fontWeight = "900";
						document.getElementById("formDisp").style.fontWeight = "900";
						localStorage.removeItem("station");
						localStorage.removeItem("nom");
						localStorage.removeItem("prenom");
						localStorage.setItem("Station", e.target.station);
						if (e.target.veloDisp >= 8){
							document.getElementById("formDisp").style.color = "#00e640";
							document.getElementById("formDisp").textContent += " (Beaucoup)";
						} 
						else if (e.target.veloDisp >= 5){
							document.getElementById("formDisp").style.color = "#f9690e";
							document.getElementById("formDisp").textContent += " (Normal)";
						}
						else if (e.target.veloDisp <= 4){
							document.getElementById("formDisp").style.color = "red";
							document.getElementById("formDisp").textContent += " (Faible)";

						}
					});
				} 
				else{
					status = "FERMER";
				}
				
			}
		}

		// Envoi requête
		request.send();


		// Lors du clique sur le bouton reserver
		document.getElementById("formInput").addEventListener("submit", function(e){
			e.preventDefault();
			var nom = document.getElementById("nom").value;
			var prenom = document.getElementById("prenom").value;
			var station = localStorage.getItem("Station");
			localStorage.removeItem("nom");
			localStorage.removeItem("prenom");
			localStorage.setItem("nom", nom);
			localStorage.setItem("prenom", prenom);
			console.log(localStorage);
			this.style.display = "none";
			document.getElementById("signInput").style.display = "block";
		});

		//Retour signer
		document.getElementById("retour").addEventListener("click", function(){
			document.getElementById("formInput").style.display = "block";
			document.getElementById("signInput").style.display = "none";
		});
	}
}

