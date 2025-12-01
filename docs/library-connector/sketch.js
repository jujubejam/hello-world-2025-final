import React, { useState, useRef, useEffect } from 'react';
import { Camera, FlipHorizontal, X, Save, Send, ArrowLeft, ImageIcon } from 'lucide-react';

const LibraryConnector = () => {
  const [appState, setAppState] = useState('DEFAULT');
  const [facingMode, setFacingMode] = useState('user');
  const [capturedImage, setCapturedImage] = useState(null);
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [removeBg, setRemoveBg] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPrompt] = useState("butterflies");
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (appState === 'DEFAULT') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [facingMode, appState]);

  useEffect(() => {
    loadGallery();
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      setAppState('SCREENSHOT');
      stopCamera();
    }
  };

  const cancelScreenshot = () => {
    setCapturedImage(null);
    setAppState('DEFAULT');
  };

  const saveScreenshot = () => {
    setAppState('INFO');
  };

  const uploadToImgBB = async () => {
    if (!capturedImage || !nickname || !location) {
      alert("Please fill in all required fields (nickname and location)");
      return;
    }

    try {
      const base64Data = capturedImage.split(',')[1];
      const formData = new FormData();
      formData.append('image', base64Data);
      formData.append('name', `${nickname}_${Date.now()}`);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=fab8ebe76506446661ca5a19fa7afb4e`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const imageInfo = {
          url: data.data.url,
          deleteUrl: data.data.delete_url,
          nickname: nickname,
          location: location,
          description: description,
          prompt: currentPrompt,
          timestamp: Date.now()
        };
        
        const existingGallery = JSON.parse(localStorage.getItem('libraryGallery') || '[]');
        existingGallery.unshift(imageInfo);
        localStorage.setItem('libraryGallery', JSON.stringify(existingGallery));
        
        alert("Photo uploaded successfully!");
        resetForm();
        setAppState('ARCHIVE');
        loadGallery();
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo. Please try again.");
    }
  };

  const loadGallery = () => {
    const stored = localStorage.getItem('libraryGallery');
    if (stored) {
      setGallery(JSON.parse(stored));
    }
  };

  const resetForm = () => {
    setCapturedImage(null);
    setNickname('');
    setLocation('');
    setDescription('');
    setRemoveBg(false);
  };

  const goToArchive = () => {
    setAppState('ARCHIVE');
    stopCamera();
  };

  const backToDefault = () => {
    resetForm();
    setAppState('DEFAULT');
  };

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden flex flex-col">
      {/* Header with Prompt */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 text-center">
        <h2 className="text-xl font-bold">This week's prompt:</h2>
        <p className="text-2xl font-bold mt-1">{currentPrompt}</p>
      </div>

      {/* DEFAULT STATE */}
      {appState === 'DEFAULT' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="bg-gray-800 p-6 flex justify-around items-center">
            <button
              onClick={goToArchive}
              className="flex flex-col items-center text-white hover:text-pink-400 transition"
            >
              <ImageIcon size={32} />
              <span className="text-sm mt-1">Archive</span>
            </button>
            
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white border-4 border-pink-500 hover:bg-pink-100 transition transform active:scale-95"
            >
              <Camera className="mx-auto text-pink-500" size={32} />
            </button>
            
            <button
              onClick={flipCamera}
              className="flex flex-col items-center text-white hover:text-blue-400 transition"
            >
              <FlipHorizontal size={32} />
              <span className="text-sm mt-1">Flip</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREENSHOT STATE */}
      {appState === 'SCREENSHOT' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black flex items-center justify-center p-4">
            <img src={capturedImage} alt="Captured" className="max-w-full max-h-full object-contain" />
          </div>
          
          <div className="bg-gray-800 p-6 flex justify-around">
            <button
              onClick={cancelScreenshot}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <X size={20} />
              Cancel
            </button>
            
            <button
              onClick={saveScreenshot}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <Save size={20} />
              Save
            </button>
          </div>
        </div>
      )}

      {/* INFO STATE */}
      {appState === 'INFO' && (
        <div className="flex-1 overflow-y-auto bg-gray-800 p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-black rounded-lg p-4 mb-4">
              <img src={capturedImage} alt="Preview" className="w-full rounded" />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Nickname *</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Who are you?"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Location *</label>
              <div className="space-y-2">
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="radio"
                    name="location"
                    value="Library Main"
                    checked={location === 'Library Main'}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mr-3 w-5 h-5"
                  />
                  Library Main
                </label>
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="radio"
                    name="location"
                    value="Library West"
                    checked={location === 'Library West'}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mr-3 w-5 h-5"
                  />
                  Library West
                </label>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Where did you find it?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Title and page of the book, location, who told you..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-pink-500 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={uploadToImgBB}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold text-lg"
            >
              <Send size={24} />
              Submit
            </button>
          </div>
        </div>
      )}

      {/* ARCHIVE STATE */}
      {appState === 'ARCHIVE' && (
        <div className="flex-1 overflow-y-auto bg-gray-800">
          <div className="p-6">
            <button
              onClick={backToDefault}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition mb-4"
            >
              <ArrowLeft size={20} />
              Back to Camera
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">Gallery</h2>
            
            {gallery.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No photos yet. Start capturing!</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {gallery.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(item)}
                    className="aspect-square bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  >
                    <img src={item.url} alt={item.nickname} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <img src={selectedImage.url} alt={selectedImage.nickname} className="w-full rounded-lg mb-4" />
              
              <div className="space-y-3 text-white">
                <div>
                  <span className="font-semibold text-pink-400">Prompt:</span>
                  <span className="ml-2">{selectedImage.prompt}</span>
                </div>
                <div>
                  <span className="font-semibold text-pink-400">By:</span>
                  <span className="ml-2">{selectedImage.nickname}</span>
                </div>
                <div>
                  <span className="font-semibold text-pink-400">Location:</span>
                  <span className="ml-2">{selectedImage.location}</span>
                </div>
                {selectedImage.description && (
                  <div>
                    <span className="font-semibold text-pink-400">Description:</span>
                    <p className="mt-1 text-gray-300">{selectedImage.description}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedImage(null)}
                className="mt-4 w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryConnector;