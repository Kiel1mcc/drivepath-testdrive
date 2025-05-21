
import { initializeApp } from 'firebase/app';

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
export default app;
