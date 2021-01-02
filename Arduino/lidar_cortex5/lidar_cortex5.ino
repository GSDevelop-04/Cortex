#include "commandes.h"

// choisir votre carte en mettant en commentaire l'autre
//#define Due
#define ESP32

// Choisir le type de variateur utilisé en mettant en commentaire l'autre
#define VARIADIRPWM  //  Dir PINA1 et PWM PINA2 (shield arduino)
//#define VARIAA1A2    // avant PINA1=0 PINA2=PWM et arriere PINA1=PWM et PINA2=0 (DRV8833 fast decay SLEEP à 1 / TB6612 compatible avec PWM et STBY à 1) 

#if defined(Due)
#define PINA1 4
#define PINA2 5
#define PINB1 12
#define PINB2 9
#define YDLIDAR_MOTOR_SCTP 3 // The PWM pin for control the speed of YDLIDAR's motor. 
#define YDLIDAR_MOTRO_EN   7 // The ENABLE PIN for YDLIDAR's motor      
#define LIDAR Serial1    
#endif
#if defined(ESP32)
#define PINA1 34
#define PINA2 35
#define PINB1 22
#define PINB2 19
#define YDLIDAR_MOTOR_SCTP 23 // The PWM pin for control the speed of YDLIDAR's motor. 
#define YDLIDAR_MOTRO_EN   27 // The ENABLE PIN for YDLIDAR's motor          
#define LIDAR Serial2
#endif

char car;
char octet;
String ordre;
byte trame[256];
float portion[16];
float angleDebut,
      angleFin;
int n,nb;
unsigned int mot;
byte donnees;
byte mode;


bool lid_pause=false;

#define DEBUT 0
#define START 1
#define ENTETE 2
#define DONNEES 3
#define BUG 4
#define BUGSUITE 5
#define RECOMMENCE 6



void setup() {
  // put your setup code here, to run once:
  // init moteurs
  pinMode(PINA1,OUTPUT);
  pinMode(PINA2,OUTPUT);
  pinMode(PINB1,OUTPUT);
  pinMode(PINB2,OUTPUT);

#if defined(Due)   
      analogWrite(PINA2,0));
      analogWrite(PINB2,0);
#endif
#if defined(ESP32)
      ledcWrite(PINA2, 0);
      ledcWrite(PINB2, 0);     
#endif

  //init lidar
  pinMode(YDLIDAR_MOTOR_SCTP, OUTPUT);
  pinMode(YDLIDAR_MOTRO_EN, OUTPUT);  
  digitalWrite(YDLIDAR_MOTRO_EN, LOW);  
  vitesseLidar(70);
  mode=DEBUT;
  n=0;
  nb=0;

  Serial.begin(115200);
  LIDAR.begin(128000);
  
  delay(3000);
  digitalWrite(YDLIDAR_MOTRO_EN, HIGH);
  Serial.println ("C'est parti");
  octet=0xA5;
  LIDAR.write(octet);
  octet=0x40;
  LIDAR.write(octet);
  delay(2000);
  LIDAR.write(scan,2);
  mode=START;
  n=0;
  nb=7;
}

void loop() {

  lidar();

  if (Serial.available()>0) {
    car=Serial.read();
    if (car==13) {
      gestionCommandes(ordre);
      ordre="";
    }
    else if (car>=32) ordre+=car;
  }
}
