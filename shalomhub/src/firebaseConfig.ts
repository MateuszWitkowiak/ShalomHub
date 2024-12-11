import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBpLJ4twmEVBdvBEOLgL9H7L-0Si_I-EBo",
  authDomain: "shalomhub-9a724.firebaseapp.com",
  projectId: "shalomhub-9a724",
  storageBucket: "shalomhub-9a724.firebasestorage.app",
  messagingSenderId: "242852007965",
  appId: "1:242852007965:web:b2e8d4c3d7f2dcf1fa76f4",
  measurementId: "G-CFZ9J7G4F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app)

export {app, fireDb}