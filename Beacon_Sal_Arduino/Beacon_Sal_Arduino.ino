/*********************************************************************
  This is an example based on nRF51822 based Bluefruit LE modules

********************************************************************/

#include <Arduino.h>
#include <SPI.h>
#include <Servo.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"

#include "BluefruitConfig.h"

#if SOFTWARE_SERIAL_AVAILABLE
#include <SoftwareSerial.h>
#endif

Servo myservo;

/*=========================================================================
       -----------------------------------------------------------------------*/
#define FACTORYRESET_ENABLE         0
#define MINIMUM_FIRMWARE_VERSION    "0.6.6"
#define MODE_LED_BEHAVIOUR          "MODE"
/*=========================================================================*/

//Erklæring af globale variabler
int redPin = 5; //rød diode på pin5
int greenPin = 6; // grøn diode på pin 6
int bluePin = 3; // Blå diode på pin 3
#define COMMON_ANODE //uncomment this line if using a Common Anode LED
int pos = 0;  //variable til servo motors position
int speaker = 2; // speaker på pin2
char c; // variable bruges til kommunikation fra app til arduino 


Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

/* ...software SPI, using SCK/MOSI/MISO user-defined SPI pins and then user selected CS/IRQ/RST */
//Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_SCK, BLUEFRUIT_SPI_MISO,
//                             BLUEFRUIT_SPI_MOSI, BLUEFRUIT_SPI_CS,
//                             BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);


// A small helper
void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

/**************************************************************************/
/*!
    @brief  Sets up the HW an the BLE module (this function is called
            automatically on startup)
*/
/**************************************************************************/
void setup(void)
{
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);  
  
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object

  while (!Serial);  // required for Flora & Micro
  delay(500);

  Serial.begin(115200);
  Serial.println(F("Adafruit Bluefruit Command <-> Data Mode Example"));
  Serial.println(F("------------------------------------------------"));

  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );

  if ( FACTORYRESET_ENABLE )
  {
    /* Perform a factory reset to make sure everything is in a known state */
    Serial.println(F("Performing a factory reset: "));
    if ( ! ble.factoryReset() ) {
      error(F("Couldn't factory reset"));
    }
  }

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  /* Print Bluefruit information */
  ble.info();



  ble.verbose(false);  // debug info is a little annoying after this point!


  Serial.println(F("******************************"));

  // LED Activity command is only supported from 0.6.6
  if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) )
  {
    // Change Mode LED Activity
    Serial.println(F("Change LED activity to " MODE_LED_BEHAVIOUR));
    ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
  }

  //Give module a new name
  ble.println("AT+GAPDEVNAME=Beaconsal"); // named TLONE

  // Check response status
  ble.waitForOK();

  /* Wait for connection */
  while (! ble.isConnected()) {
    delay(500);
  }
  // Set module to DATA mode
  Serial.println( F("Switching to DATA mode!") );
  ble.setMode(BLUEFRUIT_MODE_DATA);

  Serial.println(F("******************************"));
}




/**************************************************************************/
/*!
    @brief  Constantly poll for new command or response data
*/
/**************************************************************************/
void loop(void)
{
  // Check for user input
  char n, inputs[BUFSIZE + 1];

  if (Serial.available())
  {
    n = Serial.readBytes(inputs, BUFSIZE);
    inputs[n] = 0;
    // Send characters to Bluefruit
    Serial.print("Sending: ");
    Serial.println(inputs);

    // Send input data to host via Bluefruit
    ble.print(inputs);
  }
  if (ble.available()) {
    Serial.print("* "); Serial.print(ble.available()); Serial.println(F(" bytes available from BTLE"));
  }
  // Echo received data
  while ( ble.available() )
  {
    int input = ble.read();
    c = (char)input;
    Serial.print(c);
  }
    if (c == '1')//gyldig pinkode indtastet og data modtaget til arduino fra app
    { 
      setColor(0, 255, 0);  // green
      digitalWrite(greenPin, HIGH);
      Serial.println();
      Serial.println(" Korrekt pin. Dør åbner");
      tone(speaker, 698,150);
      delay(150);
      tone(speaker, 872,150);
      delay(150);
      tone(speaker, 1048,150);
      delay(150);
      tone(speaker, 1310,250);
      digitalWrite(greenPin, LOW);
      myservo.write(180);
      delay(2000);
      Serial.println();
      Serial.println(" Dør lukker");
      c = " ";
    }
    
    if (c == '0')//forkert pinkode indtastet og data modtaget til arduino fra app
    {
      setColor(255, 0, 0);  // red
      digitalWrite(redPin, HIGH);
      Serial.println();
      Serial.println("forkert pin, ingen adgang");
      tone(speaker, 150,150);
      delay(150);
      tone(speaker, 150, 150);
      delay(150);
      tone(speaker, 150, 250);     
      digitalWrite(redPin, LOW);
      delay(2000);
      c = " ";
    }

     if (c!= "1" && "0") //ingen data sendt og arduino har ikke modtaget noget nyt data fra app
    {
      myservo.write(0);
      Serial.println();
      Serial.println("Venter på input fra app");
      setColor(0, 0, 255);  // blue
      digitalWrite(bluePin, HIGH);
      delay(100);
      digitalWrite(bluePin, LOW);
     }
    delay(500);
}

void setColor(int red, int green, int blue)
{
  #ifdef COMMON_ANODE //bruges med COMMON_ANODE. Uden dette er farverne omvendt.
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);  
}
