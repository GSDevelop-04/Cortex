var xm=0,
	ym=0,
	nombre=0,
	sx=0,
	sy=0,
	sxy=0,
	sx2=0,
	sxxmyym=0,
	sxxm2=0
	sy2=0,
	sxy2=0;
	
var perf=0;
	
function apprend(vit,deltateta,entree) {
// Apprentissage
		
        
	var d2=entree[1];
	var d3=entree[2];
	var d4=entree[3];
	
	var c0=1.0*apprenti.coefs[0];
	var c1=1.0*apprenti.coefs[1];
	var c2=1.0*apprenti.coefs[2];
	
	var erreur_delta_teta=c0*d4-c0*d2-deltateta;
	var erreur_vitesse=c2*d3+c1-vit;
	var dcalc=c0*d4-c0*d2;
	var vcalc=10*(c2*d3+c1);
	csv+=d2+";"+d4+";;;;;"+deltateta+";"+d3+";"+vit+"\r";
	var erreur2=erreur_delta_teta*erreur_delta_teta; 
	if ((erreur2+0.002)!=0) perf=0.01*0.0002/(erreur2+0.0002)*100+0.99*perf; // filtre passe bas
	performance.value=Math.trunc(perf);	
	//console.log(d3+"/"+c1+"/"+c2);
	//console.log( "vitesse: " + Math.trunc(vit)+"/"+Math.trunc((c2*d3+c1))+ "    delta: "+ Math.trunc(deltateta*1000)+ "/" + Math.trunc(1000*(c0*d4-c0*d2)));
	
	// regression direction		
	// if ((d4-d2)<150) {			
		sxy+=(d4-d2)*deltateta;
		sx2+=(d4-d2)*(d4-d2);
		sy2+=deltateta*deltateta;
		//sxy2+=deltateta*deltateta-(d4-d2)*(d4-d2);
		
		if ((sx2!=0)&&(sxy!=0)) apprenti.coefs[0]=(sxy/sx2+sy2/sxy)/2;
	//}	

	
	// regression vitesse		
	
	nombre++;
	sy+=vit;
	sx+=d3;
	xm=sx/nombre;
	ym=sy/nombre;
	sxxmyym+=(d3-xm)*(vit-ym);
	sxxm2+=Math.pow((d3-xm),2);
	//console.log(sxxm2);
	if (sxxm2!=0) apprenti.coefs[2] = sxxmyym/sxxm2;		
	apprenti.coefs[1] = ym-apprenti.coefs[2]*xm;
	
	// Affichage Volants
	ctx.save();
	ctx.translate(posVolantX,posVolantY);
	ctx.rotate(deltateta*20);
	ctx.drawImage(volantProf,-75,-75,150,150);
	ctx.restore();
		
	ctx.save();
	ctx.translate(posVolantX,posVolantY);
	ctx.rotate(-c0*d4+c0*d2*20);
	ctx.drawImage(volantEleve,-75,-75,150,150);
	ctx.restore();


}

function conduit(entree) {
	
		c0=apprenti.coefs[0];
		c1=apprenti.coefs[1];
		c2=apprenti.coefs[2];
		
		var d2=entree[1];
		var d3=entree[2];
		var d4=entree[3];
		
		if (temps%balay==0) { // lidar plus lent que affichage
			// en lineaire
			apprenti.teta+=(c0*d4-c0*d2)*balay;  // reseau de neurones
			apprenti.vitesse=c2*d3+c1;
						
		}
}