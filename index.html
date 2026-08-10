/*
==========================================================
Grayson's Snack Shop
admin.js
Firebase Admin Dashboard + Promotions
==========================================================
*/

import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    loadInventory,
    saveProduct as saveInventoryProduct,
    addProduct,
    deleteProduct as deleteInventoryProduct
} from "./inventory.js";


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

const qualifyingProduct =
    document.getElementById("qualifyingProduct");

const rewardProduct =
    document.getElementById("rewardProduct");

const savePromotionButton =
    document.getElementById("savePromotion");


// ==========================================================
// PRODUCTS
// ==========================================================

let products = [];


// ==========================================================
// PROMOTION DOCUMENT
// ==========================================================

const promotionRef = doc(
    db,
    "promotions",
    "current"
);


// ==========================================================
// AUTHENTICATION
// ==========================================================

onAuthStateChanged(auth, async (user) => {

    if (user) {

        loginBox.classList.add("hidden");

        dashboard.classList.remove("hidden");

        loginMessage.textContent = "";

        await loadAdminProducts();

        await loadPromotion();

    } else {

        dashboard.classList.add("hidden");

        loginBox.classList.remove("hidden");

    }

});


// ==========================================================
// LOGIN
// ==========================================================

loginButton.addEventListener("click", async () => {

    const email =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;


    if (!email || !password) {

        loginMessage.textContent =
            "Please enter your email and password.";

        return;

    }


    loginButton.disabled = true;

    loginButton.textContent = "Logging In...";

    loginMessage.textContent = "";


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    } catch (error) {

        console.error("Login error:", error);

        loginMessage.textContent =
            "Incorrect email or password.";

    } finally {

        loginButton.disabled = false;

        loginButton.textContent = "Login";

    }

});


// ==========================================================
// LOAD PRODUCTS
// ==========================================================

async function loadAdminProducts() {

    adminProducts.innerHTML = `
        <p>Loading products...</p>
    `;


    try {

        products = await loadInventory();

        adminProducts.innerHTML = "";


        if (products.length === 0) {

            adminProducts.innerHTML = `
                <p>No products found.</p>
            `;

        } else {

            products.forEach((product) => {

                createAdminProduct(product);

            });

        }


        populatePromotionDropdowns();

    } catch (error) {

        console.error(
            "Error loading products:",
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
// CREATE PRODUCT ADMIN CARD
// ==========================================================

function createAdminProduct(product) {

    const box = document.createElement("div");

    box.className = "admin-product";


    const productId = String(
        product.firebaseId || product.id
    );


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
            Image Filename
        </label>

        <input
            id="image-${productId}"
            value="${product.image || ""}"
        >


        <label>
            Price
        </label>

        <input
            id="price-${productId}"
            type="number"
            step="0.01"
            min="0"
            value="${product.price ?? 0}"
        >


        <label>
            Stock
        </label>

        <input
            id="stock-${productId}"
            type="number"
            min="0"
            value="${product.stock ?? 0}"
        >


        <label>
            Restock Date
        </label>

        <input
            id="restock-${productId}"
            value="${product.restock || ""}"
        >


        <div style="
            display:flex;
            gap:10px;
            margin-top:15px;
            flex-wrap:wrap;
        ">

            <button
                type="button"
                onclick="saveProduct('${productId}')"
            >
                Save
            </button>


            <button
                type="button"
                onclick="deleteProduct('${productId}')"
            >
                Delete
            </button>

        </div>

    `;


    adminProducts.appendChild(box);

}


// ==========================================================
// SAVE PRODUCT
// ==========================================================

window.saveProduct = async function(id) {

    try {

        const product = products.find((item) => {

            return String(
                item.firebaseId || item.id
            ) === String(id);

        });


        if (!product) {

            alert("Product not found.");

            return;

        }


        const updatedProduct = {

            ...product,

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


        await saveInventoryProduct(
            updatedProduct
        );


        alert(
            "Product updated successfully!"
        );


        await loadAdminProducts();

    } catch (error) {

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

    const product = products.find((item) => {

        return String(
            item.firebaseId || item.id
        ) === String(id);

    });


    if (!product) {

        alert("Product not found.");

        return;

    }


    const confirmed = confirm(
        `Are you sure you want to delete "${product.name}"?`
    );


    if (!confirmed) {

        return;

    }


    try {

        await deleteInventoryProduct(product);

        alert(
            "Product deleted successfully!"
        );

        await loadAdminProducts();

    } catch (error) {

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
        document.getElementById("newName").value.trim();

    const price =
        Number(
            document.getElementById("newPrice").value
        );

    const stock =
        Number(
            document.getElementById("newStock").value
        );

    const restock =
        document.getElementById("newRestock").value.trim();

    const image =
        document.getElementById("newImage").value.trim();


    if (!name) {

        alert(
            "Please enter a product name."
        );

        return;

    }


    if (Number.isNaN(price) || price < 0) {

        alert(
            "Please enter a valid price."
        );

        return;

    }


    if (Number.isNaN(stock) || stock < 0) {

        alert(
            "Please enter a valid stock amount."
        );

        return;

    }


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


        await addProduct(newProduct);


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

    } catch (error) {

        console.error(
            "Error adding product:",
            error
        );

        alert(
            "Something went wrong while adding the product."
        );

    } finally {

        addButton.disabled = false;

        addButton.textContent =
            "Add Product";

    }

});


// ==========================================================
// PROMOTION DROPDOWNS
// ==========================================================

function populatePromotionDropdowns() {

    if (!qualifyingProduct || !rewardProduct) {

        console.error(
            "Promotion dropdowns not found in admin.html."
        );

        return;

    }


    qualifyingProduct.innerHTML = `
        <option value="">
            Select qualifying product
        </option>
    `;


    rewardProduct.innerHTML = `
        <option value="">
            Select reward product
        </option>
    `;


    products.forEach((product) => {

        const productId = String(
            product.firebaseId || product.id
        );


        const productName =
            product.name || "Unnamed Product";


        const price =
            Number(product.price || 0).toFixed(2);


        const option1 =
            document.createElement("option");

        option1.value = productId;

        option1.textContent =
            `${productName} — $${price}`;


        qualifyingProduct.appendChild(
            option1
        );


        const option2 =
            document.createElement("option");

        option2.value = productId;

        option2.textContent =
            `${productName} — $${price}`;


        rewardProduct.appendChild(
            option2
        );

    });


    console.log(
        "Promotion dropdowns populated:",
        products.length
    );

}


// ==========================================================
// SAVE PROMOTION
// ==========================================================

if (savePromotionButton) {

    savePromotionButton.addEventListener(
        "click",
        async () => {

            const name =
                document.getElementById(
                    "promotionName"
                ).value.trim();


            const active =
                document.getElementById(
                    "promotionActive"
                ).checked;


            const start =
                document.getElementById(
                    "promotionStart"
                ).value;


            const end =
                document.getElementById(
                    "promotionEnd"
                ).value;


            const qualifyingId =
                qualifyingProduct.value;


            const rewardId =
                rewardProduct.value;


            const rewardQuantity =
                Number(
                    document.getElementById(
                        "rewardQuantity"
                    ).value
                );


            if (!name) {

                alert(
                    "Please enter a promotion name."
                );

                return;

            }


            if (!qualifyingId) {

                alert(
                    "Please select the qualifying product."
                );

                return;

            }


            if (!rewardId) {

                alert(
                    "Please select the reward product."
                );

                return;

            }


            if (
                Number.isNaN(rewardQuantity) ||
                rewardQuantity < 1
            ) {

                alert(
                    "Please enter a valid reward quantity."
                );

                return;

            }


            try {

                savePromotionButton.disabled =
                    true;

                savePromotionButton.textContent =
                    "Saving Promotion...";


                const qualifying =
                    products.find((product) => {

                        return String(
                            product.firebaseId ||
                            product.id
                        ) === String(qualifyingId);

                    });


                const reward =
                    products.find((product) => {

                        return String(
                            product.firebaseId ||
                            product.id
                        ) === String(rewardId);

                    });


                await setDoc(
                    promotionRef,
                    {

                        name: name,

                        active: active,

                        start: start,

                        end: end,

                        qualifyingProductId:
                            qualifyingId,

                        qualifyingProductName:
                            qualifying
                                ? qualifying.name
                                : "",

                        rewardProductId:
                            rewardId,

                        rewardProductName:
                            reward
                                ? reward.name
                                : "",

                        rewardQuantity:
                            rewardQuantity,

                        updatedAt:
                            new Date().toISOString()

                    }
                );


                alert(
                    "Promotion saved successfully!"
                );

            } catch (error) {

                console.error(
                    "Error saving promotion:",
                    error
                );

                alert(
                    "Could not save the promotion."
                );

            } finally {

                savePromotionButton.disabled =
                    false;

                savePromotionButton.textContent =
                    "Save Promotion";

            }

        }
    );

}


// ==========================================================
// LOAD PROMOTION
// ==========================================================

async function loadPromotion() {

    try {

        const snapshot =
            await getDoc(
                promotionRef
            );


        if (!snapshot.exists()) {

            console.log(
                "No promotion has been saved yet."
            );

            return;

        }


        const promotion =
            snapshot.data();


        document.getElementById(
            "promotionName"
        ).value =
            promotion.name || "";


        document.getElementById(
            "promotionActive"
        ).checked =
            promotion.active === true;


        document.getElementById(
            "promotionStart"
        ).value =
            promotion.start || "";


        document.getElementById(
            "promotionEnd"
        ).value =
            promotion.end || "";


        document.getElementById(
            "rewardQuantity"
        ).value =
            promotion.rewardQuantity || 1;


        if (qualifyingProduct) {

            qualifyingProduct.value =
                promotion.qualifyingProductId || "";

        }


        if (rewardProduct) {

            rewardProduct.value =
                promotion.rewardProductId || "";

        }


        console.log(
            "Promotion loaded:",
            promotion
        );

    } catch (error) {

        console.error(
            "Error loading promotion:",
            error
        );

    }

}


// ==========================================================
// LOGOUT
// ==========================================================

logoutButton.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);
