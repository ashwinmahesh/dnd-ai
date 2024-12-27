// Import the functions you need from the SDKs you need
import firebase, { getApp, initializeApp, ReactNativeFirebase } from '@react-native-firebase/app';
import { initializeAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBn4wr-uQ6Crc8Sup2K-3cMslHSDtWwK4c',
  authDomain: 'dndai-4b37d.firebaseapp.com',
  projectId: 'dndai-4b37d',
  storageBucket: 'dndai-4b37d.firebasestorage.app',
  messagingSenderId: '1016458162515',
  appId: '1:1016458162515:web:2c4a5bda765177969731a6',
  measurementId: 'G-5782WCNKTH',
};

let app: ReactNativeFirebase.FirebaseApp;

// Check if Firebase app is already initialized
if (!firebase.apps.length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase Authentication
const firebaseAuth = initializeAuth(app as any);

const firestore = getFirestore(app);

export { app, firebaseAuth, firestore };
