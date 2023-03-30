// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUoVq2elmHLhSlc9csLAqe-IvnN6R-_Jk",
  authDomain: "real-estate-react-45614.firebaseapp.com",
  projectId: "real-estate-react-45614",
  storageBucket: "real-estate-react-45614.appspot.com",
  messagingSenderId: "712603633509",
  appId: "1:712603633509:web:7ea0a7831f9af2c964838c",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
