/*
==========================================================
Grayson's Snack Shop
inventory.js
Firebase Product Storage
==========================================================
*/

import { db } from "./firebase.js";
import { 
    collection,
    getDocs,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const defaultInventory = [

    {
        id: 1,
        name: "Taki Red Fiesta",
        price: 8.00,
        stock: 8,
        restock: "8/9/2026",
        image: "redtakifiesta.png"
    },

    {
        id: 2,
        name: "Taki Blue Fiesta",
        price: 8.00,
        stock: 8,
        restock: "8/9/2026",
        image: "bluetakifiesta.png"
    },

    {
        id: 3,
        name: "Taki Red 1oz Bag",
        price: 1.00,
        stock: 50,
        restock: "8/9/2026",
        image: "redtakismall.png"
    },

    {
        id: 4,
        name: "Taki Blue 1oz Bag",
        price: 1.00,
        stock: 50,
        restock: "8/9/2026",
        image: "bluetakismall.png"
    }

    // Keep the rest of your products here
];


const inventoryRef = collection(db, "inventory");


// Upload products to Firebase
async function uploadInventory() {

    for (const product of defaultInventory) {

        await setDoc(
            doc(inventoryRef, product.id.toString()),
            product
        );

    }

    console.log("Inventory uploaded to Firebase");
}


// Load products from Firebase
async function loadInventory() {

    const snapshot = await getDocs(inventoryRef);

    let products = [];

    snapshot.forEach((doc) => {
        products.push({
            id: doc.id,
            ...doc.data()
        });
    });


    console.log("Firebase Inventory:", products);

    return products;
}


loadInventory();
