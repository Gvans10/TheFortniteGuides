/*
==========================================================
Grayson's Snack Shop
firebase.js
Firebase Configuration
==========================================================
*/

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";



// ==========================================================
// FIREBASE CONFIGURATION
// ==========================================================

const firebaseConfig = {

    apiKey: "AIzaSyA25nuR4YIc71pa5b_2Z2dMniE2-kwzsWQ",

    authDomain:
        "graysons-snack-shop.firebaseapp.com",

    projectId:
        "graysons-snack-shop",

    storageBucket:
        "graysons-snack-shop.firebasestorage.app",

    messagingSenderId:
        "421758024195",

    appId:
        "1:421758024195:web:2971e15731e1c61576ec36"

};



// ==========================================================
// INITIALIZE FIREBASE
// ==========================================================

const app =
    initializeApp(firebaseConfig);



// ==========================================================
// FIRESTORE
// ==========================================================

export const db =
    getFirestore(app);



// ==========================================================
// FIREBASE AUTHENTICATION
// ==========================================================

export const auth =
    getAuth(app);
