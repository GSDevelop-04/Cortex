// Sylvain Grimal c2019

var canvas,
    ctx,
    gameLoop,	
	ImgVoiture,
	coupe,
	distances,
	tauxMutation,
	fond,
	temps;
	
    listeVoitures = new Array();
	coefs = new Array(3);
	
var premier=-1;
// var k0=.09, k1=100, k2= 0.5;	
var k0=.02, k1=150, k2= 0.1;	

var nbVoiture=12,
    balay=2, // 2 pour 10 hz 3 pour 6 hz
	vitesseMax=15;

var teta1 = -Math.PI/2
var teta2 = -Math.PI/4
var teta3 = 0
var teta4 = Math.PI/4
var teta5 = Math.PI/2


var largeurJeu = 800; 
	hauteurJeu = 600; 
	

function cestparti() {
    canvas = document.getElementById("espace");
    ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    imgVoiture = document.getElementById("voiture");
    coupe = document.getElementById("coupe");
    distances = document.getElementById("distances");
    tauxMutation = document.getElementById("tauxMutation");	
	creerRoute();		
	// Création de 10 voitures
	for (var i=0; i<nbVoiture; i=i+1){
		coefs[0]=Math.random()*k0;	
		coefs[1]=Math.random()*k1;
		coefs[2]=Math.random()*k2;
		
        listeVoitures[i] = new voiture(400, (y1[Math.floor(nbTroncon*1/4)]+y1[Math.floor(nbTroncon*5/4)])/2, Math.PI/2, 3,0, coefs, imgVoiture);
	}

	fond=ctx.getImageData(0,0,800,600);

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
	// calcul
    for (i=0; i<nbVoiture;i+=1){
		listeVoitures[i].x+=0.6*listeVoitures[i].vitesse*Math.sin(listeVoitures[i].teta);
		listeVoitures[i].y+=-0.6*listeVoitures[i].vitesse*Math.cos(listeVoitures[i].teta);
		listeVoitures[i].distance+=listeVoitures[i].vitesse*0.05;
	}
	//affichage
	ctx.putImageData(fond,0,0);
	var dist=0;
	var vitesseMoyenne;
	
	// qui a parcouru le plus de distance ?
	for (i=0; i<nbVoiture;i+=1)
		if (dist<listeVoitures[i].distance) {dist=listeVoitures[i].distance; premier=i;}
	
	// calcul pour toutes les voitures
	distances.value="vit. \t C0 \t C1 \t C2\r";
    for (i=0; i<nbVoiture;i+=1){
		dist=listeVoitures[i].distance;	
		vitesseMoyenne=Math.floor(listeVoitures[i].vitesse*10);
		var c0=Math.floor(listeVoitures[i].coefs[0]*10000)/10000;
		var c1=Math.floor(listeVoitures[i].coefs[1]);
		var c2=Math.floor(listeVoitures[i].coefs[2]*1000)/1000;
		
		if (i==premier) {
			distances.value+=vitesseMoyenne.toString()+"\t"+c0.toString()+"\t"+c1.toString()+"\t"+c2.toString()+" Premier\r";
			ctx.save();
			ctx.translate(listeVoitures[i].x,listeVoitures[i].y-40);
			ctx.drawImage(coupe,-15,-15,30,30);
			ctx.restore();
			
		}
		else distances.value+=vitesseMoyenne.toString()+"\t"+c0.toString()+"\t"+c1.toString()+"\t"+c2.toString()+"\r";
		
		ctx.save();
		ctx.translate(listeVoitures[i].x,listeVoitures[i].y);
		ctx.rotate(listeVoitures[i].teta);
		ctx.drawImage(listeVoitures[i].image,-20,-20,40,40);
		ctx.restore();
		var d1=intercep(listeVoitures[i].x,listeVoitures[i].y,listeVoitures[i].teta+teta1); 
		var d2=intercep(listeVoitures[i].x,listeVoitures[i].y,listeVoitures[i].teta+teta2); 
		var d3=intercep(listeVoitures[i].x,listeVoitures[i].y,listeVoitures[i].teta+teta3);
		var d4=intercep(listeVoitures[i].x,listeVoitures[i].y,listeVoitures[i].teta+teta4);
		var d5=intercep(listeVoitures[i].x,listeVoitures[i].y,listeVoitures[i].teta+teta5); 
		
		// accident
		if ((d1<20)||(d2<20)||(d3<20)||(d4<20)||(d5 <20)) listeVoitures[i].vitesse=0;
		
		/* en tout ou rien
		if (d2<d4) listeVoitures[i].teta+=0.1;
		else listeVoitures[i].teta-=0.1;
		if (d3>60) listeVoitures[i].vitesse+=.08;
		else listeVoitures[i].vitesse-=1.8*/
		
		if (temps%balay==0) {
			// en lineaire
			listeVoitures[i].teta+=c0*d4-c0*d2;
			listeVoitures[i].vitesse+=c2*(d3-c1);
			// Limitation Vitesse maxi
			if (listeVoitures[i].vitesse>vitesseMax) listeVoitures[i].vitesse=vitesseMax;
		}		
	}
}

function nouvelleGeneration() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var c0=listeVoitures[premier].coefs[0];
	var c1=listeVoitures[premier].coefs[1];
	var c2=listeVoitures[premier].coefs[2];
	// Création de 10 voitures
	coefs[0]=c0;
	coefs[1]=c1;
	coefs[2]=c2;
	listeVoitures[0] = new voiture(400, (y1[Math.floor(nbTroncon*1/4)]+y1[Math.floor(nbTroncon*5/4)])/2, Math.PI/2 , 3,0, coefs, imgVoiture);
	for (var i=1; i<nbVoiture; i=i+1){
		taux=tauxMutation.value/100;
		coefs[0]=c0*(1-taux) + Math.random()*k0*taux;
		coefs[1]=c1*(1-taux) + Math.random()*k1*taux;
		coefs[2]=c2*(1-taux) + Math.random()*k2*taux;
		
        listeVoitures[i] = new voiture(400, (y1[Math.floor(nbTroncon*1/4)]+y1[Math.floor(nbTroncon*5/4)])/2, Math.PI/2, 3,0, coefs, imgVoiture);
	}
	temps=0;
}

function voiture(x,y,teta,vitesse, distance,coefs,image){
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


window.onload = cestparti;