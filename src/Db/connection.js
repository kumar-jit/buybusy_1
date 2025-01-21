// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { AuthCredential } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnHUwz59Fns1Zd2YL_GWYDtKq8pqsqA68",
  authDomain: "buybusy1-10f95.firebaseapp.com",
  databaseURL: "https://buybusy1-10f95-default-rtdb.firebaseio.com",
  projectId: "buybusy1-10f95",
  storageBucket: "buybusy1-10f95.firebasestorage.app",
  messagingSenderId: "349516711001",
  appId: "1:349516711001:web:f9127456247d4e0d551d48",
  measurementId: "G-5DQN0FRNPH"
};

// Initialize Firebase
export const db = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);