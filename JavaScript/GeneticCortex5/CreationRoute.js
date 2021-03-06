﻿// Sylvain Grimal c2020

var nbTroncon;
var rExtMax=340, xc=400,yc=300, xy=0.75, larRoute=125, lambda=0.16, lambdaR=0.16;
var xDepart,yDepart,tetaDepart;
var vitesse_defaut=100;
var x1 = new Array;
var y1 = new Array;
var x2 = new Array;
var y2 = new Array;



function creerRoute() {
	nbTroncon = 18;
	posVolantX=400;
	posVolantY=300;
	ratio_traj=3;
	nb_traj = nbTroncon/ratio_traj;	
	
	x1 = new Array(nbTroncon*2);
	y1 = new Array(nbTroncon*2);
	x2 = new Array(nbTroncon*2);
	y2 = new Array(nbTroncon*2);

	x_traj = new Array(nb_traj);
	y_traj = new Array(nb_traj);
	vx_traj = new Array(nb_traj);
	vy_traj = new Array(nb_traj);
	vit_traj = new Array(nb_traj);
	

	
	console.log("Création route");
    var rayon;
	canvas = document.getElementById("espace");
    ctx = canvas.getContext("2d");
    imgVoiture = document.getElementById("voiture");

	// Initialisation de la route
	rayon = rExtMax*(1+Math.random()*lambda);
	x1[0]= xc + rayon* Math.cos(0);	
	y1[0]= yc + xy*rayon* Math.sin(0);
	rayon=rayon-larRoute*(1+Math.random()*lambdaR);
	x1[nbTroncon]= xc + rayon* Math.cos(0);	
	y1[nbTroncon]= yc + xy*rayon* Math.sin(0);	
	
	rayon = rExtMax*(1+Math.random()*lambda);
	x2[0]= xc + rayon* Math.cos(2*Math.PI/nbTroncon);	
	y2[0]= yc + xy*rayon* Math.sin(2*Math.PI/nbTroncon);
	rayon=rayon-larRoute*(1+Math.random()*lambdaR);
	x2[nbTroncon]= xc + rayon* Math.cos(2*Math.PI/nbTroncon);	
	y2[nbTroncon]= yc + xy*rayon* Math.sin(2*Math.PI/nbTroncon);	

	
	for (var i=1; i<nbTroncon-1; i+=1) {		
		var teta = 2 * Math.PI * i / nbTroncon;
		rayon = rExtMax*(1+Math.random()*lambda);
		x1[i]= x2[i-1];	
		y1[i]= y2[i-1];	
		x2[i]= xc + rayon* Math.cos(teta+2*Math.PI/nbTroncon);	
		y2[i]= yc + xy*rayon* Math.sin(teta+2*Math.PI/nbTroncon);
		rayon=rayon-larRoute*(1+Math.random()*lambdaR);
		x1[i+nbTroncon]= x2[i+nbTroncon-1];
		y1[i+nbTroncon]= y2[i+nbTroncon-1];		
		x2[i+nbTroncon]= xc + rayon* Math.cos(teta+2*Math.PI/nbTroncon);	
		y2[i+nbTroncon]= yc + xy*rayon* Math.sin(teta+2*Math.PI/nbTroncon);

	}
	x1[nbTroncon-1]= x2[nbTroncon-2];	
	y1[nbTroncon-1]= y2[nbTroncon-2];		
	x2[nbTroncon-1]= x1[0];	
	y2[nbTroncon-1]= y1[0];

	x1[2*nbTroncon-1]= x2[2*nbTroncon-2];		
	y1[2*nbTroncon-1]= y2[2*nbTroncon-2];	
	x2[2*nbTroncon-1]= x1[nbTroncon];	
	y2[2*nbTroncon-1]= y1[nbTroncon];
  

	
	// Affichage de la route exterieure
	ctx.beginPath();	
	ctx.fillStyle='grey';	
	ctx.moveTo(x1[0],y1[0]);
	for (var i=0; i<nbTroncon; i=i+1){
	  ctx.lineTo(x2[i],y2[i]);
	}
    ctx.fill();
	
	// Affichage de la route interieure
	ctx.beginPath();	
	ctx.fillStyle='green';	
	ctx.moveTo(x1[nbTroncon],y1[nbTroncon]);
	for (var i=nbTroncon; i<2*nbTroncon; i+=1){
	  ctx.lineTo(x2[i],y2[i]);
	}
    ctx.fill();
	
	for (var i=0; i<2*nbTroncon; i+=1){
		ctx.beginPath();	
		ctx.strokeStyle='black';
		ctx.lineWidth = 3;	
		ctx.moveTo(x1[i],y1[i]);
		ctx.lineTo(x2[i],y2[i]);
		ctx.stroke();

	}	
	

	
	xDepart=(x1[0]+x1[nbTroncon])/2;
	yDepart=(y1[0]+y1[nbTroncon])/2;
	tetaDepart=Math.PI;
	
}

