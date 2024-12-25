// Import the functions you need from the SDKs you need
import firebase from '@react-native-firebase/app';
// import { getAnalytics } from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';

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
try {
  if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

console.log('INITIALIZED', app);

export const FirebaseAuth = auth(app);
