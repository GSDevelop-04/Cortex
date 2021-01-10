// Sylvain Grimal c2020

var pNc = [	[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0]];
var rpCachee = [[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0]];			
			
var pNs = [0,0,0,0,0];
var rpDir = [0,0,0,0,0];

var nbApp=0;

var  	entree= [0,0,0,0,0];
		inter = [0,0,0,0,0];
		
var perf=0;


function sigmoid (x) {
	return 1/(1+Math.pow(Math.E, (-x)))-0.5;
}

function propage (entree) {
	var retour =[0,0];
	// calcul couche cachée

	for (var n=0; n < inter.length; n++) {
		inter[n]=0;	
		for (var e=0; e < entree.length; e++) {
			inter[n] += pNc [n][e] * entree[e];
		}   
		//console.log(inter[n]);
	}
	
	for (var n=0; n < inter.length; n++) {
		   inter[n] = sigmoid(inter[n]);
	    //console.log(inter[n]);
	}
	
	
	// calcul sortie dir
	var dir=0;
	for (var n=0; n < inter.length; n++) {
		dir += pNs[n] * inter[n];  
	}
	dir = sigmoid(dir);
	retour[0]=100;
	retour[1]=dir;
	//console.log(dir);
	return retour;
}

function apprend(vit,deltateta,entree) {
// Apprentissage

	var calcul = propage(entree);
	// calcul erreur sortie
	var erreur_delta_teta=(deltateta-calcul[1]);		
	//console.log(deltateta+" / "+calcul[1]+ " / " + perf);
	var erreur2=erreur_delta_teta*erreur_delta_teta; 
	perf=0.01*0.0002/(erreur2+0.0002)*100+0.99*perf; // filtre passe bas
	//console.log("cible delta: "+ Math.trunc(deltateta*1000)/1000+ " Calcul: " + Math.trunc(1000*(calcul[1]))/1000);	
	//	console.log("Erreur delta: "+ Math.trunc(erreur_delta_teta*1000)/1000);
	//reseau.value+="Perf: "+Math.trunc((sigmoid(0.001/perf)+.5)*1000)/10;
	//performance.value=Math.trunc((sigmoid(0.0001/perf)+.5)*1000)/10;
	performance.value=Math.trunc(perf);	
	
	// Affichage Volants
	ctx.save();
	ctx.translate(posVolantX,posVolantY);
	ctx.rotate(deltateta*20);
	ctx.drawImage(volantProf,-75,-75,150,150);
	ctx.restore();
		
	ctx.save();
	ctx.translate(posVolantX,posVolantY);
	ctx.rotate(calcul[1]*20);
	ctx.drawImage(volantEleve,-75,-75,150,150);
	ctx.restore();
	
	// retropropagation
	// direction		

	for ( var n = 0; n<inter.length; n++) {
		rpDir[n] =  -erreur_delta_teta * (calcul[1]+0.5) * (1 - (calcul[1]+0.5)) * inter[n];
		//rpDir[n] =  -erreur_delta_teta * inter[n];
	}
	//console.log("rpDir: "+ rpDir);
	// Intermediaire
	

						
	for ( var n = 0; n<inter.length; n++) {
		for ( var e = 0; e<entree.length; e++) {
		    rpCachee[n][e] = -pNs[n]*erreur_delta_teta*(inter[n]+0.5)*(1-(inter[n]+0.5))*entree[e];
		    //rpCachee[n][e] = -pNs[n]*erreur_delta_teta*entree[e];
		}
	}

	nbApp++;

	// calcul des poids couche de sortie
	if (nbApp>=1) {
		nbApp=0;
		for ( var n = 0; n<rpDir.length; n++) {
			pNs[n] -= rythme * rpDir[n];
		}
		
		var texte="";
		for (var j = 0; j<rpDir.length; j++) {
			texte+=Math.trunc(1000*pNs[j])/1000+" ";
		}
		//console.log("Neurones Sortie");
		reseau.value="Poids couche sortie:\r"+texte+"\r";

		
		// calcul des poids couche cachée
		
		for ( var i = 0; i<rpCachee.length; i++) {
			for ( var j = 0; j<rpCachee[i].length; j++) {
				pNc[i][j] -= rythme * rpCachee[i][j];
			}
		}
		reseau.value+="Poids couche cachée:\r"
		//console.log ("Couche cachée");
		for ( var i = 0; i<rpCachee.length; i++) {
			texte="";
			for ( var j = 0; j<rpCachee[i].length; j++) {
				texte+=Math.trunc(pNc[i][j]*1000)/1000+"\t";
			}
			reseau.value+=texte+"\r";
		}

		rpDir = [0,0,0,0,0];
		rpCachee = [[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0]];	
	}
}

function conduit(entree) {
		
		var calcul = propage(entree);
		
		if (temps%balay==0) { // lidar plus lent que affichage
			// en lineaire
			apprenti.teta+=(calcul[1])*balay
			apprenti.vitesse=(calcul[0]);
		}
}