import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import app from './firebase';

export default function App() {
  const [vin, setVin] = useState('');
  const [stock, setStock] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [insuranceUploaded, setInsuranceUploaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVin(params.get('vin') || '');
    setStock(params.get('stock') || '');
  }, []);

  const handleSubmit = () => {
    setSubmitting(true);
    const db = getDatabase(app);
    const reqRef = ref(db, 'testDriveRequests');

    push(reqRef, {
      vin,
      stock,
      year: '2024',
      make: 'Hyundai',
      model: 'IONIQ 5',
      timestamp: Date.now(),
      status: 'waiting',
      revealed: false
    });

    fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        token: "aupjkhweyqjosrxkqmuoh2gtqgnjjq",
        user: "u8rd182cirsqwn5bzktt8fpgpenwx2",
        title: "🚗 New Test Drive Request",
        message: `VIN: ${vin}\nStock: ${stock}`,
        url: "https://drivepath-testdrive.netlify.app/dashboard",
        url_title: "Open Dashboard"
      })
    });

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 5000);
  };

  const handleUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (type === 'id') setIdUploaded(true);
      if (type === 'selfie') setSelfieUploaded(true);
      if (type === 'insurance') setInsuranceUploaded(true);
    };
    input.click();
  };

  return (
    <div className="p-6 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚗 DrivePath Test Drive Request</h1>
      <p className="mb-2"><strong>VIN:</strong> {vin}</p>
      <p className="mb-4"><strong>Stock #:</strong> {stock}</p>

      {!submitted && (
        <>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded">
            Request Test Drive
          </button>
        </>
      )}

      {submitting && <p className="text-blue-600 mt-4">⏳ Authorizing your test drive...</p>}

      {submitted && (
        <div className="text-left mt-6">
          <p className="mb-4 text-sm text-gray-700">
            Please upload the following items. If you don’t have a physical copy, you may upload a file or screenshot. By submitting, you acknowledge that your personal information is being shared with the dealership for verification purposes only.
          </p>

          <div className="space-y-4">
            <div>
              <button
                onClick={() => handleUpload('id')}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                {idUploaded ? '✅ ID Uploaded' : 'Upload Driver’s License or State ID'}
              </button>
            </div>

            <div>
              <button
                onClick={() => handleUpload('selfie')}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                {selfieUploaded ? '✅ Selfie Uploaded' : 'Upload Selfie'}
              </button>
            </div>

            <div>
              <button
                onClick={() => handleUpload('insurance')}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                {insuranceUploaded ? '✅ Insurance Uploaded' : 'Upload Insurance Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
