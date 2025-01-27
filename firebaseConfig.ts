import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDQw1JrYoA37P7p894aUUCRwPd83FQtEGs",
    authDomain: "todoapp-1ccf2.firebaseapp.com",
    projectId: "todoapp-1ccf2",
    storageBucket: "todoapp-1ccf2.firebasestorage.app",
    messagingSenderId: "120575316178",
    appId: "1:120575316178:web:3885a8c004e6a0fe3fdd0b"
  };
  
  // Initialize Firebase
//   const app = initializeApp(firebaseConfig);

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
