// Sylvain Grimal c2020

var nbTroncon;
var pisteExt = [[200,10,1000,0,1],[540,10,500,0,10],[790,260,0,500,1],[790,400,0,800,16],[430,400,0,-800,1],[430,330,0,-100,20],[375,304,-53,45,1],[322,348,-1060,900,20]];
var pisteInt = [[200,110,500,0,1],[540,110,250,0,10],[690,260,0,250,1],[690,400,0,400,16],[530,400,0,-400,1],[530,330,0,-150,20],[311,228,-477,405,1],[260,270,-530,450,20]];
var posVolantX, posVolantY;
var xDepart,yDepart,tetaDepart;
var vitesse_defaut=100;
var x1 = new Array;
var y1 = new Array;
var x2 = new Array;
var y2 = new Array;

var ratio_traj;
var nb_traj;
var x_traj = new Array;
var y_traj = new Array;
var vx_traj = new Array;
var vy_traj = new Array;
var vit_traj = new Array;



function creerCircuit() {
	nbTroncon = 70;
	posVolantX=320, posVolantY=480;
	nb_traj = 10;
    ratio_traj=7;
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

	canvas = document.getElementById("espace");
    ctx = canvas.getContext("2d");
    imgVoiture = document.getElementById("voiture");

	// Initialisation de la route
    var i=0;
	for (n=0;n<pisteExt.length;n++) {
		var pn=n+1;
		if (pn==pisteExt.length) pn=0;
		console.log(pisteExt[n]+"->"+pisteExt[pn]);	
		for (j=0;j<pisteExt[n][4];j++) {
			var t=j/pisteExt[n][4];
			var pt=(j+1)/pisteExt[n][4];
			var ax=pisteExt[pn][2]-2*pisteExt[pn][0]+pisteExt[n][2]+2*pisteExt[n][0];
			var ay=pisteExt[pn][3]-2*pisteExt[pn][1]+pisteExt[n][3]+2*pisteExt[n][1];
			var bx=-pisteExt[pn][2]+3*pisteExt[pn][0]-2*pisteExt[n][2]-3*pisteExt[n][0];
			var by=-pisteExt[pn][3]+3*pisteExt[pn][1]-2*pisteExt[n][3]-3*pisteExt[n][1];;
			x1[i]=Math.trunc(ax*t*t*t+bx*t*t+pisteExt[n][2]*t+pisteExt[n][0]);
			y1[i]=Math.trunc(ay*t*t*t+by*t*t+pisteExt[n][3]*t+pisteExt[n][1]);
			x2[i]=Math.trunc(ax*pt*pt*pt+bx*pt*pt+pisteExt[n][2]*pt+pisteExt[n][0]);
			y2[i]=Math.trunc(ay*pt*pt*pt+by*pt*pt+pisteExt[n][3]*pt+pisteExt[n][1]);
			console.log(ax+"<->"+bx);
			i++;
		}
	}
	for (n=0;n<pisteInt.length;n++) {
		var pn=n+1;
		if (pn==pisteInt.length) pn=0;
		console.log(pisteInt[n]+"->"+pisteInt[pn]);	
		for (j=0;j<pisteInt[n][4];j++) {
			var t=j/pisteInt[n][4];
			var pt=(j+1)/pisteInt[n][4];
			var ax=pisteInt[pn][2]-2*pisteInt[pn][0]+pisteInt[n][2]+2*pisteInt[n][0];
			var ay=pisteInt[pn][3]-2*pisteInt[pn][1]+pisteInt[n][3]+2*pisteInt[n][1];
			var bx=-pisteInt[pn][2]+3*pisteInt[pn][0]-2*pisteInt[n][2]-3*pisteInt[n][0];
			var by=-pisteInt[pn][3]+3*pisteInt[pn][1]-2*pisteInt[n][3]-3*pisteInt[n][1];;
			x1[i]=Math.trunc(ax*t*t*t+bx*t*t+pisteInt[n][2]*t+pisteInt[n][0]);
			y1[i]=Math.trunc(ay*t*t*t+by*t*t+pisteInt[n][3]*t+pisteInt[n][1]);
			x2[i]=Math.trunc(ax*pt*pt*pt+bx*pt*pt+pisteInt[n][2]*pt+pisteInt[n][0]);
			y2[i]=Math.trunc(ay*pt*pt*pt+by*pt*pt+pisteInt[n][3]*pt+pisteInt[n][1]);
			console.log(ax+"<->"+bx);
			i++;
		}
	}

	// Trajectoire
  	x_traj[0]=(x1[0]+x1[nbTroncon])/2;
	y_traj[0]=(y1[0]+y1[nbTroncon])/2;
	for (var i=1; i<nbTroncon-1; i+=1) {	
		if (Math.trunc(i/ratio_traj)==i/ratio_traj) {
			x_traj[i/ratio_traj]=(x1[i]+x1[i+nbTroncon])/2;
			y_traj[i/ratio_traj]=(y1[i]+y1[i+nbTroncon])/2;
		}
	}
	x_traj[nb_traj]=(x1[nbTroncon]+x1[2*nbTroncon])/2;
	y_traj[nb_traj]=(y1[nbTroncon]+y1[2*nbTroncon])/2;
	// calcul des tangentes

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
	
	/*
	for (var i=0; i<x_traj.length-1; i++) {	
		x_traj[i]=(pisteExt[i][0]+pisteInt[i][0])/2;
		y_traj[i]=(pisteExt[i][1]+pisteInt[i][1])/2;
		vx_traj[i]=(pisteExt[i][2]+pisteInt[i][2])/2;
		vy_traj[i]=(pisteExt[i][3]+pisteInt[i][3])/2;
		vit_traj[i]=vitesse_defaut;
	}
	x_traj[pisteExt.length]=(pisteExt[0][0]+pisteInt[0][0])/2;
	y_traj[pisteExt.length]=(pisteExt[0][1]+pisteInt[0][1])/2;
	vx_traj[pisteExt.length]=(pisteExt[0][2]+pisteInt[0][2])/2;
	vy_traj[pisteExt.length]=(pisteExt[0][3]+pisteInt[0][3])/2;
	vit_traj[pisteExt.length]=vitesse_defaut;
	*/	
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
	
	xDepart=x_traj[0];
	yDepart=y_traj[0];
	tetaDepart=Math.PI/2;
	
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

