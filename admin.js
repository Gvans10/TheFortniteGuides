/*
==========================================================
Grayson's Snack Shop
admin.js
Firebase Admin Dashboard
==========================================================
*/


import { db } from "./firebase.js";

import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



// ==========================================================
// ADMIN LOGIN
// ==========================================================

const ADMIN_USERNAME = "60340276";
const ADMIN_PASSWORD = "5527GSS02";



// ==========================================================
// FIRESTORE
// ==========================================================

const inventoryRef = collection(db, "inventory");

let inventory = [];

let unsubscribeInventory = null;



// ==========================================================
// ELEMENTS
// ==========================================================

const loginBox = document.getElementById("loginBox");

const dashboard = document.getElementById("dashboard");

const loginButton = document.getElementById("loginButton");

const loginMessage = document.getElementById("loginMessage");

const adminProducts = document.getElementById("adminProducts");

const logoutButton = document.getElementById("logout");

const addButton = document.getElementById("addProduct");



// ==========================================================
// LOGIN
// ==========================================================

loginButton.addEventListener("click", login);



document
    .getElementById("password")
    .addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            login();

        }

    });



function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;



    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        loginMessage.textContent = "";

        loginBox.classList.add("hidden");

        dashboard.classList.remove("hidden");

        startInventoryListener();

    }

    else {

        loginMessage.textContent = "Incorrect login";

    }

}



// ==========================================================
// FIRESTORE LIVE INVENTORY
// ==========================================================

function startInventoryListener() {

    if (unsubscribeInventory) {

        unsubscribeInventory();

    }



    unsubscribeInventory = onSnapshot(

        inventoryRef,

        (snapshot) => {

            inventory = [];



            snapshot.forEach((item) => {

                inventory.push({

                    firestoreId: item.id,

                    ...item.data()

                });

            });



            inventory.sort((a, b) => {

                return String(a.name || "").localeCompare(
                    String(b.name || "")
                );

            });



            console.log(
                "Admin Firebase Inventory:",
                inventory
            );



            loadAdminProducts();

        },

        (error) => {

            console.error(
                "Firestore inventory error:",
                error
            );

            alert(
                "Could not load inventory from Firebase. Check the console."
            );

        }

    );

}



// ==========================================================
// DISPLAY ADMIN PRODUCTS
// ==========================================================

function loadAdminProducts() {

    adminProducts.innerHTML = "";



    if (inventory.length === 0) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.textContent =
            "No products are currently in Firestore.";

        adminProducts.appendChild(emptyMessage);

        return;

    }



    inventory.forEach((product) => {

        createAdminProduct(product);

    });

}



// ==========================================================
// CREATE ADMIN PRODUCT BOX
// ==========================================================

function createAdminProduct(product) {

    const box = document.createElement("div");

    box.className = "admin-product";



    box.innerHTML = `

        <div class="product-image">

            <img
                src="${product.image || ""}"
                alt="${product.name || "Product"}"
                onerror="this.src='https://placehold.co/100x100?text=No+Image'"
            >

        </div>


        <h3>
            ${product.name || "Unnamed Product"}
        </h3>


        <label>
            Product Name
        </label>

        <input
            class="admin-name-input"
            value="${product.name || ""}"
        >


        <label>
            Image Filename
        </label>

        <input
            class="admin-image-input"
            value="${product.image || ""}"
            placeholder="example.png"
        >


        <label>
            Price
        </label>

        <input
            class="admin-price-input"
            value="${Number(product.price || 0)}"
            type="number"
            min="0"
            step="0.01"
        >


        <label>
            Stock
        </label>

        <input
            class="admin-stock-input"
            value="${Number(product.stock || 0)}"
            type="number"
            min="0"
            step="1"
        >


        <label>
            Restock Date
        </label>

        <input
            class="admin-restock-input"
            value="${product.restock || ""}"
            placeholder="8/9/2026"
        >

    `;



    // SAVE BUTTON

    const saveButton =
        document.createElement("button");

    saveButton.textContent = "Save";

    saveButton.addEventListener(
        "click",
        () => saveProduct(product, box)
    );



    // DELETE BUTTON

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.style.marginLeft = "10px";

    deleteButton.addEventListener(
        "click",
        () => deleteProduct(product)
    );



    box.appendChild(saveButton);

    box.appendChild(deleteButton);



    adminProducts.appendChild(box);

}



// ==========================================================
// SAVE PRODUCT
// ==========================================================

async function saveProduct(product, box) {

    const name =
        box
            .querySelector(".admin-name-input")
            .value
            .trim();



    const image =
        box
            .querySelector(".admin-image-input")
            .value
            .trim();



    const price =
        Number(
            box
                .querySelector(".admin-price-input")
                .value
        );



    const stock =
        Number(
            box
                .querySelector(".admin-stock-input")
                .value
        );



    const restock =
        box
            .querySelector(".admin-restock-input")
            .value
            .trim();



    if (!name) {

        alert("Product name cannot be empty.");

        return;

    }



    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        alert("Enter a valid price.");

        return;

    }



    if (
        Number.isNaN(stock) ||
        stock < 0
    ) {

        alert("Enter a valid stock amount.");

        return;

    }



    try {

        await updateDoc(

            doc(
                db,
                "inventory",
                product.firestoreId
            ),

            {

                name: name,

                image: image,

                price: price,

                stock: stock,

                restock: restock

            }

        );



        alert("Product Updated!");

    }

    catch (error) {

        console.error(
            "Error updating product:",
            error
        );

        alert(
            "There was an error updating the product."
        );

    }

}



// ==========================================================
// DELETE PRODUCT
// ==========================================================

async function deleteProduct(product) {

    const confirmed = confirm(

        `Delete "${product.name}"?`

    );



    if (!confirmed) {

        return;

    }



    try {

        await deleteDoc(

            doc(
                db,
                "inventory",
                product.firestoreId
            )

        );



        alert("Product Deleted!");

    }

    catch (error) {

        console.error(
            "Error deleting product:",
            error
        );

        alert(
            "There was an error deleting the product."
        );

    }

}



// ==========================================================
// ADD PRODUCT
// ==========================================================

addButton.addEventListener(
    "click",
    addNewProduct
);



async function addNewProduct() {

    const name =
        document
            .getElementById("newName")
            .value
            .trim();



    const price =
        Number(
            document
                .getElementById("newPrice")
                .value
        );



    const stock =
        Number(
            document
                .getElementById("newStock")
                .value
        );



    const restock =
        document
            .getElementById("newRestock")
            .value
            .trim();



    const image =
        document
            .getElementById("newImage")
            .value
            .trim();



    if (!name) {

        alert("Enter a product name.");

        return;

    }



    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        alert("Enter a valid price.");

        return;

    }



    if (
        Number.isNaN(stock) ||
        stock < 0
    ) {

        alert("Enter a valid stock amount.");

        return;

    }



    const productId =
        Date.now().toString();



    const newProduct = {

        id: Number(productId),

        name: name,

        price: price,

        stock: stock,

        restock: restock,

        image: image

    };



    try {

        await setDoc(

            doc(
                db,
                "inventory",
                productId
            ),

            newProduct

        );



        clearAddProductForm();



        alert("Product Added!");

    }

    catch (error) {

        console.error(
            "Error adding product:",
            error
        );

        alert(
            "There was an error adding the product."
        );

    }

}



// ==========================================================
// CLEAR ADD PRODUCT FORM
// ==========================================================

function clearAddProductForm() {

    document.getElementById(
        "newName"
    ).value = "";



    document.getElementById(
        "newPrice"
    ).value = "";



    document.getElementById(
        "newStock"
    ).value = "";



    document.getElementById(
        "newRestock"
    ).value = "";



    document.getElementById(
        "newImage"
    ).value = "";

}



// ==========================================================
// LOGOUT
// ==========================================================

logoutButton.addEventListener(
    "click",
    () => {

        if (unsubscribeInventory) {

            unsubscribeInventory();

            unsubscribeInventory = null;

        }



        inventory = [];

        adminProducts.innerHTML = "";



        dashboard.classList.add("hidden");

        loginBox.classList.remove("hidden");



        document.getElementById(
            "password"
        ).value = "";

    }
);



// ==========================================================
// READY
// ==========================================================

console.log(
    "Grayson's Snack Shop Admin Firebase Loaded"
);
