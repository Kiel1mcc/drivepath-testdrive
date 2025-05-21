// Entry point: Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import app from './firebase';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);

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

  const handleClaim = (id) => {
    const db = getDatabase(app);
    const reqRef = ref(db, `testDriveRequests/${id}`);
    update(reqRef, { status: 'in-progress', startTime: Date.now() });
  };

  const handleComplete = (id, startTime) => {
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const duration = `${minutes}m ${seconds}s`;

    const db = getDatabase(app);
    const reqRef = ref(db, `testDriveRequests/${id}`);
    update(reqRef, { status: 'complete', completedAt: new Date().toLocaleTimeString(), duration });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚘 Live Test Drive Requests</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Time</th>
            <th className="border p-2">VIN</th>
            <th className="border p-2">Stock #</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">Duration</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} className="border-t">
              <td className="border p-2">{req.timestamp}</td>
              <td className="border p-2 font-mono">{req.vin}</td>
              <td className="border p-2">{req.stock}</td>
              <td className="border p-2">
                {req.status === 'complete' ? '✅ Complete' : req.status === 'in-progress' ? '🟠 In Progress' : '🟡 Waiting'}
              </td>
              <td className="border p-2">
                {req.status === 'in-progress' ? (
                  <button className="text-green-600 font-semibold" onClick={() => handleComplete(req.id, req.startTime)}>Complete</button>
                ) : req.status === 'complete' ? (
                  '—'
                ) : (
                  <button className="text-blue-600 font-semibold" onClick={() => handleClaim(req.id)}>Claim</button>
                )}
              </td>
              <td className="border p-2">{req.duration || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Firebase config in firebase.js
// import { initializeApp } from 'firebase/app';
// const firebaseConfig = { ... }; // from Firebase console
// const app = initializeApp(firebaseConfig);
// export default app;
