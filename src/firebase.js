// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB2CceZnnJrPHrWuA-6UBiWMxHpZtVsk5M",
    authDomain: "smart-traffic-a9d28.firebaseapp.com",
    databaseURL: "https://smart-traffic-a9d28-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smart-traffic-a9d28",
    storageBucket: "smart-traffic-a9d28.appspot.com",
    messagingSenderId: "594422195001",
    appId: "1:594422195001:web:ed3a5758505abac4177ee8",
    measurementId: "G-0GSD066ZEM"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
