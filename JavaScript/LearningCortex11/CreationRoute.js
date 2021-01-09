// Sylvain Grimal c2020

var nbTroncon = 18;
var rExtMax=340, xc=400,yc=300, xy=0.75, larRoute=130, lambda=0.12, lambdaR=0.1;
var vitesse_defaut=100;
var x1 = new Array(nbTroncon*2);
var y1 = new Array(nbTroncon*2);
var x2 = new Array(nbTroncon*2);
var y2 = new Array(nbTroncon*2);

var ratio_traj=3;
var nb_traj = nbTroncon/ratio_traj;
var x_traj = new Array(nb_traj);
var y_traj = new Array(nb_traj);
var vx_traj = new Array(nb_traj);
var vy_traj = new Array(nb_traj);
var vit_traj = new Array(nb_traj);



function creerRoute() {
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

	x_traj[0]=(x1[0]+x1[nbTroncon])/2;
	y_traj[0]=(y1[0]+y1[nbTroncon])/2;
	
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
		if (Math.trunc(i/ratio_traj)==i/ratio_traj) {
			x_traj[i/ratio_traj]=(x1[i]+x1[i+nbTroncon])/2;
			y_traj[i/ratio_traj]=(y1[i]+y1[i+nbTroncon])/2;
		}
	}
	x1[nbTroncon-1]= x2[nbTroncon-2];	
	y1[nbTroncon-1]= y2[nbTroncon-2];		
	x2[nbTroncon-1]= x1[0];	
	y2[nbTroncon-1]= y1[0];

	x1[2*nbTroncon-1]= x2[2*nbTroncon-2];		
	y1[2*nbTroncon-1]= y2[2*nbTroncon-2];	
	x2[2*nbTroncon-1]= x1[nbTroncon];	
	y2[2*nbTroncon-1]= y1[nbTroncon];
  
	x_traj[nb_traj]=(x1[nbTroncon]+x1[2*nbTroncon])/2;
	y_traj[nb_traj]=(y1[nbTroncon]+y1[2*nbTroncon])/2;
	
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
	
		
	// calcul des tangentes
	
	//ctx.moveTo(x_traj[0],y_traj[0]);
	vx_traj[0]=(-x_traj[nb_traj-1]+x_traj[1])/1.5;
	vy_traj[0]=(-y_traj[nb_traj-1]+y_traj[1])/1.5;
	vit_traj[0]=vitesse_defaut;
	//console.log(vx_traj[0]+" / " +vy_traj[0]);

	for (var i=1; i<nb_traj-1; i+=1){
	//	ctx.lineTo(x_traj[i],y_traj[i]);
		vx_traj[i]=(-x_traj[i-1]+x_traj[i+1])/1.5;
		vy_traj[i]=(-y_traj[i-1]+y_traj[i+1])/1.5;
		vit_traj[i]=vitesse_defaut;
	}

	vx_traj[nb_traj-1]=(-x_traj[nb_traj-2]+x_traj[0])/1.5;
	vy_traj[nb_traj-1]=(-y_traj[nb_traj-2]+y_traj[0])/1.5;
	vit_traj[nb_traj-1]=vitesse_defaut;
	
}


function afficher_trajectoire() {
	ctx.beginPath();
	ctx.strokeStyle='blue';
	ctx.lineWidth = 3;
	ctx.font='16pt Arial';
	
	for (var i=0; i<=nb_traj-1; i+=1){
			ctx.beginPath();
            if (memo_actif==i)	{ctx.strokeStyle='red';}
			ctx.arc(x_traj[i],y_traj[i], 12, 0, 2 * Math.PI);

			// texte de vitesse
			ctx.stroke();
			ctx.strokeStyle='blue';
			ctx.lineWidth = 2;
			ctx.strokeText("  "+vit_traj[i],x_traj[i],y_traj[i])
			ctx.lineWidth = 3;
			
			// tangente
			ctx.beginPath();
			ctx.moveTo(x_traj[i],y_traj[i]);
			ctx.lineTo(x_traj[i]+vx_traj[i]/5,y_traj[i]+vy_traj[i]/5);
			ctx.stroke();
			
			// point de passage
			ctx.beginPath();
			ctx.arc(x_traj[i]+vx_traj[i]/5,y_traj[i]+vy_traj[i]/5, 8, 0, 2 * Math.PI);
			ctx.stroke();
						
			// trajectoire
			ctx.beginPath();
			ctx.moveTo(x_traj[i],y_traj[i]);
			for (var t=0; t<=1; t+=.1){
			   ctx.lineTo(trajectoire.x(i,t),trajectoire.y(i,t));
			}	
			ctx.stroke();
	}

}

