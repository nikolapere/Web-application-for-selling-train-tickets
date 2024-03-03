import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Konfiguracija Firebase-a
const firebaseConfig = {
  apiKey: "AIzaSyCuz0rPCbZOqLTc9i24r9U_VkNSI-hBoXQ",
  authDomain: "rail-tickets-base.firebaseapp.com",
  databaseURL: "https://rail-tickets-base-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rail-tickets-base",
  storageBucket: "rail-tickets-base.appspot.com",
  messagingSenderId: "484288276486",
  appId: "1:484288276486:web:47daf8815c373b3554fb87"
};

// Inicijalizacija Firebase aplikacije
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); 
const auth = getAuth(firebaseApp);

export { db, auth };



