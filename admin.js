/*
==========================================================
Grayson's Snack Shop
admin.js
Firebase Admin Dashboard
Inventory + Promotions
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
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    loadInventory,
    saveProduct,
    addProduct,
    deleteProduct
} from "./inventory.js";


// ==========================================================
// ELEMENTS
// ==========================================================

const loginBox =
    document.getElementById("loginBox");

const dashboard =
    document.getElementById("dashboard");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const adminProducts =
    document.getElementById("adminProducts");

const logoutButton =
    document.getElementById("logout");

const addButton =
    document.getElementById("addProduct");


// Promotion elements

const promotionName =
    document.getElementById("promotionName");

const promotionActive =
    document.getElementById("promotionActive");

const promotionStart =
    document.getElementById("promotionStart");

const promotionEnd =
    document.getElementById("promotionEnd");

const qualifyingProduct =
    document.getElementById("qualifyingProduct");

const rewardProduct =
    document.getElementById("rewardProduct");

const rewardQuantity =
    document.getElementById("rewardQuantity");

const savePromotionButton =
    document.getElementById("savePromotion");


// ==========================================================
// DATA
// ==========================================================

let products = [];

let promotions = [];


// ==========================================================
// AUTHENTICATION
// ==========================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (user) {

            console.log(
                "Admin authenticated:",
                user.email
            );

            loginBox.classList.add("hidden");

            dashboard.classList.remove("hidden");

            loginMessage.textContent = "";

            await loadAdminProducts();

            await loadPromotionProducts();

            await loadPromotions();

        }

        else {

            dashboard.classList.add("hidden");

            loginBox.classList.remove("hidden");

        }

    }
);


// ==========================================================
// LOGIN
// ==========================================================

loginButton.addEventListener(
    "click",
    async () => {

        const email =
            document
                .getElementById("username")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        if (!email || !password) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;

        }


        loginButton.disabled = true;

        loginButton.textContent =
            "Logging In...";

        loginMessage.textContent = "";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        }

        catch (error) {

            console.error(
                "Login error:",
                error
            );

            loginMessage.textContent =
                "Incorrect email or password.";

        }

        finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "Login";

        }

    }
);


// ==========================================================
// LOAD INVENTORY
// ==========================================================

async function loadAdminProducts() {

    if (!adminProducts) {

        return;

    }


    adminProducts.innerHTML = `

        <p>
            Loading products...
        </p>

    `;


    try {

        products =
            await loadInventory();


        adminProducts.innerHTML = "";


        if (!products.length) {

            adminProducts.innerHTML = `

                <p>
                    No products found.
                </p>

            `;

            return;

        }


        products.forEach(
            product => {

                createAdminProduct(
                    product
                );

            }
        );

    }

    catch (error) {

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
// CREATE ADMIN PRODUCT
// ==========================================================

function createAdminProduct(product) {

    const box =
        document.createElement("div");


    box.className =
        "admin-product";


    const safeId =
        String(product.id)
            .replace(/[^a-zA-Z0-9_-]/g, "_");


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
            id="image-${safeId}"
            value="${product.image || ""}"
        >


        <label>
            Price
        </label>

        <input
            id="price-${safeId}"
            value="${product.price ?? 0}"
            type="number"
            step="0.01"
            min="0"
        >


        <label>
            Stock
        </label>

        <input
            id="stock-${safeId}"
            value="${product.stock ?? 0}"
            type="number"
            min="0"
        >


        <label>
            Restock Date
        </label>

        <input
            id="restock-${safeId}"
            value="${product.restock || ""}"
        >


        <button
            class="save-product-button"
            data-product-id="${product.id}"
        >
            Save
        </button>


        <button
            class="delete-product-button"
            data-product-id="${product.id}"
        >
            Delete
        </button>

    `;


    adminProducts.appendChild(box);


    const saveButton =
        box.querySelector(
            ".save-product-button"
        );


    const deleteButton =
        box.querySelector(
            ".delete-product-button"
        );


    saveButton.addEventListener(
        "click",
        () => {

            saveAdminProduct(
                product,
                safeId
            );

        }
    );


    deleteButton.addEventListener(
        "click",
        () => {

            deleteAdminProduct(
                product
            );

        }
    );

}


// ==========================================================
// SAVE PRODUCT
// ==========================================================

async function saveAdminProduct(
    product,
    safeId
) {

    try {

        const updatedProduct = {

            ...product,

            image:
                document
                    .getElementById(
                        `image-${safeId}`
                    )
                    .value
                    .trim(),

            price:
                Number(
                    document
                        .getElementById(
                            `price-${safeId}`
                        )
                        .value
                ),

            stock:
                Number(
                    document
                        .getElementById(
                            `stock-${safeId}`
                        )
                        .value
                ),

            restock:
                document
                    .getElementById(
                        `restock-${safeId}`
                    )
                    .value
                    .trim()

        };


        if (
            isNaN(updatedProduct.price) ||
            updatedProduct.price < 0
        ) {

            alert(
                "Please enter a valid price."
            );

            return;

        }


        if (
            isNaN(updatedProduct.stock) ||
            updatedProduct.stock < 0
        ) {

            alert(
                "Please enter a valid stock amount."
            );

            return;

        }


        await saveProduct(
            updatedProduct
        );


        alert(
            "Product updated successfully!"
        );


        await loadAdminProducts();

        await loadPromotionProducts();

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

}


// ==========================================================
// DELETE PRODUCT
// ==========================================================

async function deleteAdminProduct(product) {

    const confirmed =
        confirm(
            `Are you sure you want to delete "${product.name}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteProduct(
            product
        );


        alert(
            "Product deleted successfully!"
        );


        await loadAdminProducts();

        await loadPromotionProducts();

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

}


// ==========================================================
// ADD PRODUCT
// ==========================================================

if (addButton) {

    addButton.addEventListener(
        "click",
        async () => {

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


                await addProduct(
                    newProduct
                );


                document
                    .getElementById("newName")
                    .value = "";


                document
                    .getElementById("newPrice")
                    .value = "";


                document
                    .getElementById("newStock")
                    .value = "";


                document
                    .getElementById("newRestock")
                    .value = "";


                document
                    .getElementById("newImage")
                    .value = "";


                alert(
                    "Product added successfully!"
                );


                await loadAdminProducts();

                await loadPromotionProducts();

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

        }
    );

}


// ==========================================================
// LOAD PRODUCTS INTO PROMOTION DROPDOWNS
// ==========================================================

async function loadPromotionProducts() {

    if (
        !qualifyingProduct ||
        !rewardProduct
    ) {

        console.log(
            "Promotion dropdowns not found."
        );

        return;

    }


    try {

        products =
            await loadInventory();


        qualifyingProduct.innerHTML = "";

        rewardProduct.innerHTML = "";


        if (!products.length) {

            qualifyingProduct.innerHTML = `
                <option value="">
                    No products available
                </option>
            `;

            rewardProduct.innerHTML = `
                <option value="">
                    No products available
                </option>
            `;

            return;

        }


        const defaultOption1 =
            document.createElement("option");

        defaultOption1.value = "";

        defaultOption1.textContent =
            "Select qualifying product";

        qualifyingProduct.appendChild(
            defaultOption1
        );


        const defaultOption2 =
            document.createElement("option");

        defaultOption2.value = "";

        defaultOption2.textContent =
            "Select reward product";

        rewardProduct.appendChild(
            defaultOption2
        );


        products.forEach(
            product => {

                const option1 =
                    document.createElement("option");

                option1.value =
                    String(product.id);

                option1.textContent =
                    `${product.name} — $${Number(product.price).toFixed(2)}`;

                qualifyingProduct.appendChild(
                    option1
                );


                const option2 =
                    document.createElement("option");

                option2.value =
                    String(product.id);

                option2.textContent =
                    `${product.name} — $${Number(product.price).toFixed(2)}`;

                rewardProduct.appendChild(
                    option2
                );

            }
        );


        console.log(
            "Promotion product dropdowns loaded:",
            products.length
        );

    }

    catch (error) {

        console.error(
            "Error loading promotion products:",
            error
        );


        qualifyingProduct.innerHTML = `
            <option value="">
                Error loading products
            </option>
        `;


        rewardProduct.innerHTML = `
            <option value="">
                Error loading products
            </option>
        `;

    }

}


// ==========================================================
// PROMOTION COLLECTION
// ==========================================================

const promotionsRef =
    collection(
        db,
        "promotions"
    );


// ==========================================================
// SAVE PROMOTION
// ==========================================================

if (savePromotionButton) {

    savePromotionButton.addEventListener(
        "click",
        async () => {

            try {

                const name =
                    promotionName
                        ? promotionName.value.trim()
                        : "";


                const active =
                    promotionActive
                        ? promotionActive.checked
                        : false;


                const start =
                    promotionStart
                        ? promotionStart.value
                        : "";


                const end =
                    promotionEnd
                        ? promotionEnd.value
                        : "";


                const qualifyingId =
                    qualifyingProduct
                        ? qualifyingProduct.value
                        : "";


                const rewardId =
                    rewardProduct
                        ? rewardProduct.value
                        : "";


                const quantity =
                    rewardQuantity
                        ? Number(
                            rewardQuantity.value
                        )
                        : 1;


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
                    isNaN(quantity) ||
                    quantity < 1
                ) {

                    alert(
                        "Please enter a valid reward quantity."
                    );

                    return;

                }


                if (
                    start &&
                    end &&
                    new Date(start) >= new Date(end)
                ) {

                    alert(
                        "The promotion end date must be after the start date."
                    );

                    return;

                }


                const qualifying =
                    products.find(
                        product =>
                            String(product.id) ===
                            String(qualifyingId)
                    );


                const reward =
                    products.find(
                        product =>
                            String(product.id) ===
                            String(rewardId)
                    );


                if (!qualifying || !reward) {

                    alert(
                        "Could not find the selected products."
                    );

                    return;

                }


                const promotionId =
                    `promotion-${Date.now()}`;


                const promotion = {

                    id: promotionId,

                    name: name,

                    active: active,

                    start: start,

                    end: end,

                    qualifyingProductId:
                        qualifying.id,

                    qualifyingProductName:
                        qualifying.name,

                    rewardProductId:
                        reward.id,

                    rewardProductName:
                        reward.name,

                    rewardQuantity:
                        quantity,

                    type:
                        "referral",

                    createdAt:
                        serverTimestamp()

                };


                savePromotionButton.disabled =
                    true;


                savePromotionButton.textContent =
                    "Saving...";


                await setDoc(
                    doc(
                        db,
                        "promotions",
                        promotionId
                    ),
                    promotion
                );


                alert(
                    "Promotion saved successfully!"
                );


                if (promotionName) {

                    promotionName.value = "";

                }


                if (promotionActive) {

                    promotionActive.checked =
                        false;

                }


                if (promotionStart) {

                    promotionStart.value = "";

                }


                if (promotionEnd) {

                    promotionEnd.value = "";

                }


                if (qualifyingProduct) {

                    qualifyingProduct.value = "";

                }


                if (rewardProduct) {

                    rewardProduct.value = "";

                }


                if (rewardQuantity) {

                    rewardQuantity.value = "1";

                }


                await loadPromotions();

            }

            catch (error) {

                console.error(
                    "Error saving promotion:",
                    error
                );


                alert(
                    "Something went wrong while saving the promotion."
                );

            }

            finally {

                savePromotionButton.disabled =
                    false;

                savePromotionButton.textContent =
                    "Save Promotion";

            }

        }
    );

}


// ==========================================================
// LOAD PROMOTIONS
// ==========================================================

async function loadPromotions() {

    const promotionList =
        document.getElementById(
            "promotionList"
        );


    if (!promotionList) {

        console.log(
            "promotionList element not found."
        );

        return;

    }


    promotionList.innerHTML = `

        <p>
            Loading promotions...
        </p>

    `;


    try {

        const snapshot =
            await getDocs(
                promotionsRef
            );


        promotions = [];


        snapshot.forEach(
            item => {

                promotions.push({

                    firebaseId:
                        item.id,

                    ...item.data()

                });

            }
        );


        promotionList.innerHTML = "";


        if (!promotions.length) {

            promotionList.innerHTML = `

                <p>
                    No promotions created yet.
                </p>

            `;

            return;

        }


        promotions.forEach(
            promotion => {

                createPromotionCard(
                    promotion,
                    promotionList
                );

            }
        );


        console.log(
            "Promotions loaded:",
            promotions
        );

    }

    catch (error) {

        console.error(
            "Error loading promotions:",
            error
        );


        promotionList.innerHTML = `

            <p>
                Unable to load promotions.
            </p>

        `;

    }

}


// ==========================================================
// CREATE PROMOTION CARD
// ==========================================================

function createPromotionCard(
    promotion,
    container
) {

    const card =
        document.createElement("div");


    card.className =
        "admin-promotion";


    const activeText =
        promotion.active
            ? "Active"
            : "Inactive";


    card.innerHTML = `

        <div>

            <h3>
                ${promotion.name || "Unnamed Promotion"}
            </h3>


            <p>
                Status:
                <strong>
                    ${activeText}
                </strong>
            </p>


            <p>
                Customer buys:
                <strong>
                    ${promotion.qualifyingProductName || "Unknown product"}
                </strong>
            </p>


            <p>
                Referrer receives:
                <strong>
                    ${promotion.rewardQuantity || 1}
                    ×
                    ${promotion.rewardProductName || "Unknown product"}
                </strong>
            </p>


            ${
                promotion.start
                    ? `<p>Starts: ${promotion.start}</p>`
                    : ""
            }


            ${
                promotion.end
                    ? `<p>Ends: ${promotion.end}</p>`
                    : ""
            }


            <button
                class="delete-promotion-button"
            >
                Delete Promotion
            </button>

        </div>

    `;


    container.appendChild(card);


    const deleteButton =
        card.querySelector(
            ".delete-promotion-button"
        );


    deleteButton.addEventListener(
        "click",
        async () => {

            await deletePromotion(
                promotion.firebaseId
            );

        }
    );

}


// ==========================================================
// DELETE PROMOTION
// ==========================================================

async function deletePromotion(
    promotionId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this promotion?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "promotions",
                promotionId
            )
        );


        alert(
            "Promotion deleted successfully!"
        );


        await loadPromotions();

    }

    catch (error) {

        console.error(
            "Error deleting promotion:",
            error
        );


        alert(
            "Something went wrong while deleting the promotion."
        );

    }

}


// ==========================================================
// LOGOUT
// ==========================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await signOut(
                    auth
                );

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


// ==========================================================
// INITIAL CONSOLE MESSAGE
// ==========================================================

console.log(
    "Grayson's Snack Shop Admin Loaded"
);
