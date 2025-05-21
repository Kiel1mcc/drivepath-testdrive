// App.jsx
import React, { useEffect, useState } from 'react';
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

  const handleRequest = () => {
    setSubmitting(true);
    const db = getDatabase(app);
    const reqRef = ref(db, 'testDriveRequests');

    push(reqRef, {
      vin,
      stock,
      timestamp: new Date().toLocaleTimeString(),
    });

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 5000);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">DrivePath Test Drive</h1>
      <p className="mb-4">
        VIN: <strong>{vin}</strong><br />
        Stock #: <strong>{stock}</strong>
      </p>

      {!submitting && !submitted && (
        <button onClick={handleRequest} className="bg-blue-600 text-white px-6 py-2 rounded">
          Request Test Drive
        </button>
      )}

      {submitting && <p className="text-blue-500 font-medium">⏳ Authorizing your test drive...</p>}
      {submitted && <p className="text-green-600 font-bold">✅ Request sent! A guest assistant will be with you shortly.</p>}
    </div>
  );
}
