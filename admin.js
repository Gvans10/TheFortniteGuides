/*
==========================================================
Grayson's Snack Shop
admin.js
Firebase Admin Dashboard
==========================================================
*/

import {
    loadInventory,
    saveProduct,
    addProduct,
    deleteProduct
} from "./inventory.js";



// ==========================================================
// ADMIN LOGIN
// ==========================================================

const ADMIN_USERNAME = "60340276";
const ADMIN_PASSWORD = "5527GSS02";



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
// CURRENT PRODUCTS
// ==========================================================

let products = [];



// ==========================================================
// LOGIN
// ==========================================================

loginButton.addEventListener("click", async () => {

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


        await loadAdminProducts();

    }

    else {

        loginMessage.textContent =
            "Incorrect username or password.";

    }

});



// ==========================================================
// LOAD PRODUCTS
// ==========================================================

async function loadAdminProducts() {

    adminProducts.innerHTML = `

        <p>
            Loading products...
        </p>

    `;


    try {

        products = await loadInventory();


        adminProducts.innerHTML = "";


        if (products.length === 0) {

            adminProducts.innerHTML = `

                <p>
                    No products found.
                </p>

            `;

            return;

        }


        products.forEach(product => {

            createAdminProduct(product);

        });

    }

    catch (error) {

        console.error(
            "Error loading admin products:",
            error
        );


        adminProducts.innerHTML = `

            <p>
                Unable to load products.
            </p>

        `;

    }

}



// ==========================================================
// CREATE ADMIN PRODUCT CARD
// ==========================================================

function createAdminProduct(product) {

    const box =
        document.createElement("div");


    box.className =
        "admin-product";


    box.innerHTML = `

        <div class="product-image">

            <img
                src="${product.image || ""}"
                alt="${product.name}"
                onerror="this.src='https://placehold.co/100x100?text=No+Image'"
            >

        </div>


        <h3>
            ${product.name}
        </h3>


        <label>
            Image Filename
        </label>


        <input
            id="image-${product.id}"
            value="${product.image || ""}"
        >


        <label>
            Price
        </label>


        <input
            id="price-${product.id}"
            value="${product.price}"
            type="number"
            step="0.01"
            min="0"
        >


        <label>
            Stock
        </label>


        <input
            id="stock-${product.id}"
            value="${product.stock}"
            type="number"
            min="0"
        >


        <label>
            Restock Date
        </label>


        <input
            id="restock-${product.id}"
            value="${product.restock || ""}"
        >


        <button
            onclick="saveProduct('${product.id}')"
        >

            Save

        </button>


        <button
            onclick="deleteProduct('${product.id}')"
        >

            Delete

        </button>

    `;


    adminProducts.appendChild(box);

}



// ==========================================================
// SAVE PRODUCT
// ==========================================================

window.saveProduct = async function(id) {

    try {

        const product =
            products.find(
                item =>
                    item.id.toString() === id.toString()
            );


        if (!product) {

            alert("Product not found.");

            return;

        }


        const updatedProduct = {

            id: product.id,

            name: product.name,

            image:
                document.getElementById(
                    `image-${id}`
                ).value.trim(),

            price:
                Number(
                    document.getElementById(
                        `price-${id}`
                    ).value
                ),

            stock:
                Number(
                    document.getElementById(
                        `stock-${id}`
                    ).value
                ),

            restock:
                document.getElementById(
                    `restock-${id}`
                ).value.trim()

        };


        const success =
            await saveProduct(
                updatedProduct
            );


        if (!success) {

            alert(
                "There was a problem updating the product."
            );

            return;

        }


        alert(
            "Product updated successfully!"
        );


        await loadAdminProducts();

    }

    catch (error) {

        console.error(
            "Error saving product:",
            error
        );


        alert(
            "Something went wrong while saving the product."
        );

    }

};



// ==========================================================
// DELETE PRODUCT
// ==========================================================

window.deleteProduct = async function(id) {

    const product =
        products.find(
            item =>
                item.id.toString() === id.toString()
        );


    if (!product) {

        alert("Product not found.");

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${product.name}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const success =
            await deleteProduct(id);


        if (!success) {

            alert(
                "There was a problem deleting the product."
            );

            return;

        }


        alert(
            "Product deleted successfully!"
        );


        await loadAdminProducts();

    }

    catch (error) {

        console.error(
            "Error deleting product:",
            error
        );


        alert(
            "Something went wrong while deleting the product."
        );

    }

};



// ==========================================================
// ADD PRODUCT
// ==========================================================

addButton.addEventListener("click", async () => {

    const name =
        document.getElementById("newName")
            .value.trim();


    const price =
        Number(
            document.getElementById("newPrice")
                .value
        );


    const stock =
        Number(
            document.getElementById("newStock")
                .value
        );


    const restock =
        document.getElementById("newRestock")
            .value.trim();


    const image =
        document.getElementById("newImage")
            .value.trim();



    // Validation

    if (!name) {

        alert(
            "Please enter a product name."
        );

        return;

    }


    if (
        isNaN(price) ||
        price < 0
    ) {

        alert(
            "Please enter a valid price."
        );

        return;

    }


    if (
        isNaN(stock) ||
        stock < 0
    ) {

        alert(
            "Please enter a valid stock amount."
        );

        return;

    }



    // Create product

    const newProduct = {

        id: Date.now(),

        name: name,

        price: price,

        stock: stock,

        restock: restock,

        image: image

    };



    try {

        addButton.disabled = true;

        addButton.textContent =
            "Adding Product...";


        const result =
            await addProduct(
                newProduct
            );


        if (!result) {

            alert(
                "There was a problem adding the product."
            );

            return;

        }


        // Clear fields

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


        alert(
            "Product added successfully!"
        );


        await loadAdminProducts();

    }

    catch (error) {

        console.error(
            "Error adding product:",
            error
        );


        alert(
            "Something went wrong while adding the product."
        );

    }

    finally {

        addButton.disabled = false;

        addButton.textContent =
            "Add Product";

    }

});



// ==========================================================
// LOGOUT
// ==========================================================

logoutButton.addEventListener("click", () => {

    dashboard.classList.add("hidden");

    loginBox.classList.remove("hidden");


    document.getElementById(
        "username"
    ).value = "";


    document.getElementById(
        "password"
    ).value = "";


    loginMessage.textContent = "";

});
