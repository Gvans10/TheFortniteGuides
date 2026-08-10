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


            /*
            Use the product's saved ID if one exists.

            If there isn't one, use the Firebase
            document ID instead.
            */

            let productId = data.id;

            if (
                productId === undefined ||
                productId === null ||
                productId === "" ||
                Number.isNaN(Number(productId))
            ) {

                productId = item.id;

            }


            inventory.push({

                ...data,

                id: productId,

                firebaseId: item.id

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
// SAVE PRODUCT CHANGES
// ==========================================================

async function saveProduct(product) {

    try {

        /*
        Use firebaseId when available.

        This prevents the system from trying to
        save to a document called "NaN".
        */

        const documentId =
            product.firebaseId ||
            product.id.toString();


        await updateDoc(

            doc(
                db,
                "inventory",
                documentId
            ),

            {
                name: product.name,
                price: Number(product.price),
                stock: Number(product.stock),
                restock: product.restock || "",
                image: product.image || ""
            }

        );


        console.log(
            "Product saved:",
            product
        );


    }

    catch (error) {

        console.error(
            "Error saving product:",
            error
        );

        throw error;

    }

}



// ==========================================================
// ADD NEW PRODUCT
// ==========================================================

async function addProduct(product) {

    try {

        /*
        New products get a unique numeric ID.

        Firebase will use this same ID as
        the document ID.
        */

        const productId =
            product.id ||
            Date.now();


        const newProduct = {

            id: productId,

            name: product.name,

            price: Number(product.price),

            stock: Number(product.stock),

            restock: product.restock || "",

            image: product.image || ""

        };


        await setDoc(

            doc(
                db,
                "inventory",
                productId.toString()
            ),

            newProduct

        );


        console.log(
            "Product added:",
            newProduct
        );


        return newProduct;

    }

    catch (error) {

        console.error(
            "Error adding product:",
            error
        );

        throw error;

    }

}



// ==========================================================
// DELETE PRODUCT
// ==========================================================

async function deleteProduct(id) {

    try {

        const documentId =
            typeof id === "object"
                ? (id.firebaseId || id.id.toString())
                : id.toString();


        await deleteDoc(

            doc(
                db,
                "inventory",
                documentId
            )

        );


        console.log(
            "Product deleted:",
            documentId
        );

    }

    catch (error) {

        console.error(
            "Error deleting product:",
            error
        );

        throw error;

    }

}



// ==========================================================
// EXPORT
// ==========================================================

export {

    inventory,

    loadInventory,

    saveProduct,

    addProduct,

    deleteProduct

};
