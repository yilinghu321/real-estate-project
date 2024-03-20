// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "restate-project.firebaseapp.com",
  projectId: "restate-project",
  storageBucket: "restate-project.appspot.com",
  messagingSenderId: "229979274425",
  appId: "1:229979274425:web:abaae1da819f6ab5b96f68"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);