import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
