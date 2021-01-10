﻿var canvas,
    ctx,
    gameLoop,	
	ImgVoiture,
	volantProf,
	volantEleve,
	distances,
	vitesse_slider,
	rythme_slider,
	fond,
	temps,
	apprenti,
	professeur,
	performance,
	boutonRoute,
	boutonCircuit,
	itC0,
	itC1,
	itC2;
	
	coefs = new Array(3);

var csv="D2;D4;D4-D2;(D4-D2)²;(D4-D2)*Deltateta;C0;Delta Teta cible;D3;Vitesse cible\r";
	csv+=";;;somme;somme";

var memo_passage = -1,
	memo_vitesse = -1;
	memo_actif = -1;


var balay=2, // 2 pour 10 hz 3 pour 6 hz
	vitesseMax=150;
	inactif=true;

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
	volantProf = document.getElementById("volantProf");
	volantEleve = document.getElementById("volantEleve");
	boutonRoute = document.getElementById("boutonRoute");	
	boutonCircuit = document.getElementById("boutonCircuit");	
	
    distances = document.getElementById("distances");
    vitesse_slider = document.getElementById("vitesse");	
    rythme_slider = document.getElementById("rythme");
	performance = document.getElementById("performance");
	itC0 = document.getElementById("C0");
	itC1 = document.getElementById("C1");
	itC2 = document.getElementById("C2");
	
	
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
				
		var pasT=0.002;		
		var nvx=trajectoire.x(n,t+pasT);
		var nvy=trajectoire.y(n,t+pasT);
		var vit=trajectoire.vit(n,t+pasT);
		teta=trajectoire.teta(n,t+pasT);
		// calcul de la nouvelle position

		while (Math.pow(nvx-professeur.x,2)+Math.pow(nvy-professeur.y,2)< Math.pow(0.06*0.99*professeur.vitesse,2)) {
			t+=pasT; 
			nvx=trajectoire.x(n,t+pasT);
			nvy=trajectoire.y(n,t+pasT);
			vit=trajectoire.vit(n,t+pasT);
			teta=trajectoire.teta(n,t+pasT);
		}
		if (t+pasT	>=1) {  // en est plus sur le troncon
			professeur.troncon++;
			if( professeur.troncon==nb_traj) professeur.troncon=0;
			t=0;
		}	

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
		
		var d1=intercep(professeur.x,professeur.y,professeur.teta+teta1);
 		var d2=intercep(professeur.x,professeur.y,professeur.teta+teta2); 
		var d3=intercep(professeur.x,professeur.y,professeur.teta+teta3);
		var d4=intercep(professeur.x,professeur.y,professeur.teta+teta4);
		var d5=intercep(professeur.x,professeur.y,professeur.teta+teta5);
        if (apprenti.auto) apprend(vit,deltateta,[d1,d2,d3,d4,d5]); 

		
		
	}
	if (apprenti) {
		// déplacement
		apprenti.x+=0.06*apprenti.vitesse*Math.sin(apprenti.teta);
		apprenti.y+=-0.06*apprenti.vitesse*Math.cos(apprenti.teta);
	
		distances.value="vit. \t C0 \t C1 \t C2\r";
		
		// arrondi pour affichage

		var c0=Math.floor(apprenti.coefs[0]*10000)/10000;
		var c1=Math.floor(apprenti.coefs[1]*100)/100;
		var c2=Math.floor(apprenti.coefs[2]*1000)/1000;
		distances.value+=Math.trunc(apprenti.vitesse).toString()+"\t"+c0.toString()+"\t"+c1.toString()+"\t"+c2.toString()+"\r";
		
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
		
		conduit([d1,d2,d3,d4,d5]);
				
		// Affichage
		ctx.save();
		ctx.translate(apprenti.x,apprenti.y);
		ctx.rotate(apprenti.teta);
		ctx.drawImage(apprenti.image,-20,-20,40,40);
		ctx.restore();
	
	}
}

function route(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	creerRoute();
	fond=ctx.getImageData(0,0,800,600);
	afficher_trajectoire();
	if (inactif) {
		setTimeout(function(){
			canvas.focus();
			temps=0;
			gameLoop = setInterval(bouclePrincipale, 50);  // 20 fps
			}, 1000);
		inactif=false;
	} 

}

function circuit(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	creerCircuit();
	fond=ctx.getImageData(0,0,800,600);
	afficher_trajectoire();
	if (inactif) {
		setTimeout(function(){
			canvas.focus();
			temps=0;
			gameLoop = setInterval(bouclePrincipale, 50);  // 20 fps
			}, 1000);
		inactif=false;
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
	boutonRoute.disabled=true;
	boutonCircuit.disabled=true;
	// Création d'une voiture
	coefs[0]=0.00;
	coefs[1]=0;
	coefs[2]=0.0;
	
	professeur = new voiture_professeur(xDepart, yDepart, 0, tetaDepart,0,vit_traj[0], imgVoitureProf);
    apprenti = new voiture_apprenti(xDepart, yDepart, tetaDepart, 5,0, coefs, imgVoiture);
    
	apprenti.actif=true;
    apprenti.auto=true;
    xm=0,
	ym=0,
	nombre=0,
	sx=0,
	sy=0,
	sxy=0,
	sx2=0,
	sxxmyym=0,
	sxxm2=0;
	perf=0;
}

function enregistre () {

	var filename="essai.csv";
	
	var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

}

function init() {
	apprenti.coefs[0]=1.0*itC0.value; //1.0 sinon risque erreur java
	apprenti.coefs[1]=1.0*itC1.value;
	apprenti.coefs[2]=1.0*itC2.value;
	apprenti.x=professeur.x;
	apprenti.y=professeur.y;
	apprenti.teta= professeur.teta;
	apprenti.vitesse=0;
	apprenti.actif=true;
	apprenti.auto=false;
}
function efface() {
   console.log("reset fichier");
   d2+";"+d4+";;;;"+deltateta+";"+d3+";"+vit+"\r";   
   csv="D2;D4;D4-D2;(D4-D2)²;(D4-D2)*Deltateta;C0;Delta Teta cible;D3;Vitesse cible\r";
   csv+=";;;somme;somme";
}

function voiture_apprenti(x,y,teta,vitesse, distance,coefs,image){
 	this.x = x;
 	this.y = y;
 	this.teta = teta;
	this.vitesse = vitesse;
	this.distance = distance;
	this.actif=false;
	this.auto=false;
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
	},
	teta:function(n,t){
		var pn=n+1;
		if (pn==nb_traj) {pn=0};
		
		// courbe parametrique en fct de t calcul des coefs ax ay bx by
		var ax=vx_traj[pn]-2*x_traj[pn]+vx_traj[n]+2*x_traj[n];
		var ay=vy_traj[pn]-2*y_traj[pn]+vy_traj[n]+2*y_traj[n];
		var bx=-vx_traj[pn]+3*x_traj[pn]-2*vx_traj[n]-3*x_traj[n];
		var by=-vy_traj[pn]+3*y_traj[pn]-2*vy_traj[n]-3*y_traj[n];
		return Math.atan2(3*ax*t*t+2*bx*t+vx_traj[n],-(3*ay*t*t+2*by*t+vy_traj[n]));
	}
};


window.onload = cestparti;