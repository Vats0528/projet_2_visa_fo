import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

export default function PhotoCapture({ demandeId, onPhotoUpload }) {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const capture = async () => {
    if (webcamRef.current) {
      const imgSrc = webcamRef.current.getScreenshot();
      setImageSrc(imgSrc);
      setShowCamera(false);
    }
  };

  const uploadPhoto = async () => {
    if (!imageSrc) {
      setMessage('Please capture a photo first');
      return;
    }

    try {
      setLoading(true);
      // Convert base64 to blob
      const arr = imageSrc.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      const blob = new Blob([u8arr], { type: mime });

      const formData = new FormData();
      formData.append('file', blob, 'photo.jpg');

      const response = await axios.post(
        `/api/uploads/photo/${demandeId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Photo uploaded successfully!');
      setImageSrc(null);
      onPhotoUpload && onPhotoUpload();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading photo: ' + error.message);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/uploads/photo/${demandeId}`);
      setMessage('Photo deleted successfully!');
      setImageSrc(null);
      onPhotoUpload && onPhotoUpload();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting photo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">📷 Photo</h3>

      {showCamera ? (
        <div className="space-y-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
            className="rounded-lg w-full max-w-md mx-auto"
          />
          <div className="flex gap-2 justify-center">
            <button
              onClick={capture}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Capture
            </button>
            <button
              onClick={() => {
                setShowCamera(false);
                setImageSrc(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : imageSrc ? (
        <div className="space-y-4">
          <img
            src={imageSrc}
            alt="Captured"
            className="rounded-lg w-full max-w-md mx-auto"
          />
          <div className="flex gap-2 justify-center">
            <button
              onClick={uploadPhoto}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Photo'}
            </button>
            <button
              onClick={() => setImageSrc(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Retake
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowCamera(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Open Camera
          </button>
          <button
            onClick={deletePhoto}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Delete Photo
          </button>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded text-white ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
