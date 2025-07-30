// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import './Dashboard.css';

const firebaseConfig = {
  apiKey: 'YOUR_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_BUCKET',
  messagingSenderId: 'YOUR_MSG_ID',
  appId: 'YOUR_APP_ID'
};

initializeApp(firebaseConfig);
const db = getDatabase();

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [claiming, setClaiming] = useState(null);
  const [assistantName, setAssistantName] = useState('');

  useEffect(() => {
    const requestsRef = ref(db, 'testDriveRequests');
    onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      const parsed = data ? Object.entries(data).map(([id, info]) => ({ id, ...info })) : [];
      parsed.sort((a, b) => b.timestamp - a.timestamp);
      setRequests(parsed);
    });
  }, []);

  const handleClaim = (id) => {
    setClaiming(id);
  };

  const confirmClaim = () => {
    const now = new Date().toLocaleTimeString();
    update(ref(db, `testDriveRequests/${claiming}`), {
      status: 'in-progress',
      assistant: assistantName,
      claimedAt: now
    });
    setClaiming(null);
    setAssistantName('');
  };

  const completeTask = (id) => {
    const now = new Date().toLocaleTimeString();
    update(ref(db, `testDriveRequests/${id}`), {
      status: 'complete',
      completedAt: now
    });
  };

  return (
    <div className="dashboard">
      <h2>🚗 Guest Assistance Dashboard</h2>
      {requests.map(req => (
        <div key={req.id} className={`card ${req.status}`}>
          <p><strong>VIN:</strong> {req.vin}</p>
          <p><strong>Stock:</strong> {req.stock}</p>
          <p><strong>Phone:</strong> {req.phone}</p>
          <p><strong>Status:</strong> {req.status}</p>
          {req.status?.toLowerCase().trim() === 'waiting' && (
            <button onClick={() => handleClaim(req.id)}>Claim Task</button>
          )}
          {req.status === 'in-progress' && (
            <>
              <p><strong>Assistant:</strong> {req.assistant}</p>
              <p><strong>Claimed At:</strong> {req.claimedAt}</p>
              <button onClick={() => completeTask(req.id)}>Complete Task</button>
            </>
          )}
          {req.status === 'complete' && (
            <>
              <p><strong>Assistant:</strong> {req.assistant}</p>
              <p><strong>Completed At:</strong> {req.completedAt}</p>
            </>
          )}
        </div>
      ))}

      {claiming && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Guest Assistant Name</h3>
            <input
              type="text"
              value={assistantName}
              onChange={e => setAssistantName(e.target.value)}
            />
            <button onClick={confirmClaim}>Submit</button>
            <button onClick={() => setClaiming(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
