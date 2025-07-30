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

      // Sort by startTime (newest first) and ignore missing values
      const ordered = parsed
        .filter((req) => req.startTime)
        .sort((a, b) => {
          const aTime = a.startTime || 0;
          const bTime = b.startTime || 0;
          return bTime - aTime;
        });

      setRequests(ordered);
    });
    return () => unsubscribe();
  }, []);

  const handleClaim = (id) => {
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
      <table className="requests-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>VIN</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Claim</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(({ id, startTime, vin, stock, status, duration }) => (
            <tr key={id}>
              <td>{startTime ? new Date(startTime).toLocaleTimeString() : "--"}</td>
              <td>{vin || "--"}</td>
              <td>{stock || "--"}</td>
              <td>
                {status === "waiting" ? (
                  <span style={{ color: "#d4a300" }}>🟡 Waiting</span>
                ) : status === "in-progress" ? (
                  <span style={{ color: "#007bff" }}>🔄 In Progress</span>
                ) : (
                  <span style={{ color: "green" }}>✅ Complete</span>
                )}
              </td>
              <td>
                {status === "waiting" ? (
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleClaim(id)}
                  >
                    Claim
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td>{duration || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
