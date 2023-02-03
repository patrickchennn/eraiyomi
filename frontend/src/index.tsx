import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const rootElement = document.getElementById('root') as HTMLDivElement
const root = ReactDOM.createRoot(rootElement)





root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwnm8ju92PdiQ1XOS9Np95G5bEVd0aTUo",
  authDomain: "eraiyomi.firebaseapp.com",
  projectId: "eraiyomi",
  storageBucket: "eraiyomi.appspot.com",
  messagingSenderId: "604605488847",
  appId: "1:604605488847:web:223ddc0fc68ffa2d9a21ba",
  measurementId: "G-Q879BR7270"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// console.log(app)
// console.log(analytics)