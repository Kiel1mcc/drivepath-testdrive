// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, get } from 'firebase/database';
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

  const openClaimDialog = (id) => {
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

  const handleCompleteTask = async (taskId) => {
    const taskRef = ref(db, `testDriveRequests/${taskId}`);
    const snapshot = await get(taskRef);
    const data = snapshot.val();

    const startTimestamp = data?.startTime || Date.now();
    const endTimestamp = Date.now();
    const durationSeconds = Math.floor((endTimestamp - startTimestamp) / 1000);
    const durationStr = `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;

    await update(taskRef, {
      status: 'complete',
      completedAt: new Date(endTimestamp).toLocaleTimeString(),
      duration: durationStr
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
            <th>Request</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((task) => {
            const { id, startTime, vin, stock, status, duration } = task;
            return (
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
                  <button
                    onClick={() => openClaimDialog(id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Claim
                  </button>
                ) : status === "in-progress" ? (
                  <button
                    onClick={() => handleCompleteTask(id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Complete Task
                  </button>
                ) : (
                  "—"
                )}
              </td>
              <td>{duration || "—"}</td>
              <td>{task.assistant ? "Test Drive" : ""}</td>
            </tr>
            );
          })}
        </tbody>
      </table>

      {claimingId && (
        <div className="modal">
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
              width: '300px',
              textAlign: 'center',
              margin: 'auto',
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: 'bold',
              }}
            >
              Enter Guest Assistant Name
            </label>
            <input
              type="text"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              style={{
                padding: '8px',
                width: '100%',
                marginBottom: '15px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={confirmClaim}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                disabled={!assistantName}
              >
                Submit
              </button>
              <button
                onClick={() => setClaimingId(null)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
