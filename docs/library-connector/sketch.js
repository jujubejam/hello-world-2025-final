// GLOBAL VARIABLES
let capture;
let screenshot;
let appState = "DEFAULT";
let cameraBack = true;

// RESPONSIVE DIMENSIONS
let screenWidth;
let screenHeight;
let maxWidth = 500; // Maximum width for desktop

// API KEYS
let imgbbApiKey = "fab8ebe76506446661ca5a19fa7afb4e";
let airtableApiKey = "pat2VLjEVhYMBMx9O.c1ab0be32f15929633fa153abfcec9684832c4cad06b2c5a115f4a79b906ea39";
let airtableBaseId = "appDs8E7KZBmVmLY3";
let airtableTableName = "Photos";

// BUTTONS
let captureButton;
let flipButton;
let skipButton;
let cancelButton;
let saveButton;
let submitButton;
let backButton;

// INFO STATE INPUTS
let nicknameInput;
let locationRadio;
let descriptionInput;

// PROMPT
let currentPrompt = "butterflies";

// GALLERY DATA
let galleryPhotos = [];
let isLoadingGallery = false;

function setup() {
  screenWidth = min(windowWidth, maxWidth);
  screenHeight = windowHeight;
  
  let canvas = createCanvas(screenWidth, screenHeight);
  canvas.parent("sketch-container");
  
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
  loadGalleryFromAirtable();
}

function windowResized() {
  screenWidth = min(windowWidth, maxWidth);
  screenHeight = windowHeight;
  resizeCanvas(screenWidth, screenHeight);
  
  // Update button positions
  captureButton.style('top', screenHeight * 0.75 + 'px');
  captureButton.style('width', screenWidth * 0.38 + 'px');
  captureButton.style('height', screenHeight * 0.06 + 'px');
  
  flipButton.style('top', screenHeight * 0.82 + 'px');
  flipButton.style('width', screenWidth * 0.38 + 'px');
  flipButton.style('height', screenHeight * 0.06 + 'px');
  
  skipButton.style('top', screenHeight * 0.89 + 'px');
  skipButton.style('width', screenWidth * 0.38 + 'px');
  skipButton.style('height', screenHeight * 0.06 + 'px');
  
  cancelButton.style('left', screenWidth * 0.1 + 'px');
  cancelButton.style('top', screenHeight * 0.88 + 'px');
  cancelButton.style('width', screenWidth * 0.25 + 'px');
  cancelButton.style('height', screenHeight * 0.06 + 'px');
  
  saveButton.style('right', screenWidth * 0.1 + 'px');
  saveButton.style('top', screenHeight * 0.88 + 'px');
  saveButton.style('width', screenWidth * 0.25 + 'px');
  saveButton.style('height', screenHeight * 0.06 + 'px');
  
  backButton.style('left', screenWidth * 0.05 + 'px');
  backButton.style('top', screenHeight * 0.02 + 'px');
  backButton.style('width', screenWidth * 0.25 + 'px');
  backButton.style('height', screenHeight * 0.05 + 'px');
  
  submitButton.style('top', screenHeight * 0.88 + 'px');
  submitButton.style('width', screenWidth * 0.38 + 'px');
  submitButton.style('height', screenHeight * 0.06 + 'px');
  
  nicknameInput.style('left', screenWidth * 0.05 + 'px');
  nicknameInput.style('top', screenHeight * 0.37 + 'px');
  nicknameInput.style('width', screenWidth * 0.9 + 'px');
  
  locationRadio.style('left', screenWidth * 0.05 + 'px');
  locationRadio.style('top', screenHeight * 0.47 + 'px');
  
  descriptionInput.style('left', screenWidth * 0.05 + 'px');
  descriptionInput.style('top', screenHeight * 0.59 + 'px');
  descriptionInput.style('width', screenWidth * 0.9 + 'px');
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
  fill(0);
  
  // Responsive text size
  let titleSize = constrain(screenHeight * 0.025, 16, 24);
  textSize(titleSize);
  textAlign(CENTER);
  text("This week's prompt: " + currentPrompt, screenWidth / 2, screenHeight * 0.05);
  
  // Camera feed - 60% of screen height
  let videoWidth = capture.width;
  let videoHeight = capture.height;
  
  if (videoWidth > 0 && videoHeight > 0) {
    let aspectRatio = videoWidth / videoHeight;
    let displayHeight = screenHeight * 0.55;
    let displayWidth = displayHeight * aspectRatio;
    
    // If video is too wide, constrain by width instead
    if (displayWidth > screenWidth * 0.95) {
      displayWidth = screenWidth * 0.95;
      displayHeight = displayWidth / aspectRatio;
    }
    
    let x = (screenWidth - displayWidth) / 2;
    let y = screenHeight * 0.1;
    
    image(capture, x, y, displayWidth, displayHeight);
  }
}

function drawScreenshotState() {
  if (screenshot) {
    let imgWidth = screenshot.width;
    let imgHeight = screenshot.height;
    
    if (imgWidth > 0 && imgHeight > 0) {
      let aspectRatio = imgWidth / imgHeight;
      let displayHeight = screenHeight * 0.55;
      let displayWidth = displayHeight * aspectRatio;
      
      // Constrain by width if needed
      if (displayWidth > screenWidth * 0.95) {
        displayWidth = screenWidth * 0.95;
        displayHeight = displayWidth / aspectRatio;
      }
      
      let x = (screenWidth - displayWidth) / 2;
      let y = screenHeight * 0.1;
      
      image(screenshot, x, y, displayWidth, displayHeight);
    }
  }
}

function drawInfoState() {
  if (screenshot) {
    // Preview image - 25% of screen height
    let displaySize = min(screenHeight * 0.25, screenWidth * 0.5);
    let x = (screenWidth - displaySize) / 2;
    let y = screenHeight * 0.05;
    image(screenshot, x, y, displaySize, displaySize);
  }
  
  // Labels
  fill(0);
  let labelSize = constrain(screenHeight * 0.02, 12, 16);
  textSize(labelSize);
  textAlign(LEFT);
  
  text("Nickname:", screenWidth * 0.05, screenHeight * 0.35);
  text("Location:", screenWidth * 0.05, screenHeight * 0.45);
  text("Description:", screenWidth * 0.05, screenHeight * 0.57);
}

function drawArchiveState() {
  fill(0);
  let titleSize = constrain(screenHeight * 0.025, 16, 24);
  textSize(titleSize);
  textAlign(CENTER);
  text("Gallery", screenWidth / 2, screenHeight * 0.08);
  
  if (isLoadingGallery) {
    let loadingSize = constrain(screenHeight * 0.02, 12, 16);
    textSize(loadingSize);
    text("Loading photos...", screenWidth / 2, screenHeight / 2);
  } else if (galleryPhotos.length === 0) {
    let emptySize = constrain(screenHeight * 0.02, 12, 16);
    textSize(emptySize);
    text("No photos yet", screenWidth / 2, screenHeight / 2);
  } else {
    let cols = 3;
    let cellSize = screenWidth / cols;
    let startY = screenHeight * 0.12;
    
    for (let i = 0; i < galleryPhotos.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = col * cellSize;
      let y = startY + row * cellSize;
      
      fill(200);
      rect(x, y, cellSize - 2, cellSize - 2);
      
      if (galleryPhotos[i].img) {
        image(galleryPhotos[i].img, x, y, cellSize - 2, cellSize - 2);
      }
    }
  }
}

// ==========================================
// UI CREATION & POSITIONING
// ==========================================

function createUIElements() {
  // CREATE BUTTONS
  captureButton = createButton("Capture");
  captureButton.parent("sketch-container");
  captureButton.style('position', 'absolute');
  captureButton.style('left', '50%');
  captureButton.style('transform', 'translateX(-50%)');
  captureButton.style('top', screenHeight * 0.75 + 'px');
  captureButton.style('width', screenWidth * 0.38 + 'px');
  captureButton.style('height', screenHeight * 0.06 + 'px');
  captureButton.mousePressed(handleCapture);
  
  flipButton = createButton("Flip");
  flipButton.parent("sketch-container");
  flipButton.style('position', 'absolute');
  flipButton.style('left', '50%');
  flipButton.style('transform', 'translateX(-50%)');
  flipButton.style('top', screenHeight * 0.82 + 'px');
  flipButton.style('width', screenWidth * 0.38 + 'px');
  flipButton.style('height', screenHeight * 0.06 + 'px');
  flipButton.mousePressed(handleFlip);
  
  skipButton = createButton("Skip to Archive");
  skipButton.parent("sketch-container");
  skipButton.style('position', 'absolute');
  skipButton.style('left', '50%');
  skipButton.style('transform', 'translateX(-50%)');
  skipButton.style('top', screenHeight * 0.89 + 'px');
  skipButton.style('width', screenWidth * 0.38 + 'px');
  skipButton.style('height', screenHeight * 0.06 + 'px');
  skipButton.mousePressed(function() { appState = "ARCHIVE"; });
  
  cancelButton = createButton("Cancel");
  cancelButton.parent("sketch-container");
  cancelButton.style('position', 'absolute');
  cancelButton.style('left', screenWidth * 0.1 + 'px');
  cancelButton.style('top', screenHeight * 0.88 + 'px');
  cancelButton.style('width', screenWidth * 0.25 + 'px');
  cancelButton.style('height', screenHeight * 0.06 + 'px');
  cancelButton.mousePressed(function() { appState = "DEFAULT"; });
  
  saveButton = createButton("Save");
  saveButton.parent("sketch-container");
  saveButton.style('position', 'absolute');
  saveButton.style('right', screenWidth * 0.1 + 'px');
  saveButton.style('top', screenHeight * 0.88 + 'px');
  saveButton.style('width', screenWidth * 0.25 + 'px');
  saveButton.style('height', screenHeight * 0.06 + 'px');
  saveButton.mousePressed(function() { appState = "INFO"; });
  
  backButton = createButton("Back");
  backButton.parent("sketch-container");
  backButton.style('position', 'absolute');
  backButton.style('left', screenWidth * 0.05 + 'px');
  backButton.style('top', screenHeight * 0.02 + 'px');
  backButton.style('width', screenWidth * 0.25 + 'px');
  backButton.style('height', screenHeight * 0.05 + 'px');
  backButton.mousePressed(function() { appState = "DEFAULT"; });
  
  submitButton = createButton("Submit");
  submitButton.parent("sketch-container");
  submitButton.style('position', 'absolute');
  submitButton.style('left', '50%');
  submitButton.style('transform', 'translateX(-50%)');
  submitButton.style('top', screenHeight * 0.88 + 'px');
  submitButton.style('width', screenWidth * 0.38 + 'px');
  submitButton.style('height', screenHeight * 0.06 + 'px');
  submitButton.mousePressed(handleSubmit);
  
  // CREATE INPUTS
  nicknameInput = createInput();
  nicknameInput.parent("sketch-container");
  nicknameInput.style('position', 'absolute');
  nicknameInput.style('left', screenWidth * 0.05 + 'px');
  nicknameInput.style('top', screenHeight * 0.37 + 'px');
  nicknameInput.style('width', screenWidth * 0.9 + 'px');
  nicknameInput.attribute('placeholder', 'Who are you?');
  
  locationRadio = createRadio();
  locationRadio.parent("sketch-container");
  locationRadio.style('position', 'absolute');
  locationRadio.style('left', screenWidth * 0.05 + 'px');
  locationRadio.style('top', screenHeight * 0.47 + 'px');
  locationRadio.option('main', 'Library Main');
  locationRadio.option('west', 'Library West');
  
  descriptionInput = createInput();
  descriptionInput.parent("sketch-container");
  descriptionInput.style('position', 'absolute');
  descriptionInput.style('left', screenWidth * 0.05 + 'px');
  descriptionInput.style('top', screenHeight * 0.59 + 'px');
  descriptionInput.style('width', screenWidth * 0.9 + 'px');
  descriptionInput.style('height', '80px');
  descriptionInput.attribute('placeholder', 'Where did you find it?');
}

// ==========================================
// UI VISIBILITY MANAGEMENT
// ==========================================

function updateUIVisibility() {
  captureButton.style('display', appState === "DEFAULT" ? 'block' : 'none');
  flipButton.style('display', appState === "DEFAULT" ? 'block' : 'none');
  skipButton.style('display', appState === "DEFAULT" ? 'block' : 'none');
  
  cancelButton.style('display', appState === "SCREENSHOT" ? 'block' : 'none');
  saveButton.style('display', appState === "SCREENSHOT" ? 'block' : 'none');
  
  nicknameInput.style('display', appState === "INFO" ? 'block' : 'none');
  locationRadio.style('display', appState === "INFO" ? 'block' : 'none');
  descriptionInput.style('display', appState === "INFO" ? 'block' : 'none');
  submitButton.style('display', appState === "INFO" ? 'block' : 'none');
  
  backButton.style('display', appState === "ARCHIVE" ? 'block' : 'none');
}

// ==========================================
// EVENT HANDLERS
// ==========================================

function handleCapture() {
  screenshot = capture.get();
  appState = "SCREENSHOT";
}

function handleFlip() {
  cameraBack = !cameraBack;
  capture.remove();
  
  let constraints = {
    audio: false,
    video: {
      facingMode: cameraBack ? { exact: "environment" } : "user"
    }
  };
  capture = createCapture(constraints);
  capture.hide();
}

function handleSubmit() {
  let nickname = nicknameInput.value();
  let location = locationRadio.value();
  let description = descriptionInput.value();
  
  if (!nickname || !location) {
    alert("Please fill in nickname and location");
    return;
  }
  
  submitButton.html("Uploading...");
  submitButton.attribute('disabled', '');
  
  uploadPhoto(nickname, location, description);
}

// ==========================================
// DATABASE FUNCTIONS
// ==========================================

function uploadPhoto(nickname, location, description) {
  console.log("Starting upload...");
  
  let canvas = screenshot.canvas;
  let base64Data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
  
  let formData = new FormData();
  formData.append('image', base64Data);
  
  console.log("Uploading to ImgBB...");
  
  fetch('https://api.imgbb.com/1/upload?key=' + imgbbApiKey, {
    method: 'POST',
    body: formData
  })
  .then(function(response) {
    console.log("ImgBB response status:", response.status);
    return response.json();
  })
  .then(function(data) {
    console.log("ImgBB response:", data);
    
    if (data.success) {
      let imageUrl = data.data.url;
      console.log("Image uploaded to ImgBB:", imageUrl);
      return saveToAirtable(imageUrl, nickname, location, description);
    } else {
      console.error("ImgBB failed:", data);
      throw new Error("ImgBB upload failed");
    }
  })
  .then(function() {
    console.log("Successfully saved to Airtable!");
    alert("Photo uploaded successfully!");
    
    nicknameInput.value('');
    locationRadio.selected('');
    descriptionInput.value('');
    
    submitButton.html("Submit");
    submitButton.removeAttribute('disabled');
    
    loadGalleryFromAirtable();
    appState = "ARCHIVE";
  })
  .catch(function(error) {
    console.error("Upload error:", error);
    alert("Failed to upload: " + error.message);
    
    submitButton.html("Submit");
    submitButton.removeAttribute('disabled');
  });
}

function saveToAirtable(imageUrl, nickname, location, description) {
  let url = 'https://api.airtable.com/v0/' + airtableBaseId + '/' + airtableTableName;
  
  console.log("Saving to Airtable...");
  
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + airtableApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        imageUrl: imageUrl,
        nickname: nickname,
        location: location,
        description: description,
        prompt: currentPrompt,
        timestamp: Date.now()
      }
    })
  })
  .then(function(response) {
    console.log("Airtable response status:", response.status);
    return response.json();
  })
  .then(function(data) {
    console.log("Airtable response:", data);
    
    if (data.id) {
      console.log("Data saved to Airtable with ID:", data.id);
    } else {
      console.error("Airtable save failed:", data);
      throw new Error("Airtable save failed");
    }
  });
}

function loadGalleryFromAirtable() {
  isLoadingGallery = true;
  galleryPhotos = [];
  
  let url = 'https://api.airtable.com/v0/' + airtableBaseId + '/' + airtableTableName + 
            '?sort[0][field]=timestamp&sort[0][direction]=desc';
  
  fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + airtableApiKey
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.records) {
      console.log("Loaded " + data.records.length + " records from Airtable");
      
      let promises = [];
      for (let i = 0; i < data.records.length; i++) {
        let record = data.records[i];
        let promise = loadImageAsync(record.fields.imageUrl, record.fields);
        promises.push(promise);
      }
      
      return Promise.all(promises);
    } else {
      throw new Error("No records found");
    }
  })
  .then(function() {
    console.log("All images loaded:", galleryPhotos.length);
    isLoadingGallery = false;
  })
  .catch(function(error) {
    console.error("Error loading gallery:", error);
    isLoadingGallery = false;
  });
}

function loadImageAsync(url, fields) {
  return new Promise(function(resolve, reject) {
    loadImage(url, 
      function(img) {
        galleryPhotos.push({
          img: img,
          nickname: fields.nickname,
          location: fields.location,
          description: fields.description || "",
          prompt: fields.prompt,
          timestamp: fields.timestamp
        });
        resolve();
      },
      function() {
        console.error("Failed to load image:", url);
        resolve();
      }
    );
  });
}

// ==========================================
// MOUSE CLICK FOR GALLERY ITEMS
// ==========================================

function mousePressed() {
  if (appState === "ARCHIVE" && galleryPhotos.length > 0) {
    let cols = 3;
    let cellSize = screenWidth / cols;
    let startY = screenHeight * 0.12;
    
    for (let i = 0; i < galleryPhotos.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = col * cellSize;
      let y = startY + row * cellSize;
      
      if (mouseX > x && mouseX < x + cellSize && 
          mouseY > y && mouseY < y + cellSize) {
        showPhotoModal(galleryPhotos[i]);
        break;
      }
    }
  }
}

function showPhotoModal(photo) {
  let info = "Prompt: " + photo.prompt + "\n" +
             "By: " + photo.nickname + "\n" +
             "Location: " + photo.location + "\n" +
             "Description: " + photo.description;
  alert(info);
}