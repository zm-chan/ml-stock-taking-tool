// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBshreJcUdV2MD6ahe7HVTqFP4EaTC9-1I",
  authDomain: "stock-taking-app.firebaseapp.com",
  projectId: "stock-taking-app",
  storageBucket: "stock-taking-app.appspot.com",
  messagingSenderId: "188209975982",
  appId: "1:188209975982:web:5788c696b0f420fb33933f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
