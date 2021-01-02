#define C0 0.0005 
#define C1 5
#define C2 0.03   

#define ECH 2  // coef ech pixel/cm
#define ROT 80 // coef direction

float vitesseMax=15;
float vitesse=0;
float direction=0;

void conduite() {
   int moteurDroit;
   int moteurGauche;
   // accident
   float d1=portion[4];
   float d2=portion[6];
   float d3=portion[8];
   float d4=portion[10];
   float d5=portion[12];
  
   if (d2==9999) d2=0;   
   if (d3==9999) d3=0;   
   if (d4==9999) d4=0;   

   direction=C0*d4-C0*d2;
   vitesse=C2*d3*ECH+C1;



   // Limitation rotation maxi
   if (direction>0.2) direction=0.2;
   if (direction<-0.2) direction=-0.2;

   // Limitation Vitesse maxi
   if (vitesse>vitesseMax) vitesse=vitesseMax;
   if (vitesse<0) vitesse=0;
      
   moteurDroit=13.6*(vitesse+ROT*direction);
   moteurGauche=13.6*(vitesse-ROT*direction);

   
   Serial.print (d2);Serial.print("\t");
   Serial.print (d3);Serial.print("\t");
   Serial.print (d4);Serial.print("\t");
   Serial.print (vitesse);Serial.print("\t");
   Serial.print (direction);Serial.print("\t");
   Serial.print (moteurDroit);Serial.print("\t");
   Serial.println (moteurGauche); 

   
   if (moteurDroit>=0) {
      digitalWrite(PINDIRA,false);
      analogWrite(PINPWMA,min(moteurDroit+50,255));
   }
   else {
      digitalWrite(PINDIRA,true);
      analogWrite(PINPWMA,min(-moteurDroit+50,255));      
   }
   if (moteurGauche>=0) {
      digitalWrite(PINDIRB,false);
      analogWrite(PINPWMB,min(moteurGauche+50,255));
   }
   else {
      digitalWrite(PINDIRB,true);
      analogWrite(PINPWMB,min(-moteurGauche+50,255));      
   }
 
}
