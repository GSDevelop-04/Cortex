// Sylvain Grimal c2020

function apprend(vit,deltateta) {
// Apprentissage
		
		var d2=intercep(professeur.x,professeur.y,professeur.teta+teta2); 
		var d3=intercep(professeur.x,professeur.y,professeur.teta+teta3);
		var d4=intercep(professeur.x,professeur.y,professeur.teta+teta4);
        
		var c0=apprenti.coefs[0];
		var c1=apprenti.coefs[1];
		var c2=apprenti.coefs[2];
		
		var erreur_delta_teta=c0*d4-c0*d2-deltateta;
		var erreur_vitesse=c2*d3+c1-vit/10;
		
		console.log( "vitesse: " + Math.trunc(vit)+"/"+Math.trunc((c2*d3+c1)*10)+ "    delta: "+ Math.trunc(deltateta*1000)+ "/" + Math.trunc(1000*(c0*d4-c0*d2)));
		
		if ((d2-d4)!=0) apprenti.coefs[0]+= -rythme*erreur_delta_teta/(d4-d2);
  		apprenti.coefs[1]+= -rythme*erreur_vitesse/10;
		apprenti.coefs[2]+= -rythme*erreur_vitesse/d3/10;
}

function conduit(d1,d2,d3,d4,d5) {
	
		c0=apprenti.coefs[0];
		c1=apprenti.coefs[1];
		c2=apprenti.coefs[2];
		
		if (temps%balay==0) { // lidar plus lent que affichage
			// en lineaire
			apprenti.teta+=c0*d4-c0*d2;  // reseau de neurones
			apprenti.vitesse=c2*d3+c1;
						
			// Limitation Vitesse maxi
			if (apprenti.vitesse>vitesseMax) apprenti.vitesse=vitesseMax;
		}
}