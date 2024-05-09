// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  apiKey: 'AIzaSyBvr8kKOABj3M5OULsRXP6r7eBStGKSBm8',
  authDomain: 'coursetracker-ec6c5.firebaseapp.com',
  projectId: 'coursetracker-ec6c5',
  storageBucket: 'coursetracker-ec6c5.appspot.com',
  messagingSenderId: '475184291215',
  appId: '1:475184291215:web:6df2b6c4fdb8b183b6fffa',
  measurementId: 'G-ZL3L3MYVRC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
app;
// const analytics = getAnalytics(app);
export const db = getFirestore();
