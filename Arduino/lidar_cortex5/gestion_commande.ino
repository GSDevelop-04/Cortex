

void gestionCommandes(String ordre){
  if (ordre.indexOf("reboot")>-1) {
     Serial1.write(reboot,2);
     Serial.println("Demande Reboot");
   }
   
  if (ordre.indexOf("device")>-1){
     Serial1.write(device,2);
     Serial.println("Demande Device");
  }
  
  if (ordre.indexOf("scan")>-1){
     Serial1.write(scan,2);
     Serial.println("Demande Scan");
     mode=START;
     n=0;
     nb=7;
  }
  if (ordre.indexOf("stop")>-1){
     Serial.println();
     Serial1.write(stop,2);
  }
  if (ordre.indexOf("off")>-1){
     digitalWrite(YDLIDAR_MOTRO_EN, LOW);
  }
  if (ordre.indexOf("on")>-1){
     digitalWrite(YDLIDAR_MOTRO_EN, HIGH);
  }
}
