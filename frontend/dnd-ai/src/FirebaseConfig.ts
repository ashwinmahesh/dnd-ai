// Import the functions you need from the SDKs you need
import firebase, { getApp, initializeApp } from '@react-native-firebase/app';
// import { getAnalytics } from '@react-native-firebase/analytics';
import auth, { FirebaseAuthTypes, initializeAuth } from '@react-native-firebase/auth';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorag from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBn4wr-uQ6Crc8Sup2K-3cMslHSDtWwK4c',
  authDomain: 'dndai-4b37d.firebaseapp.com',
  projectId: 'dndai-4b37d',
  storageBucket: 'dndai-4b37d.firebasestorage.app',
  messagingSenderId: '1016458162515',
  appId: '1:1016458162515:web:2c4a5bda765177969731a6',
  measurementId: 'G-5782WCNKTH',
};

let app;

// Check if Firebase app is already initialized
if (!firebase.apps.length) {
  console.log('Initializing app?');
  app = initializeApp(firebaseConfig);
} else {
  console.log('Getting app');
  app = getApp();
}

console.log('Initializaing auth');
// Initialize Firebase Authentication
const firebaseAuth = initializeAuth(app);
console.log('Initialized auth');

// Export both app and firebaseAuth
export { app, firebaseAuth };

// export { app, firebaseAuth };
