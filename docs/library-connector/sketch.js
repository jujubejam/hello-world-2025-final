// GLOBAL VARIABLES
let capture;
let screenshot;
let appState = "DEFAULT";
let cameraBack = true;

let screenWidth = 393;
let screenHeight = 852;

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
  
  // Load gallery from Airtable
  loadGalleryFromAirtable();
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
  textSize(20);
  textAlign(CENTER);
  text("This week's prompt: " + currentPrompt, screenWidth / 2, 40);
  
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
  if (screenshot) {
    let displaySize = 200;
    let x = (screenWidth - displaySize) / 2;
    image(screenshot, x, 20, displaySize, displaySize);
  }
  
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Nickname:", 20, 250);
  text("Location:", 20, 320);
  text("Description:", 20, 420);
}

function drawArchiveState() {
  fill(0);
  textSize(20);
  textAlign(CENTER);
  text("Gallery", screenWidth / 2, 40);
  
  if (isLoadingGallery) {
    textSize(14);
    text("Loading photos...", screenWidth / 2, screenHeight / 2);
  } else if (galleryPhotos.length === 0) {
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
      
      fill(200);
      rect(x, y, cellSize - 2, cellSize - 2);
      
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
  captureButton = createButton("Capture");
  captureButton.position(screenWidth / 2 - 75, screenHeight - 200);
  captureButton.size(150, 50);
  captureButton.mousePressed(handleCapture);
  
  flipButton = createButton("Flip");
  flipButton.position(screenWidth / 2 - 75, screenHeight - 140);
  flipButton.size(150, 50);
  flipButton.mousePressed(handleFlip);
  
  skipButton = createButton("Skip to Archive");
  skipButton.position(screenWidth / 2 - 75, screenHeight - 80);
  skipButton.size(150, 50);
  skipButton.mousePressed(function() {
    appState = "ARCHIVE";
  });
  
  cancelButton = createButton("Cancel");
  cancelButton.position(50, screenHeight - 100);
  cancelButton.size(100, 50);
  cancelButton.mousePressed(function() {
    appState = "DEFAULT";
  });
  
  saveButton = createButton("Save");
  saveButton.position(screenWidth - 150, screenHeight - 100);
  saveButton.size(100, 50);
  saveButton.mousePressed(function() {
    appState = "INFO";
  });
  
  backButton = createButton("Back");
  backButton.position(20, 60);
  backButton.size(100, 40);
  backButton.mousePressed(function() {
    appState = "DEFAULT";
  });
  
  nicknameInput = createInput();
  nicknameInput.position(20, 260);
  nicknameInput.size(screenWidth - 40, 30);
  nicknameInput.attribute('placeholder', 'Who are you?');
  
  locationRadio = createRadio();
  locationRadio.option('main', 'Library Main');
  locationRadio.option('west', 'Library West');
  locationRadio.position(20, 340);
  
  descriptionInput = createInput();
  descriptionInput.position(20, 440);
  descriptionInput.size(screenWidth - 40, 80);
  descriptionInput.attribute('placeholder', 'Where did you find it?');
  
  submitButton = createButton("Submit");
  submitButton.position(screenWidth / 2 - 75, screenHeight - 100);
  submitButton.size(150, 50);
  submitButton.mousePressed(handleSubmit);
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
  
  // Show loading
  submitButton.html("Uploading...");
  submitButton.attribute('disabled', '');
  
  // Upload to ImgBB and Airtable
  uploadPhoto(nickname, location, description);
}

// ==========================================
// DATABASE FUNCTIONS
// ==========================================

function uploadPhoto(nickname, location, description) {
  // Step 1: Convert image to base64
  let canvas = screenshot.canvas;
  let base64Data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
  
  // Step 2: Upload to ImgBB
  let formData = new FormData();
  formData.append('image', base64Data);
  
  fetch('https://api.imgbb.com/1/upload?key=' + imgbbApiKey, {
    method: 'POST',
    body: formData
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.success) {
      let imageUrl = data.data.url;
      console.log("Image uploaded to ImgBB:", imageUrl);
      
      // Step 3: Save to Airtable
      return saveToAirtable(imageUrl, nickname, location, description);
    } else {
      throw new Error("ImgBB upload failed");
    }
  })
  .then(function() {
    alert("Photo uploaded successfully!");
    
    // Clear form
    nicknameInput.value('');
    locationRadio.selected('');
    descriptionInput.value('');
    
    // Reset button
    submitButton.html("Submit");
    submitButton.removeAttribute('disabled');
    
    // Reload gallery
    loadGalleryFromAirtable();
    
    // Go to archive
    appState = "ARCHIVE";
  })
  .catch(function(error) {
    console.error("Upload error:", error);
    alert("Failed to upload. Please try again.");
    
    // Reset button
    submitButton.html("Submit");
    submitButton.removeAttribute('disabled');
  });
}

function saveToAirtable(imageUrl, nickname, location, description) {
  let url = 'https://api.airtable.com/v0/' + airtableBaseId + '/' + airtableTableName;
  
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
    return response.json();
  })
  .then(function(data) {
    if (data.id) {
      console.log("Data saved to Airtable:", data);
    } else {
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
      
      // Load each image
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
        resolve(); // Don't reject, just skip this image
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
    let startY = 80;
    
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