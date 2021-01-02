#define SERIAL_BUFFER_SIZE 512

void lidar(){
  if (Serial1.available()>0) {
      donnees=Serial1.read();
      trame[n]=donnees;
      n++;
      if (Serial1.available()>200){
         Serial1.write(stop,2);
         pause=true;
      }
      // normalement inutile
      if (((nb==0)||(nb>80))&&(mode!=DEBUT)) {
         //Serial.println("??? attente de resynchronisation !");
         mode=BUG;
         n=0;
         nb=1;
      }
      // recue tous les caracteres attendus
      if (n==nb){
         switch(mode) {
            case START:
               //Serial.println();
               //Serial.print("Debut ");
               //affiche(7);
               mode=ENTETE;
               n=0;
               nb=10;
               break;
            case ENTETE:
               //Serial.println();
               //Serial.print("Entête: ");
               //affiche(10);
               mot = trame[4]>>1;
               mot+= trame[5]<<7;
               angleDebut=(float)mot/64;
               mot = trame[6]>>1;
               mot+= trame[7]<<7;
               angleFin=(float)mot/64;
               if (angleFin<angleDebut) angleFin+=360;
               //Serial.print("Angle début: ");Serial.print(angleDebut);Serial.print(" ");
               //Serial.print("Angle fin: ");Serial.println(angleFin);
                                 
               if ((trame[0]==0xAA)&(trame[1]==0x55)&(trame[2]==0)) {
                  nb=trame[3]*2;
                  //Serial.print("Attente de: "); Serial.print(nb); Serial.println(" caractere(s)");              
                  mode=DONNEES;           
                  n=0;
               } else 
                  if ((trame[0]==0xAA)&(trame[1]==0x55)&(trame[2]==1)) {
                     nb=trame[3]*2;
                     //Serial.print("Trame Zero: "); Serial.print(nb); Serial.println(" caractere(s)");              
                     mode=DONNEES;           
                     n=0;
                  } else {
                     // bug
                     //Serial1.write(stop,2);
                     //Serial1.write(scan,2);
                     //Serial.println("attente de resynchronisation !");
                     mode=BUG;
                     n=0;
                     nb=1;
                  }
               
               break;
            case DONNEES:
                  //Serial.println();
                  //Serial.print("donnees: ");
                  affiche(nb);
                  mode=ENTETE;
                  n=0;
                  nb=10;
                break;

            case BUG:
                if (trame[0]==0xAA) {                  
                  mode=BUGSUITE;
                  n=0;
                  nb=1;
                } else {
                  n=0;
                  nb=1;
                }
                break;
            
            case BUGSUITE:
                if (trame[0]==0x55) {                  
                  mode=RECOMMENCE;
                  n=0;
                  nb=8;
                }
                break;

            
            case RECOMMENCE: // ne devrait pas arriver avec gestion buffer
              //Serial.println();
              //Serial.print("Resynchronisé: ");
              //affiche(8);                  
              if (trame[0]==0) {
                  nb=trame[1]*2;
                  //Serial.print("Attente de: "); Serial.print(nb); Serial.println(" caractere(s)");              
                  mode=DONNEES;           
                  n=0;
               } else 
                  if (trame[0]==1) {
                     nb=trame[1]*2;
                     //Serial.print("Trame Zero: "); Serial.print(nb); Serial.println(" caractere(s)");              
                     mode=DONNEES;           
                     n=0;
                  } else {
                     // c'etait pas bon !
                     //Serial1.write(stop,2);
                     //Serial1.write(scan,2);
                     //Serial.println("attente de resynchronisation !");
                     mode=BUG;
                     n=0;
                     nb=1;
                  }
                break;

                
         } 
      }
      if (n>255) {Serial.println("POUF!!!!");
         mode=BUG;
         n=0;
         nb=1;
      }
         
  } else {
      // Plus de caractere dans le buffer
      if (pause&&(mode!=DEBUT)) {
         //Serial.println("Redemande Scan");       
         Serial1.write(scan,2);
         mode=START;
         n=0;
         nb=7;
         pause=false;
      }
  }
}
void affiche(int longueur) {
   float distance;
   float angle;
   static int secteur=16;
   if (longueur>2) {
      for (int n=0; n<(longueur>>1);n++){
             mot=trame[n<<1];
             mot+=trame[(n<<1)+1]<<8;
   
             distance=(float)mot/40;
             angle=angleDebut+(angleFin-angleDebut)*n/((longueur>>1)-1);
             if (angle>=360) angle-=360;
             // un tour ?
             int nvSecteur=trunc((angle+11.25)*16/360);
             if (nvSecteur==16) nvSecteur=0;
             //Serial.print(longueur);Serial.print("\t");
             //Serial.print(nvSecteur);Serial.print("\t");Serial.println(secteur);          
             if ((nvSecteur<secteur)){              
               conduite();
               for (int i=0;i<16;i++)portion[i]=9999;
             }
             secteur=trunc((angle+11.25)*16/360);
             if (secteur==16) secteur=0;
             if ((distance<portion[secteur])&& (distance>1)) portion[secteur]=distance;          
   
      }
   }
   //Serial.println();
}

void vitesseLidar(int pourCent){
  analogWrite(YDLIDAR_MOTOR_SCTP, 2.56*pourCent);
}
