// Entry point: Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import app from './firebase';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [plate, setPlate] = useState('');
  const [vinPhoto, setVinPhoto] = useState(null);

  useEffect(() => {
    const db = getDatabase(app);
    const reqRef = ref(db, 'testDriveRequests');

    const unsub = onValue(reqRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allRequests = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
        setRequests(allRequests.reverse());
      } else {
        setRequests([]);
      }
    });

    return () => unsub();
  }, []);

  const handleClaim = (request) => {
    const reqRef = ref(getDatabase(app), `testDriveRequests/${request.id}`);
    update(reqRef, { status: 'in-progress', revealed: true });
    setActiveRequest(request);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setVinPhoto(file);
  };

  const handleComplete = () => {
    if (!activeRequest) return;

    const endTime = Date.now();
    const startTime = Number(activeRequest.timestamp);
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const duration = `${minutes}m ${seconds}s`;

    const reqRef = ref(getDatabase(app), `testDriveRequests/${activeRequest.id}`);
    update(reqRef, {
      status: 'complete',
      completedAt: new Date().toLocaleTimeString(),
      duration,
      plate,
      vinPhoto: vinPhoto ? vinPhoto.name : ''
    });

    setActiveRequest(null);
    setPlate('');
    setVinPhoto(null);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🚘 Guest Assistance Dashboard</h1>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-center text-gray-500">No requests yet</p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="border p-4 rounded bg-white shadow cursor-pointer hover:bg-blue-50"
              onClick={() => handleClaim(req)}
            >
              <p><strong>VIN:</strong> {req.vin}</p>
              <p><strong>Stock:</strong> {req.stock}</p>
              <p><strong>Phone:</strong> {req.phone}</p>
              <p><strong>Status:</strong> {req.status}</p>
            </div>
          ))
        )}
      </div>

      {activeRequest && (
        <div className="bg-white p-6 rounded shadow-md border text-left mt-4">
          <h2 className="text-xl font-bold mb-4">📝 Guest Request Details</h2>
          <p><strong>Task:</strong> Test Drive</p>
          <p><strong>Location:</strong> Lot</p>
          <p><strong>Year:</strong> {activeRequest.year || '—'}</p>
          <p><strong>Make:</strong> {activeRequest.make || '—'}</p>
          <p><strong>Model:</strong> {activeRequest.model || '—'}</p>
          <p><strong>VIN:</strong> {activeRequest.vin}</p>
          <p><strong>Stock #:</strong> {activeRequest.stock}</p>

          <div className="mt-4">
            <label className="block font-medium mb-1">Enter Plate Number:</label>
            <input
              type="text"
              className="border px-3 py-1 rounded w-full"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium mb-1">Upload VIN Photo:</label>
            <input
              type="file"
              accept="image/*"
              className="block"
              onChange={handlePhotoUpload}
            />
          </div>

          <button
            onClick={handleComplete}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
            disabled={!vinPhoto}
          >
            ✅ Complete Request
          </button>
        </div>
      )}
    </div>
  );
}

// Firebase config in firebase.js
// import { initializeApp } from 'firebase/app';
// const firebaseConfig = { ... }; // from Firebase console
// const app = initializeApp(firebaseConfig);
// export default app;
