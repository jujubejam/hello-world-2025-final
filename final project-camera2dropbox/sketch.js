// Set the video capture as a global variable.
let capture;

let cameraHeight = 360;
let cameraWidth = 4/3 * cameraHeight;
let screenWidth = 393;
let screenHeight = 852;

let cameraButton;
let cameraButtonX;
let cameraButtonY;

let appState = "DEFAULT";

function setup() {
  describe('Video capture from the device webcam.');
  createCanvas(393, 852);
  // Use the createCapture() function to access the device's
  // camera and start capturing video.
  capture = createCapture(VIDEO);
  // Make the capture frame half of the canvas.
  capture.size(cameraWidth, cameraHeight);
  // Use capture.hide() to remove the p5.Element object made
  // using createCapture(). The video will instead be rendered as
  // an image in draw().
  capture.hide();
  
  let cameraButton = createButton("click");
  // Set the width and height of the button
  cameraButton.style('width', '150px');
  cameraButton.style('height', '50px');
  
  // Set background color, border style, and font size
  cameraButton.style('background-color', 'pink');
  cameraButton.style('border', '2px solid #000'); 
  cameraButton.style('font-size', '18px');
  
  // Set text color and padding
  cameraButton.style('color', '#000000');
  cameraButton.style('padding', '10px');
  
  // Set margin and cursor style
  cameraButton.style('margin', '10px');
  cameraButton.style('cursor', 'pointer');
  cameraButton.position(
    screenWidth*1/2-cameraButton.width*1/2, 
    (screenHeight+cameraHeight)*1/2+50
  );
  cameraButton.style('border-radius', '5px');
  
  cameraButtonX = screenWidth*1/2-cameraButton.width*1/2;
  cameraButtonY = (screenHeight+cameraHeight)*1/2+50;
  cameraButtonWidth = 150;
  cameraButtonHeight = 50;

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

function mousePressed() {
  // Check if mouse is within button bounds
  if (appState === "DEFAULT" && 
      mouseX >= cameraButtonX && mouseX <= cameraButtonX + cameraButtonWidth && 
      mouseY >= cameraButtonY && mouseY <= cameraButtonY + cameraButtonHeight) {
    screenshot = capture.get();
    appState = "SCREENSHOT";
    console.log("Screenshot captured!");
    }
  
  else if (appState === "SCREENSHOT" &&
      mouseX >= cameraButtonX && mouseX <= cameraButtonX + cameraButtonWidth && 
      mouseY >= cameraButtonY && mouseY <= cameraButtonY + cameraButtonHeight) {
    appState = "DEFAULT";
    console.log("Back to default!");
  }
}

