// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrX2OKUgUpQ5iutZMlz4jpd-Fy3bDS8Yo",
  authDomain: "chat-free-7388b.firebaseapp.com",
  projectId: "chat-free-7388b",
  storageBucket: "chat-free-7388b.appspot.com",
  messagingSenderId: "761259326833",
  appId: "1:761259326833:web:2dcca7415fdbbf828e4ad0",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
