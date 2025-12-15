# Library Connector 📚📸
**Built with ❤️ for the SVA Library Community**

A collaborative photo collection web app connecting SVA students across Library Main and Library West through weekly visual prompts.

**Built with ❤️ for the SVA Library Community**

## 🎯 Project Overview

**Library Connector** is an interactive web application that enables School of Visual Arts (SVA) students to capture and share photos based on weekly themed prompts. Students access the app via NFC tags placed in both library locations, creating a shared visual archive that bridges the two campus libraries.

**Live Demo:** [https://jujubejam.github.io/hello-world-2025-final/camera2dropbox/](https://jujubejam.github.io/hello-world-2025-final/camera2dropbox/)

---

## States

### 1. **DEFAULT State** (Camera View)
- Display current week's prompt
- Camera preview with flip toggle
- Capture button to take photo
- Skip to gallery option
<img src="/README-image/state01-default01.png" alt="Not Clicked" height="300"><img src="/README-image/state01-default02.png" alt="Not Clicked" height="300">

### 2. **SCREENSHOT State** (Preview)
- Review captured photo
- Cancel to retake
- Save to proceed
<img src="/README-image/state02-screenShot01.png" alt="Not Clicked" height="300">

### 3. **INFO State** (Submission Form)
- **Nickname:** "Who are you?"
- **Location:** Radio select (Library Main / Library West)
- **Description:** "Where did you find it?" (book title, page number, who told you about it, etc.)
- Submit button to upload
<img src="/README-image/state03-info01.png" alt="Not Clicked" height="300"><img src="/README-image/state03-info02.png" alt="Not Clicked" height="300"><img src="/README-image/state03-info03.png" alt="Not Clicked" height="300">

### 4. **SAVE Process** (Background)
- Upload image to ImgBB
- Save metadata to Airtable
- Image URL linked to submission details
<img src="/README-image/state03-info04.png" alt="Not Clicked" height="300">

### 5. **ARCHIVE State** (Gallery)
- View all submissions in 3-column grid
- Click any photo for full details
- Back button to take more photos
<img src="/README-image/state04-archive01.png" alt="Not Clicked" height="300"><img src="/README-image/state04-archive02.png" alt="Not Clicked" height="300">

---

## 🌟 Future Enhancements

- [ ] Background removal for submitted images
- [ ] Weekly prompt rotation system
- [ ] Enhanced UI
- [ ] Export gallery as PDF or slideshow


# Previous Progress:

    Week 5(Dec 15, 2025)
    Final website: https://jujubejam.github.io/hello-world-2025-final/library-connector/
    Updates:
    - Linked to imgBB & Airtable
    - Responsive UI


    Week 3 (Dec 1, 2025)
    p5.js prototype: https://jujubejam.github.io/hello-world-2025-final/library-connector/
    Updates: 
    - Added more buttons & states
    - Trying to find a way to connect it to a backend cloud that allows my app to store the images.


    Week 2 (Nov 24, 2025)
    Uptates:
    - Working on sending image from p5.js to dropbox
    - Default State: Captures the video when button is pressed

<img src="/README-image/week11-update-1.png" alt="Not Clicked" height="300"><img src="/README-image/week11-update-2.png" alt="Not Clicked" height="300">

    Week 1 (Nov 17, 2025)
    Updates: 
    - Finalized concept


    Week 0 (Nov 10, 2025)
    Updates: 
    - State changes from DEFAULT to DRAW when user press ENTER
    - DRAW state still buggy

    
    Week -1 (Nov 3, 2025)
    Ideation: Interactive Installation
    * Inputs: Camera or Keyboard
    * Outputs: Physical Movement or Screen
    * Location: SVA West/East Library (TBD)
    Inspo: The Portal, Interstellar, Daniel Rozin "Wooden Mirror"

<img width="926" height="516" alt="Screenshot 2025-11-10 at 5 20 30 PM" src="https://github.com/user-attachments/assets/4dacdd12-0656-4189-93d2-f143671f044a" />