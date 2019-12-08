// MAP //

class Maps
{
	constructor(api_key, longLat, station, id)
	{
		this.longLat = longLat; // Coordonnées de la carte
		this.api_key = api_key; // Clé pour l'API
		this.id = id; // id de la map
		this.station = station; // Station selectionnée

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

	// Ajout de la carte
	addMap()
	{
		this.map = L.map(this.id).setView(this.longLat, 14);
		this.layer = L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.map);
	}


	// Récupération de l'API
	getAjax()
	{
		$.getJSON('https://api.jcdecaux.com/vls/v1/stations?contract=' + this.station + '&apiKey=' + this.api_key)
			.then((api) => {
				this.api = api;
				this.showMarkers();
		});
	}

	// Création des markers
	showMarkers()
	{
		this.markerCluster = L.markerClusterGroup();

		for (var i = 0; i < this.api.length; i++)
		{
			const station = this.api[i];
			var imageLink = "";

			if (station.available_bikes >= 8)
			{
				imageLink = "marker_icon_green";
			}
			else if (station.available_bikes >= 5)
			{
				imageLink = "marker_icon_orange";
			}
			else if (station.available_bikes <= 4)
			{
				imageLink = "marker_icon_red";
			}


			const markerIcon = L.icon({
				iconUrl: `images/${imageLink}.png`,
				iconSize:     [38, 48]
			});

			this.marker = L.marker(station.position, {icon: markerIcon});
			this.marker.bindPopup("<b>" + station.name + "</b><br>" + station.address);
			this.markerCluster.addLayer(this.marker);
			this.infoStation(station);
		}

		this.map.addLayer(this.markerCluster);
	}

	// Renvoi les informations de la station lors du clique sur le marker
	infoStation(station) {
		this.marker.addEventListener('click', () => {
			this.station = station;
			console.log(this.station);
			document.getElementById("form").style.display = "flex";
			document.getElementById("formPlace").textContent = this.station.bike_stands;
			document.getElementById("formAddr").textContent = this.station.address;
			document.getElementById("formDisp").textContent = this.station.available_bikes;
			document.getElementById("formStation").textContent = this.station.status + " | "  + this.station.name;
			document.getElementById("formStation").style.fontWeight = "900";
			document.getElementById("formDisp").style.fontWeight = "900";
			localStorage.removeItem("station");
			localStorage.removeItem("nom");
			localStorage.removeItem("prenom");
			localStorage.setItem("Station", this.station.name);
			if (this.station.available_bikes >= 8){
				document.getElementById("formDisp").style.color = "#00e640";
				document.getElementById("formDisp").textContent += " (Beaucoup)";
			}
			else if (this.station.available_bikes >= 5){
				document.getElementById("formDisp").style.color = "#f9690e";
				document.getElementById("formDisp").textContent += " (Normal)";
			}
			else if (this.station.available_bikes <= 4){
				document.getElementById("formDisp").style.color = "red";
				document.getElementById("formDisp").textContent += " (Faible)";

			}
		});
	}
}


