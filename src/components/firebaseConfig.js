// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Realtime Database
// or use Firestore
// import { getFirestore } from "firebase/firestore"; // Import Firestore if you prefer Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0tihPnVYE41T-SyDVzgTGp6G2B3hSEyo",
  authDomain: "test-39c20.firebaseapp.com",
  projectId: "test-39c20",
  storageBucket: "test-39c20.appspot.com",
  messagingSenderId: "259916647857",
  appId: "1:259916647857:web:e6087264102c87e6650190"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);// Initialize Realtime Database
// export const db = getFirestore(app); // Uncomment this line if you prefer Firestore
