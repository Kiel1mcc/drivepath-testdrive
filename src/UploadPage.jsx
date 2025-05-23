import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import app from './firebase';

export default function UploadPage() {
  const [vin, setVin] = useState('');
  const [stock, setStock] = useState('');
  const [phone, setPhone] = useState('');
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [insuranceUploaded, setInsuranceUploaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVin(params.get('vin') || '');
    setStock(params.get('stock') || '');
  }, []);

  const handleUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (type === 'selfie') {
      input.capture = 'user';
    } else {
      input.capture = 'environment';
    }
    input.onchange = () => {
      if (type === 'id') setIdUploaded(true);
      if (type === 'selfie') setSelfieUploaded(true);
      if (type === 'insurance') setInsuranceUploaded(true);
    };
    input.click();
  };

  const allUploaded = idUploaded && selfieUploaded && insuranceUploaded && phone.trim() !== '';

  const handleSubmit = () => {
    const db = getDatabase(app);
    const reqRef = ref(db, 'testDriveRequests');

    push(reqRef, {
      vin,
      stock,
      phone,
      timestamp: Date.now(),
      status: 'waiting',
      revealed: false
    });

    alert('✅ Submitted! A guest assistant will be with you shortly.');
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-left">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Required Items</h1>
      <p className="mb-4 text-gray-700 text-center">
        To complete your contactless test drive request, please upload the following. If you don't have a physical copy, you may upload a file or screenshot.
      </p>

      <div className="space-y-4">
        <div>
          <button
            onClick={() => handleUpload('id')}
            className="bg-gray-200 px-4 py-2 rounded w-full text-left"
          >
            {idUploaded ? '✔ ID Uploaded' : 'Upload Driver’s License or State ID'}
          </button>
        </div>

        <div>
          <button
            onClick={() => handleUpload('selfie')}
            className="bg-gray-200 px-4 py-2 rounded w-full text-left"
          >
            {selfieUploaded ? '✔ Selfie Uploaded' : 'Upload Selfie'}
          </button>
        </div>

        <div>
          <button
            onClick={() => handleUpload('insurance')}
            className="bg-gray-200 px-4 py-2 rounded w-full text-left"
          >
            {insuranceUploaded ? '✔ Insurance Uploaded' : 'Upload Insurance Card'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="e.g. 555-123-4567"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={!allUploaded}
          className={`px-6 py-2 w-full rounded ${allUploaded ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Submit for Authorization
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-600 border-t pt-4">
        By submitting, you acknowledge that your information — including your phone number — will be securely shared with the dealership for the purpose of verifying your identity, insurance coverage, and for any necessary communication regarding your visit. No information will be stored or used beyond this transaction.
      </div>
    </div>
  );
}
