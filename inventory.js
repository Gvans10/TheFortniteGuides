/*
==========================================================
Grayson's Snack Shop
inventory.js
Firebase Inventory System
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



// ==========================================================
// FIRESTORE COLLECTION
// ==========================================================

const inventoryRef = collection(db, "inventory");



// ==========================================================
// CURRENT INVENTORY
// ==========================================================

let inventory = [];



// ==========================================================
// LOAD INVENTORY FROM FIREBASE
// ==========================================================

async function loadInventory() {

    try {

        inventory = [];


        const snapshot = await getDocs(inventoryRef);


        snapshot.forEach((item) => {

            const data = item.data();


            inventory.push({

                id: Number(item.id),

                ...data

            });

        });


        console.log(
            "Firebase Inventory Loaded:",
            inventory
        );


        return inventory;

    }

    catch (error) {

        console.error(
            "Error loading inventory from Firebase:",
            error
        );


        inventory = [];


        return inventory;

    }

}



// ==========================================================
// SAVE / UPDATE PRODUCT
// ==========================================================

async function saveProduct(product) {

    try {

        if (!product || product.id === undefined) {

            throw new Error(
                "Product must have an ID before it can be saved."
            );

        }


        const productRef = doc(
            db,
            "inventory",
            product.id.toString()
        );


        await updateDoc(
            productRef,
            {

                name: product.name,

                price: Number(product.price),

                stock: Number(product.stock),

                restock: product.restock || "",

                image: product.image || ""

            }
        );


        console.log(
            "Product Updated:",
            product
        );


        return true;

    }

    catch (error) {

        console.error(
            "Error updating product:",
            error
        );


        return false;

    }

}



// ==========================================================
// ADD NEW PRODUCT
// ==========================================================

async function addProduct(product) {

    try {

        if (!product) {

            throw new Error(
                "No product was provided."
            );

        }


        if (
            product.id === undefined ||
            product.id === null
        ) {

            product.id = Date.now();

        }


        const newProduct = {

            id: Number(product.id),

            name: product.name || "Unnamed Product",

            price: Number(product.price) || 0,

            stock: Number(product.stock) || 0,

            restock: product.restock || "",

            image: product.image || ""

        };


        await setDoc(

            doc(
                db,
                "inventory",
                newProduct.id.toString()
            ),

            newProduct

        );


        console.log(
            "Product Added:",
            newProduct
        );


        return newProduct;

    }

    catch (error) {

        console.error(
            "Error adding product:",
            error
        );


        return null;

    }

}



// ==========================================================
// DELETE PRODUCT
// ==========================================================

async function deleteProduct(id) {

    try {

        if (
            id === undefined ||
            id === null
        ) {

            throw new Error(
                "Product ID is required."
            );

        }


        await deleteDoc(

            doc(
                db,
                "inventory",
                id.toString()
            )

        );


        console.log(
            "Product Deleted:",
            id
        );


        return true;

    }

    catch (error) {

        console.error(
            "Error deleting product:",
            error
        );


        return false;

    }

}



// ==========================================================
// EXPORTS
// ==========================================================

export {

    inventory,

    loadInventory,

    saveProduct,

    addProduct,

    deleteProduct

};
