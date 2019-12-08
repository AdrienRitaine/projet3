// MAP //

class Maps
{
	constructor(api_key, longLat, ville, id)
	{
		this.longLat = longLat; // Coordonnées de la carte
		this.api_key = api_key; // Clé pour l'API
		this.id = id; // id de la map
		this.ville = ville; // Ville selectionnée

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
			$("#signInput").css('display', 'block');
		});

		//Retour signer
		document.getElementById("retour").addEventListener("click", function(){
			$("#formInput").css('display', 'block');
			$("#signInput").css('display', 'none');
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
		$.getJSON('https://api.jcdecaux.com/vls/v1/stations?contract=' + this.ville + '&apiKey=' + this.api_key)
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
			const station = this.api[i]; // On récupére chaque informations de la station.

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
				iconUrl: 'images/'+imageLink+'.png',
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
	infoStation(station)
	{
		this.marker.addEventListener('click', () => {
			this.station = station;
			console.log(this.station);
			$('#form').css('display', 'flex')
			$("#formPlace").text(this.station.bike_stands);
			$("#formAddr").text(this.station.address);
			$("#formDisp").text(this.station.available_bikes);
			$("#formStation").text(this.station.status + " | "  + this.station.name);
			$("#formStation").css('fontWeight', '900');
			$("#formDisp").css('fontWeight', '900');
			localStorage.removeItem("station");
			localStorage.removeItem("nom");
			localStorage.removeItem("prenom");
			localStorage.setItem("Station", this.station.name);
			if (this.station.available_bikes >= 8)
			{
				$("#formDisp").css('color', '#00e640');
				$("#formDisp").text(" (Beaucoup)");
			}
			else if (this.station.available_bikes >= 5)
			{
				$("#formDisp").css('color', '#f9690e');
				$("#formDisp").text(" (Normal)");
			}
			else if (this.station.available_bikes <= 4)
			{
				$("#formDisp").css('color', 'red');
				$("#formDisp").text(" (Faible)");
			}
		});
	}
}


