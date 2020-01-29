"use strict";

// Ajout de la carte
var maps = new Map("9d52275b194f4eb0191ec9bb7f18ecb771942982", [49.8946874, 2.2953211], "Amiens", "map");
maps.addMap();
maps.getStations();

// Ajout du systeme de reservation (Canvas + decompte)
var canvas = new Canvas(document.querySelector("#canvas"), '2d', 1);
canvas.initCanvas();


// Ajout du Slider
var slider = new Slider(document.getElementsByClassName("slideImg"));
slider.launchSlider();



