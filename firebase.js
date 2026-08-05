import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA25nuR4YIc71pa5b_2Z2dMniE2-kwzsWQ",
  authDomain: "graysons-snack-shop.firebaseapp.com",
  projectId: "graysons-snack-shop",
  storageBucket: "graysons-snack-shop.firebasestorage.app",
  messagingSenderId: "421758024195",
  appId: "1:421758024195:web:2971e15731e1c61576ec36"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
