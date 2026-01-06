// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlcwFnHnBb9bRv5xoUEb-2sTSjQcyz84E",
  authDomain: "order-tracker-51471.firebaseapp.com",
  projectId: "order-tracker-51471",
  storageBucket: "order-tracker-51471.firebasestorage.app",
  messagingSenderId: "761684041108",
  appId: "1:761684041108:web:5625e43759ed00951a0381",
  measurementId: "G-ZN5F15TX8S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);

window.currentEditId = null;
