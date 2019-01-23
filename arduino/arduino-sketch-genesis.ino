/* Defines */

#define LEN(x) (sizeof(x)/sizeof((x)[0]))

/* Input */

#define SNAKE_DRAWER_PIN 2
#define GLASSES_DRAWER_PIN 3
#define CORE_DRAWER_PIN 4
#define FRAME_CHIP_PIN 5
#define VR_DRAWER_PIN 6
int inPins[] = {SNAKE_DRAWER_PIN, GLASSES_DRAWER_PIN, CORE_DRAWER_PIN, FRAME_CHIP_PIN, VR_DRAWER_PIN};
String msgsToComputer[] = {"SnakeDrawerOpened", "GlassesDrawerOpened", "CoreDrawerOpened", "FrameChipRemoved", "VRDrawerOpened"};
int inPinsStates[LEN(inPins)];

/* Output */

#define LED_LIGHTS_PIN 12
int outPins[] = {LED_LIGHTS_PIN};
#define MSG_BLUE_LIGHTS 98 //ascii for 'b'
#define MSG_FLASH_LIGHTS 102 //ascii for 'f'
#define MSG_RED_LIGHTS 114 //ascii for 'r'

/* Setup */

void setup() {
  Serial.begin(9600);
  setUpInputs(); 
  setUpOutputs();
  while (!Serial) {
    delay(100);
  }
  flashLights();  
}

void setUpInputs() {
  for (int i=0; i<LEN(inPins); i++) {
    pinMode(inPins[i], INPUT_PULLUP);
    inPinsStates[i] = digitalRead(inPins[i]);
  }  
}

void setUpOutputs() {
  for (int i=0; i<LEN(outPins); i++) {
    pinMode(outPins[i], OUTPUT);
    digitalWrite(outPins[i], LOW);
  }
}

void flashLights() {
  digitalWrite(LED_LIGHTS_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_LIGHTS_PIN, LOW);  
}

/* Loop */

void loop() {
  //logInPinStates();
  handleMessagesFromComputer();
  handleInputsFromPins();
  delay(100);
}

void handleMessagesFromComputer() {
  if (Serial.available() > 0) {
    int value = Serial.read();
    if (value == MSG_BLUE_LIGHTS) {
      digitalWrite(LED_LIGHTS_PIN, LOW);
    } else if (value == MSG_RED_LIGHTS) {
      digitalWrite(LED_LIGHTS_PIN, HIGH);
    } else if (value == MSG_FLASH_LIGHTS) {
      delay(13000);
      for (int i=0; i<35; i++) {
        digitalWrite(LED_LIGHTS_PIN, HIGH);
        delay(500);
        digitalWrite(LED_LIGHTS_PIN, LOW);
        delay(500);    
      }
    }
  }  
}

void handleInputsFromPins() {
  for (int i=0; i<LEN(inPins); i++) {
    int newInPinState = digitalRead(inPins[i]);
    if ((inPinsStates[i] == HIGH) && (newInPinState == LOW)) {
      Serial.println(msgsToComputer[i]);
    }
    inPinsStates[i] = newInPinState;
  }
}

void logInPinStates() {
  for (int i=0; i<LEN(inPins); i++) {
    Serial.print(String(digitalRead(inPins[i])));
    Serial.print(" ");
  }
  Serial.println("");  
}
