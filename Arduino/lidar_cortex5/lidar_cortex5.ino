#include "commandes.h"
#define PINDIRA 4
#define PINPWMA 5
#define PINDIRB 12
#define PINPWMB 9
#define YDLIDAR_MOTOR_SCTP 3 // The PWM pin for control the speed of YDLIDAR's motor. 
#define YDLIDAR_MOTRO_EN   7 // The ENABLE PIN for YDLIDAR's motor          


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


bool pause=false;

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
  pinMode(PINDIRA,OUTPUT);
  pinMode(PINPWMA,OUTPUT);
  pinMode(PINDIRB,OUTPUT);
  pinMode(PINPWMB,OUTPUT);
  analogWrite(PINPWMA,0);
  analogWrite(PINPWMB,0);
  //init lidar
  pinMode(YDLIDAR_MOTOR_SCTP, OUTPUT);
  pinMode(YDLIDAR_MOTRO_EN, OUTPUT);  
  digitalWrite(YDLIDAR_MOTRO_EN, LOW);  
  vitesseLidar(70);
  mode=DEBUT;
  n=0;
  nb=0;

  Serial.begin(115200);
  Serial1.begin(128000);
  
  delay(3000);
  digitalWrite(YDLIDAR_MOTRO_EN, HIGH);
  Serial.println ("C'est parti");
  octet=0xA5;
  Serial1.write(octet);
  octet=0x40;
  Serial1.write(octet);
  delay(2000);
     Serial1.write(scan,2);
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
