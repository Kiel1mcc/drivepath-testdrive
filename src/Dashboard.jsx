// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import './Dashboard.css';

// Firebase config copied from src/firebase.js so the dashboard can connect
// to the same project as the rest of the application.
const firebaseConfig = {
  apiKey: "AIzaSyDGZmRRpMsw8MHC2dHnTUfEJkhg6TojSI",
  authDomain: "drivepath-404fd.firebaseapp.com",
  projectId: "drivepath-404fd",
  storageBucket: "drivepath-404fd.appspot.com",
  messagingSenderId: "426514951629",
  appId: "1:426514951629:web:69e4d3f94dc1c8a0f096884",
  databaseURL: "https://drivepath-404fd-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [claimingId, setClaimingId] = useState(null);
  const [assistantName, setAssistantName] = useState('');

  useEffect(() => {
    const requestsRef = ref(db, 'testDriveRequests');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      const parsed = data ? Object.entries(data).map(([id, info]) => ({ id, ...info })) : [];

      // Ensure proper sorting — newest first by startTime if available
      parsed.sort((a, b) => (b.startTime || 0) - (a.startTime || 0));

      setRequests(parsed);
    });
    return () => unsubscribe();
  }, []);

  const handleClaimClick = (id) => {
    setClaimingId(id);
  };

  const confirmClaim = () => {
    const now = new Date().toLocaleTimeString();
    update(ref(db, `testDriveRequests/${claimingId}`), {
      status: 'in-progress',
      assistant: assistantName,
      claimedAt: now,
      // Do NOT overwrite the original timestamp
    });
    setClaimingId(null);
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
      {requests.map((req) => (
        <div key={req.id} className={`card ${req.status}`}>
          <p><strong>VIN:</strong> {req.vin}</p>
          <p><strong>Stock:</strong> {req.stock}</p>
          <p><strong>Phone:</strong> {req.phone}</p>

          {req.status === 'waiting' && (
            <button onClick={() => handleClaimClick(req.id)}>Claim Task</button>
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

      {claimingId && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Guest Assistant Name</h3>
            <input
              type="text"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
            />
            <div style={{ marginTop: '1rem' }}>
              <button onClick={confirmClaim} disabled={!assistantName}>Submit</button>
              <button onClick={() => setClaimingId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
