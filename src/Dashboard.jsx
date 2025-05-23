// Entry point: Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import app from './firebase';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [plateInputs, setPlateInputs] = useState({});

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
    const reqRef = ref(getDatabase(app), `testDriveRequests/${id}`);
    update(reqRef, { status: 'in-progress', revealed: true });
  };

  const handleComplete = (id, requestTime) => {
    try {
      const endTime = Date.now();
      const startTime = Number(requestTime);
      if (isNaN(startTime)) throw new Error("Invalid start time");
      const durationMs = endTime - startTime;
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      const duration = `${minutes}m ${seconds}s`;

      const reqRef = ref(getDatabase(app), `testDriveRequests/${id}`);
      update(reqRef, {
        status: 'complete',
        completedAt: new Date().toLocaleTimeString(),
        duration,
        plate: plateInputs[id] || ''
      });
    } catch (error) {
      console.error('Failed to calculate duration:', error);
    }
  };

  const isNewCar = (req) => req.type === 'new-delivery';

  return (
    <div className="p-2 md:p-6 w-full">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">🚘 Guest Assistance Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-[950px] w-full border text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Time</th>
              <th className="border p-2">Task</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
              <th className="border p-2">Duration</th>
              <th className="border p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className={`border-t ${isNewCar(req) ? 'bg-yellow-100' : ''}`}>
                <td className="border p-2 whitespace-nowrap">{req.timestamp ? new Date(req.timestamp).toLocaleTimeString() : '—'}</td>
                <td className="border p-2 font-semibold">Guest Request</td>
                <td className="border p-2">
                  {req.status === 'complete' ? '✅ Complete' : req.status === 'in-progress' ? '🟠 In Progress' : '🟡 Waiting'}
                </td>
                <td className="border p-2">
                  {req.status === 'in-progress' ? (
                    <div className="space-y-2">
                      <input
                        className="border rounded px-2 py-1 w-full"
                        type="text"
                        placeholder="Enter plate number"
                        value={plateInputs[req.id] || ''}
                        onChange={(e) => setPlateInputs({ ...plateInputs, [req.id]: e.target.value })}
                      />
                      <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={() => handleComplete(req.id, req.timestamp)}>Complete</button>
                    </div>
                  ) : req.status === 'complete' ? (
                    '—'
                  ) : (
                    <button className="text-blue-600 font-semibold" onClick={() => handleClaim(req.id)}>Claim</button>
                  )}
                </td>
                <td className="border p-2">{req.duration || '—'}</td>
                <td className="border p-2">
                  {req.revealed ? (
                    <div className="text-left">
                      <p><strong>Task:</strong> Test Drive</p>
                      <p><strong>Vehicle:</strong> {req.year || ''} {req.make || ''} {req.model || ''}</p>
                      <p><strong>VIN:</strong> {req.vin}</p>
                      <p><strong>Stock:</strong> {req.stock}</p>
                    </div>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Firebase config in firebase.js
// import { initializeApp } from 'firebase/app';
// const firebaseConfig = { ... }; // from Firebase console
// const app = initializeApp(firebaseConfig);
// export default app;
