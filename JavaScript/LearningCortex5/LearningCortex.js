﻿// sylvain Grimal c2020

var canvas,
    ctx,
    gameLoop,	
	ImgVoiture,
	distances,
	vitesse_slider,
	rythme_slider,
	fond,
	temps,
	apprenti,
	professeur;
	
	coefs = new Array(3);

var memo_passage = -1,
	memo_vitesse = -1;
	memo_actif = -1;


var balay=2, // 2 pour 10 hz 3 pour 6 hz
	vitesseMax=15;

var teta=0;

var teta1 = -Math.PI/2
var teta2 = -Math.PI/4
var teta3 = 0
var teta4 = Math.PI/4
var teta5 = Math.PI/2

var rythme=0.0;

var largeurJeu = 800; 
	hauteurJeu = 600; 
	

function cestparti() {
    canvas = document.getElementById("espace");
    ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    imgVoiture = document.getElementById("voiture");
	imgVoitureProf = document.getElementById("voitureProf");
	
    distances = document.getElementById("distances");
    vitesse_slider = document.getElementById("vitesse");	
    rythme_slider = document.getElementById("rythme");
	creerRoute();		
	// Création d'une voiture
	coefs[0]=0.00;
	coefs[1]=0;
	coefs[2]=0.0;
		

	fond=ctx.getImageData(0,0,800,600);
	afficher_trajectoire();
	

	setTimeout(function(){
       	canvas.focus();
		temps=0;
    	gameLoop = setInterval(bouclePrincipale, 50);  // 20 fps
     }, 1000); 
}

function intercep(x,y,teta){
	var dMin=999,iMin;
	var cosTeta=Math.cos(teta);
	var sinTeta=Math.sin(teta);
	
	for (var i=0; i<2*nbTroncon; i+=1) {	  
	  var l = ((x-x1[i])*cosTeta+(y-y1[i])*sinTeta) / ((x2[i]-x1[i])*cosTeta+(y2[i]-y1[i])*sinTeta);
	  if (l>=0 && l<=1) {
		var d= ((x1[i]-x)*(y2[i]-y1[i])+(y-y1[i])*(x2[i]-x1[i])) / ((y2[i]-y1[i])*sinTeta+(x2[i]-x1[i])*cosTeta);
		if (d<dMin && d>0) {
			dMin=d;
			iMin=i;
		}
	  }
	}

	ctx.beginPath();	
	ctx.strokeStyle='black';
	ctx.setLineDash([2, 5]);
	ctx.lineWidth = 1;	
	ctx.moveTo(x,y);
	ctx.lineTo(x+sinTeta*dMin,y-cosTeta*dMin);
	ctx.stroke();
	
	ctx.beginPath();	
	ctx.strokeStyle='red';
	ctx.setLineDash([]);
	ctx.lineWidth = 3;	
	ctx.moveTo(x1[iMin],y1[iMin]);
	ctx.lineTo(x2[iMin],y2[iMin]);
	ctx.stroke();

	return dMin;
}

function bouclePrincipale() {
	temps+=1;	
	//affichage
	ctx.putImageData(fond,0,0);
	afficher_trajectoire();	
	// calcul

    if (professeur) {
		
		// determination de la trajectoire
		
		var t=professeur.gama;
		// position entre le point n de la trajectoire et np
		var n=professeur.troncon;
				
		var nvx=trajectoire.x(n,t);
		var nvy=trajectoire.y(n,t);
		var vit=trajectoire.vit(n,t);
		
		// calcul de la nouvelle position
		
		while (Math.pow(nvx-professeur.x,2)+Math.pow(nvy-professeur.y,2)< Math.pow(0.06*professeur.vitesse,2)) {
			if (t<1) t=t+0.001; // en est toujours sur le troncon
			else { 				// troncon suivant
				professeur.troncon++;
				if( professeur.troncon==nb_traj) professeur.troncon=0;
				t=0;
				break;		  
		    }
			nvx=trajectoire.x(n,t);
			nvy=trajectoire.y(n,t);
			vit=trajectoire.vit(n,t);
		}
		
		// direction du deplacement
		
		teta=Math.atan2(nvx-professeur.x,-nvy+professeur.y);
		var deltateta=teta-professeur.teta; // evolution
		if (deltateta>Math.PI) deltateta=deltateta-2*Math.PI;
		if (deltateta<-Math.PI) deltateta=deltateta+2*Math.PI;	
 		// en cas d'erreur de calcul
		if (deltateta>0.1) deltateta=0;
		if (deltateta<-0.1) deltateta=0;	
 		
		
		professeur.x=nvx;
		professeur.y=nvy;
		professeur.gama=t;
		professeur.vitesse = vit;
		professeur.teta = teta;
		
		// Affichage
		ctx.save();
		ctx.translate(professeur.x,professeur.y);
		ctx.rotate(professeur.teta);
		ctx.drawImage(professeur.image,-20,-20,40,40);
		ctx.restore();
		
        apprend(vit,deltateta); 

		
		
	}
	if (apprenti) {
		// déplacement
		apprenti.x+=0.6*apprenti.vitesse*Math.sin(apprenti.teta);
		apprenti.y+=-0.6*apprenti.vitesse*Math.cos(apprenti.teta);
	
		distances.value="vit. \t C0 \t C1 \t C2\r";
		
		// arrondi pour affichage

		var c0=Math.floor(apprenti.coefs[0]*10000)/10000;
		var c1=Math.floor(apprenti.coefs[1]*100)/100;
		var c2=Math.floor(apprenti.coefs[2]*1000)/1000;
		distances.value+=Math.trunc(apprenti.vitesse*10).toString()+"\t"+c0.toString()+"\t"+c1.toString()+"\t"+c2.toString()+"\r";
		
		// capture des distances
		var d1=intercep(apprenti.x,apprenti.y,apprenti.teta+teta1); 
		var d2=intercep(apprenti.x,apprenti.y,apprenti.teta+teta2); 
		var d3=intercep(apprenti.x,apprenti.y,apprenti.teta+teta3);
		var d4=intercep(apprenti.x,apprenti.y,apprenti.teta+teta4);
		var d5=intercep(apprenti.x,apprenti.y,apprenti.teta+teta5); 
		
		// si accident on repart  au début
		if ((d1<20)||(d2<20)||(d3<20)||(d4<20)||(d5 <20)) {
            apprenti.x=professeur.x;
			apprenti.y=professeur.y;
			apprenti.teta= professeur.teta;
			apprenti.vitesse=0;
		}

		// calcul de la reaction
		
		conduit(d1,d2,d3,d4,d5);
				
		// Affichage
		ctx.save();
		ctx.translate(apprenti.x,apprenti.y);
		ctx.rotate(apprenti.teta);
		ctx.drawImage(apprenti.image,-20,-20,40,40);
		ctx.restore();
	
	}
}

function souris_appui(event) {
	var souris_x = event.offsetX;
    var souris_y = event.offsetY; 
	console.log("appui "+souris_x+"/"+souris_y);
	for (var i=0; i<nb_traj; i+=1){
		if (Math.pow(x_traj[i]-souris_x,2)+Math.pow(y_traj[i]-souris_y,2)<100) {
			console.log(i);
			memo_passage=i;
			memo_actif=i;
			vitesse_slider.value=vit_traj[i];
		}
		if (Math.pow(x_traj[i]+vx_traj[i]/5-souris_x,2)+Math.pow(y_traj[i]+vy_traj[i]/5-souris_y,2)<100) {
			console.log(i);
			memo_vitesse=i;
		}
	}
}

function souris_bouje(event) {
	var souris_x = event.offsetX;
    var souris_y = event.offsetY; 

	if (memo_passage>=0) {
		console.log("relache"+souris_x+"/"+souris_y);	
		x_traj[memo_passage]=souris_x;
		y_traj[memo_passage]=souris_y;
	}
	if (memo_vitesse>=0) {
		console.log("relache"+souris_x+"/"+souris_y);	
		vx_traj[memo_vitesse]=(souris_x-x_traj[memo_vitesse])*5;
		vy_traj[memo_vitesse]=(souris_y-y_traj[memo_vitesse])*5;
	}
	afficher_trajectoire()
}

function souris_relache(event) {

	memo_passage=-1;
	memo_vitesse=-1;
	afficher_trajectoire()
}

function vitesse_bouje(event) {
	if (memo_actif>=0) {
		vit_traj[memo_actif]=parseInt(vitesse_slider.value);
		afficher_trajectoire()
	}
}

function rythme_bouje(event) {

	rythme=parseFloat(rythme_slider.value/1000);
	console.log(rythme);	
}

function apprentissage() {
   apprenti = new voiture_apprenti(x_traj[0], y_traj[0], - Math.PI, 5,0, coefs, imgVoiture);
   professeur = new voiture_professeur(x_traj[0], y_traj[0], 0, - Math.PI,0,vit_traj[0], imgVoitureProf);
}

function voiture_apprenti(x,y,teta,vitesse, distance,coefs,image){
 	this.x = x;
 	this.y = y;
 	this.teta = teta;
	this.vitesse = vitesse;
	this.distance = distance;
 	this.image = image;
	this.coefs = new Array(3);
	this.coefs[0]=coefs[0];
	this.coefs[1]=coefs[1];
	this.coefs[2]=coefs[2];

}

function voiture_professeur(x,y,troncon,teta,gama, vitesse,image){
 	this.x = x;
 	this.y = y;
 	this.troncon = troncon;
	this.teta = teta;	
	this.gama= gama;
	this.vitesse = vitesse;
 	this.image = image;
}

var trajectoire = {
    x:function (n,t) {
		var pn=n+1;
		if (pn==nb_traj) {pn=0};
		
		// courbe parametrique en fct de t calcul des coefs ax ay bx by
		var ax=vx_traj[pn]-2*x_traj[pn]+vx_traj[n]+2*x_traj[n];
		var ay=vy_traj[pn]-2*y_traj[pn]+vy_traj[n]+2*y_traj[n];
		var bx=-vx_traj[pn]+3*x_traj[pn]-2*vx_traj[n]-3*x_traj[n];
		var by=-vy_traj[pn]+3*y_traj[pn]-2*vy_traj[n]-3*y_traj[n];
		return ax*t*t*t+bx*t*t+vx_traj[n]*t+x_traj[n];
	},
	y:function (n,t){ 
		var pn=n+1;
		if (pn==nb_traj) {pn=0};
		
		// courbe parametrique en fct de t calcul des coefs ax ay bx by
		var ax=vx_traj[pn]-2*x_traj[pn]+vx_traj[n]+2*x_traj[n];
		var ay=vy_traj[pn]-2*y_traj[pn]+vy_traj[n]+2*y_traj[n];
		var bx=-vx_traj[pn]+3*x_traj[pn]-2*vx_traj[n]-3*x_traj[n];
		var by=-vy_traj[pn]+3*y_traj[pn]-2*vy_traj[n]-3*y_traj[n];
		return ay*t*t*t+by*t*t+vy_traj[n]*t+y_traj[n];
	},
	vit:function(n,t){
			var pn=n+1;
		if (pn==nb_traj) {pn=0};
		
		// courbe parametrique en fct de t calcul des coefs ax ay bx by
		var ax=vx_traj[pn]-2*x_traj[pn]+vx_traj[n]+2*x_traj[n];
		var ay=vy_traj[pn]-2*y_traj[pn]+vy_traj[n]+2*y_traj[n];
		var bx=-vx_traj[pn]+3*x_traj[pn]-2*vx_traj[n]-3*x_traj[n];
		var by=-vy_traj[pn]+3*y_traj[pn]-2*vy_traj[n]-3*y_traj[n];
		return vit_traj[n] + t * (vit_traj[pn]-vit_traj[n]);	
	}
};


window.onload = cestparti;