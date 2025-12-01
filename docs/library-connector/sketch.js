// GLOBAL VARIABLES
let capture;
let screenshot;
let appState = "DEFAULT";
let cameraBack = false;

let screenWidth = 393;
let screenHeight = 852;

// UI ELEMENTS
let captureButton;
let flipButton;
let skipButton;
let cancelButton;
let saveButton;
let backButton;
let submitButton;

// INFO STATE INPUTS
let nicknameInput;
let locationRadio;
let descriptionInput;

// PROMPT
let currentPrompt = "butterflies";

// GALLERY DATA (mock - Firebase would replace this)
let galleryPhotos = [];

function setup() {
  createCanvas(screenWidth, screenHeight);
  
  // START CAMERA
  let constraints = {
    audio: false,
    video: {
      facingMode: cameraBack ? { exact: "environment" } : "user"
    }
  };
  capture = createCapture(constraints);
  capture.hide();
  
  createUIElements();
}

function draw() {
  background(255);
  
  if (appState === "DEFAULT") {
    drawDefaultState();
  } else if (appState === "SCREENSHOT") {
    drawScreenshotState();
  } else if (appState === "INFO") {
    drawInfoState();
  } else if (appState === "ARCHIVE") {
    drawArchiveState();
  }
  
  updateUIVisibility();
}

// ==========================================
// STATE DRAWING FUNCTIONS
// ==========================================

function drawDefaultState() {
  // Draw prompt at top
  fill(0);
  textSize(20);
  textAlign(CENTER);
  text("This week's prompt: " + currentPrompt, screenWidth / 2, 40);
  
  // Draw camera feed
  let videoWidth = capture.width;
  let videoHeight = capture.height;
  let aspectRatio = videoWidth / videoHeight;
  let displayHeight = screenHeight * 0.6;
  let displayWidth = displayHeight * aspectRatio;
  let x = (screenWidth - displayWidth) / 2;
  let y = 80;
  
  image(capture, x, y, displayWidth, displayHeight);
}

function drawScreenshotState() {
  if (screenshot) {
    // Draw captured image
    let imgWidth = screenshot.width;
    let imgHeight = screenshot.height;
    let aspectRatio = imgWidth / imgHeight;
    let displayHeight = screenHeight * 0.6;
    let displayWidth = displayHeight * aspectRatio;
    let x = (screenWidth - displayWidth) / 2;
    let y = 80;
    
    image(screenshot, x, y, displayWidth, displayHeight);
  }
}

function drawInfoState() {
  // Draw preview of captured image
  if (screenshot) {
    let displaySize = 200;
    let x = (screenWidth - displaySize) / 2;
    image(screenshot, x, 20, displaySize, displaySize);
  }
  
  // Labels for inputs (inputs are created as HTML elements)
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Nickname:", 20, 250);
  text("Location:", 20, 320);
  text("Description:", 20, 420);
}

function drawArchiveState() {
  // Title
  fill(0);
  textSize(20);
  textAlign(CENTER);
  text("Gallery", screenWidth / 2, 40);
  
  // Draw gallery grid (3 columns)
  if (galleryPhotos.length === 0) {
    textSize(14);
    text("No photos yet", screenWidth / 2, screenHeight / 2);
  } else {
    let cols = 3;
    let cellSize = screenWidth / cols;
    let startY = 80;
    
    for (let i = 0; i < galleryPhotos.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = col * cellSize;
      let y = startY + row * cellSize;
      
      // Draw placeholder (in real version, would draw actual images)
      fill(200);
      rect(x, y, cellSize - 2, cellSize - 2);
      
      // Draw thumbnail if exists
      if (galleryPhotos[i].img) {
        image(galleryPhotos[i].img, x, y, cellSize - 2, cellSize - 2);
      }
    }
  }
}

// ==========================================
// UI CREATION
// ==========================================

function createUIElements() {
  // CAPTURE BUTTON
  captureButton = createButton("Capture");
  captureButton.position(screenWidth / 2 - 75, screenHeight - 200);
  captureButton.size(150, 50);
  captureButton.mousePressed(handleCapture);
  
  // FLIP BUTTON
  flipButton = createButton("Flip");
  flipButton.position(screenWidth / 2 - 75, screenHeight - 140);
  flipButton.size(150, 50);
  flipButton.mousePressed(handleFlip);
  
  // SKIP BUTTON (goes to archive)
  skipButton = createButton("Skip to Archive");
  skipButton.position(screenWidth / 2 - 75, screenHeight - 80);
  skipButton.size(150, 50);
  skipButton.mousePressed(() => {
    appState = "ARCHIVE";
  });
  
  // CANCEL BUTTON
  cancelButton = createButton("Cancel");
  cancelButton.position(50, screenHeight - 100);
  cancelButton.size(100, 50);
  cancelButton.mousePressed(() => {
    appState = "DEFAULT";
  });
  
  // SAVE BUTTON
  saveButton = createButton("Save");
  saveButton.position(screenWidth - 150, screenHeight - 100);
  saveButton.size(100, 50);
  saveButton.mousePressed(() => {
    appState = "INFO";
  });
  
  // BACK BUTTON (in archive)
  backButton = createButton("Back");
  backButton.position(20, 60);
  backButton.size(100, 40);
  backButton.mousePressed(() => {
    appState = "DEFAULT";
  });
  
  // INFO STATE INPUTS
  nicknameInput = createInput();
  nicknameInput.position(20, 260);
  nicknameInput.size(screenWidth - 40, 30);
  nicknameInput.attribute('placeholder', 'Who are you?');
  
  // Location radio buttons
  locationRadio = createRadio();
  locationRadio.option('Library Main', 'main');
  locationRadio.option('Library West', 'west');
  locationRadio.position(20, 340);
  
  descriptionInput = createInput();
  descriptionInput.position(20, 440);
  descriptionInput.size(screenWidth - 40, 80);
  descriptionInput.attribute('placeholder', 'Where did you find it?');
  
  // SUBMIT BUTTON
  submitButton = createButton("Submit");
  submitButton.position(screenWidth / 2 - 75, screenHeight - 100);
  submitButton.size(150, 50);
  submitButton.mousePressed(handleSubmit);
}

// ==========================================
// UI VISIBILITY MANAGEMENT
// ==========================================

function updateUIVisibility() {
  // DEFAULT STATE
  captureButton.style('display', appState === "DEFAULT" ? 'block' : 'none');
  flipButton.style('display', appState === "DEFAULT" ? 'block' : 'none');
  skipButton.style('display', appState === "DEFAULT" ? 'block' : 'none');
  
  // SCREENSHOT STATE
  cancelButton.style('display', appState === "SCREENSHOT" ? 'block' : 'none');
  saveButton.style('display', appState === "SCREENSHOT" ? 'block' : 'none');
  
  // INFO STATE
  nicknameInput.style('display', appState === "INFO" ? 'block' : 'none');
  locationRadio.style('display', appState === "INFO" ? 'block' : 'none');
  descriptionInput.style('display', appState === "INFO" ? 'block' : 'none');
  submitButton.style('display', appState === "INFO" ? 'block' : 'none');
  
  // ARCHIVE STATE
  backButton.style('display', appState === "ARCHIVE" ? 'block' : 'none');
}

// ==========================================
// EVENT HANDLERS
// ==========================================

function handleCapture() {
  screenshot = capture.get();
  appState = "SCREENSHOT";
  console.log("Photo captured");
}

function handleFlip() {
  cameraBack = !cameraBack;
  
  // Remove old capture
  capture.remove();
  
  // Create new capture with flipped camera
  let constraints = {
    audio: false,
    video: {
      facingMode: cameraBack ? { exact: "environment" } : "user"
    }
  };
  capture = createCapture(constraints);
  capture.hide();
  
  console.log("Camera flipped");
}

function handleSubmit() {
  // Get form data
  let nickname = nicknameInput.value();
  let location = locationRadio.value();
  let description = descriptionInput.value();
  
  if (!nickname || !location) {
    alert("Please fill in nickname and location");
    return;
  }
  
  // Create photo object
  let photoData = {
    img: screenshot,
    nickname: nickname,
    location: location,
    description: description,
    prompt: currentPrompt,
    timestamp: Date.now()
  };
  
  // Add to gallery (in real version, would upload to Firebase)
  galleryPhotos.push(photoData);
  
  console.log("Photo submitted:", photoData);
  
  // Clear form
  nicknameInput.value('');
  locationRadio.selected('');
  descriptionInput.value('');
  
  // Go to archive
  appState = "ARCHIVE";
}

// ==========================================
// MOUSE CLICK FOR GALLERY ITEMS
// ==========================================

function mousePressed() {
  if (appState === "ARCHIVE" && galleryPhotos.length > 0) {
    let cols = 3;
    let cellSize = screenWidth / cols;
    let startY = 80;
    
    for (let i = 0; i < galleryPhotos.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = col * cellSize;
      let y = startY + row * cellSize;
      
      // Check if click is within this cell
      if (mouseX > x && mouseX < x + cellSize && 
          mouseY > y && mouseY < y + cellSize) {
        showPhotoModal(galleryPhotos[i]);
        break;
      }
    }
  }
}

function showPhotoModal(photo) {
  // Show alert with photo info (in real version, would be a styled modal)
  let info = "Prompt: " + photo.prompt + "\n" +
             "By: " + photo.nickname + "\n" +
             "Location: " + photo.location + "\n" +
             "Description: " + photo.description;
  alert(info);
}