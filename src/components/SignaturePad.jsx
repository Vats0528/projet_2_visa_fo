import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

export default function SignaturePad({ demandeId, onSignatureUpload }) {
  const sigCanvas = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const uploadSignature = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      setMessage('Please draw a signature first');
      return;
    }

    try {
      setUploading(true);
      const dataUrl = sigCanvas.current.toDataURL('image/png');
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'signature.png');

      await axios.post(`/api/uploads/signature/${demandeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Signature uploaded successfully!');
      clearSignature();
      onSignatureUpload && onSignatureUpload();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setMessage('Error uploading signature: ' + errorMsg);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteSignature = async () => {
    try {
      setUploading(true);
      await axios.delete(`/api/uploads/signature/${demandeId}`);
      setMessage('Signature deleted successfully!');
      clearSignature();
      onSignatureUpload && onSignatureUpload();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting signature: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">✍️ Signature</h3>

      <div className="space-y-4">
        <div className="border-2 border-gray-300 rounded-lg bg-white overflow-auto">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              width: 500,
              height: 200,
              className: 'w-full border-gray-300 rounded-lg touch-none',
              style: { display: 'block' }
            }}
            velocityFilterWeight={0.7}
            minWidth={1}
            maxWidth={2.0}
            throttle={16}
          />
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={clearSignature}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={uploading}
          >
            Clear
          </button>
          <button
            onClick={uploadSignature}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Signature'}
          </button>
          <button
            onClick={deleteSignature}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={uploading}
          >
            Delete Signature
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded text-white text-center ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
