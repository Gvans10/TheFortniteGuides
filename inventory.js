/*
==========================================================
Grayson's Snack Shop
inventory.js
Firebase Inventory System
==========================================================
*/

import {
    db
} from "./firebase.js";

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

const inventoryRef =
    collection(
        db,
        "inventory"
    );



// ==========================================================
// CURRENT INVENTORY
// ==========================================================

let inventory = [];



// ==========================================================
// LOAD INVENTORY
// ==========================================================

async function loadInventory() {

    try {

        inventory = [];


        const snapshot =
            await getDocs(
                inventoryRef
            );


        snapshot.forEach(
            (item) => {

                const data =
                    item.data();


                let productId =
                    data.id;


                /*
                If the product doesn't have a usable
                numeric ID, use the Firebase document ID.
                */

                if (
                    productId === undefined ||
                    productId === null ||
                    productId === "" ||
                    Number.isNaN(
                        Number(productId)
                    )
                ) {

                    productId =
                        item.id;

                }


                inventory.push({

                    ...data,

                    id: productId,

                    firebaseId:
                        item.id

                });

            }
        );


        console.log(
            "Firebase Inventory Loaded:",
            inventory
        );


        return inventory;

    }

    catch (error) {

        console.error(
            "Error loading inventory:",
            error
        );

        inventory = [];

        throw error;

    }

}



// ==========================================================
// SAVE PRODUCT
// ==========================================================

async function saveProduct(product) {

    try {

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

                name:
                    product.name,

                price:
                    Number(product.price),

                stock:
                    Number(product.stock),

                restock:
                    product.restock || "",

                image:
                    product.image || ""

            }

        );


        console.log(
            "Product saved:",
            product.name
        );


        return true;

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
// ADD PRODUCT
// ==========================================================

async function addProduct(product) {

    try {

        const productId =
            product.id ||
            Date.now();


        const newProduct = {

            id:
                productId,

            name:
                product.name,

            price:
                Number(product.price),

            stock:
                Number(product.stock),

            restock:
                product.restock || "",

            image:
                product.image || ""

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


        return true;

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

async function deleteProduct(product) {

    try {

        let documentId;


        if (
            typeof product === "object"
        ) {

            documentId =
                product.firebaseId ||
                product.id.toString();

        }

        else {

            documentId =
                product.toString();

        }


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


        return true;

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
