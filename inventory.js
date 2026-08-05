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
    doc,
    setDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";




// Firestore inventory collection

const inventoryRef = collection(db, "inventory");



// Current inventory

let inventory = [];




// Load inventory from Firebase

async function loadInventory() {


    inventory = [];


    const snapshot = await getDocs(inventoryRef);



    snapshot.forEach((item) => {


        inventory.push({

            id: Number(item.id),

            ...item.data()

        });


    });



    console.log("Firebase Inventory Loaded:", inventory);



    return inventory;


}





// Save product changes

async function saveProduct(product) {


    await updateDoc(

        doc(db, "inventory", product.id.toString()),

        product

    );


}





// Add new product

async function addProduct(product) {


    await setDoc(

        doc(db, "inventory", product.id.toString()),

        product

    );


}





// Delete product

async function deleteProduct(id) {


    await deleteDoc(

        doc(db, "inventory", id.toString())

    );


}





export {

    inventory,

    loadInventory,

    saveProduct,

    addProduct,

    deleteProduct

};
