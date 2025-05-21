import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚘 Live Test Drive Requests</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Time</th>
            <th className="border p-2">VIN</th>
            <th className="border p-2">Stock #</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} className="border-t">
              <td className="border p-2">{req.timestamp}</td>
              <td className="border p-2 font-mono">{req.vin}</td>
              <td className="border p-2">{req.stock}</td>
              <td className="border p-2 text-yellow-600">🟡 Waiting</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}