import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import app from './firebase';

export default function App() {
  const [vin, setVin] = useState('');
  const [stock, setStock] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <div className="p-6 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚗 DrivePath Test Drive Request</h1>
      <p className="mb-2"><strong>VIN:</strong> {vin}</p>
      <p className="mb-4"><strong>Stock #:</strong> {stock}</p>

      {!submitted && (
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded">
          Request Test Drive
        </button>
      )}

      {submitting && <p className="text-blue-600 mt-4">⏳ Authorizing your test drive...</p>}
      {submitted && <p className="text-green-600 font-semibold mt-4">✅ Request sent! A guest assistant will be with you shortly.</p>}
    </div>
  );
}
