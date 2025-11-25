// Set the video capture as a global variable.
let capture;

let cameraHeight = 360;
let cameraWidth = 4/3 * cameraHeight;
let screenWidth = 393;
let screenHeight = 852;

let cameraButton;
let cameraButtonX;
let cameraButtonY;

let flipButton;
let cameraBack = false;

let appState = "DEFAULT";

function setup() {
  describe('Video capture from the device webcam.');
  createCanvas(393, 852);
  // Use the createCapture() function to access the device's
  // camera and start capturing video.

  createCanvas(displayWidth, displayHeight);
  if (cameraBack === false) {
    var constraints = {  
      video: {
        facingMode: "user"
      } 
    };
  } 
  else if (cameraBack === true) {
      var constraints = {
        audio: false,
        video: {
          facingMode: {
            exact: "environment"
          }
        } 
      };
    }
  capture = createCapture(constraints);
  capture.hide();
  
  cameraButton = createButton("click");
  cameraButton.style('width', '150px');
  cameraButton.style('height', '50px');
  cameraButton.style('background-color', 'pink');
  cameraButton.style('border', '2px solid #000'); 
  cameraButton.style('font-size', '18px');
  cameraButton.style('color', '#000000');
  cameraButton.style('padding', '10px');
  cameraButton.style('margin', '10px');
  cameraButton.style('cursor', 'pointer');
  cameraButton.position(screenWidth*1/2-cameraButton.width*1/2, (screenHeight+cameraHeight)*1/2+50);
  cameraButton.style('border-radius', '5px');
  
  cameraButtonX = screenWidth*1/2-cameraButton.width*1/2;
  cameraButtonY = (screenHeight+cameraHeight)*1/2+50;
  cameraButtonWidth = 150;
  cameraButtonHeight = 50;

  cameraButton.mousePressed(() => {
    if (appState === "DEFAULT") {
      screenshot = capture.get();
      appState = "SCREENSHOT";
      console.log("Screenshot captured!");
    } else if (appState === "SCREENSHOT") {
      appState = "DEFAULT";
      console.log("Back to default!");
    }
  });

  flipButton = createButton("Flip");
  flipButton.style('width', '50px');
  flipButton.style('height', '50px');
  flipButton.style('background-color', 'lightblue');
  flipButton.style('border', '2px solid #000'); 
  flipButton.style('font-size', '18px');
  flipButton.style('color', '#000000');
  flipButton.style('padding', '10px');
  flipButton.style('margin', '10px');
  flipButton.style('cursor', 'pointer');
  flipButton.position(screenWidth*1/2-flipButton.width*1/2, (screenHeight+cameraHeight)*1/2+120);
  flipButton.style('border-radius', '5px');
  
  flipButton.mousePressed(() => {
    if (appState === "DEFAULT") {
      cameraBack = !cameraBack;
      setup();
      console.log("Camera flipped!");
    }
  });

}
function draw() {
  if (appState === "DEFAULT") {
    // Set the background to gray.
    background('#ffffff');
    // Draw the resulting video capture on the canvas  
    image(
      capture, 
      -((cameraWidth-cameraHeight)*1/2), (screenHeight-cameraHeight)*1/2, 
      cameraWidth, cameraHeight
    );
  }
  
  else if (appState === "SCREENSHOT") {
    background("#000000");
    image(screenshot,0,0,cameraWidth-100, cameraHeight-100);
  }
}