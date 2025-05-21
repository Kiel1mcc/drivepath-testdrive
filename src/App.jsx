
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import app from './firebase';

export default function App() {
  const [vin, setVin] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('vin');
    if (v) setVin(v);
  }, []);

  const submitRequest = () => {
    const db = getDatabase(app);
    const reqRef = ref(db, 'testDriveRequests');
    push(reqRef, {
      vin,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">DrivePath Test Drive</h1>
      {vin ? <p className="mb-2">Requesting test drive for VIN: <strong>{vin}</strong></p> : <p>No VIN in URL.</p>}
      <button onClick={submitRequest} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Request Test Drive</button>
    </div>
  );
}
