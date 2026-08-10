/*
==========================================================
Grayson's Snack Shop
admin.js
Advanced Admin Dashboard
==========================================================
*/

import {

    auth,
    db

} from "./firebase.js";


import {

    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {

    collection,
    doc,
    getDoc,
    setDoc

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
    document.getElementById(
        "loginBox"
    );


const dashboard =
    document.getElementById(
        "dashboard"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


const adminProducts =
    document.getElementById(
        "adminProducts"
    );


const logoutButton =
    document.getElementById(
        "logout"
    );


const addButton =
    document.getElementById(
        "addProduct"
    );



const qualifyingProduct =
    document.getElementById(
        "qualifyingProduct"
    );


const rewardProduct =
    document.getElementById(
        "rewardProduct"
    );


const savePromotionButton =
    document.getElementById(
        "savePromotion"
    );


const promotionStatus =
    document.getElementById(
        "promotionStatus"
    );



// ==========================================================
// CURRENT PRODUCTS
// ==========================================================

let products = [];



// ==========================================================
// PROMOTION FIRESTORE DOCUMENT
// ==========================================================

const promotionRef =
    doc(
        db,
        "promotions",
        "current"
    );



// ==========================================================
// AUTHENTICATION
// ==========================================================

onAuthStateChanged(

    auth,

    async (user) => {

        if (user) {

            loginBox.classList.add(
                "hidden"
            );


            dashboard.classList.remove(
                "hidden"
            );


            loginMessage.textContent =
                "";


            await loadAdminProducts();


            await loadPromotion();

        }

        else {

            dashboard.classList.add(
                "hidden"
            );


            loginBox.classList.remove(
                "hidden"
            );

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
            document.getElementById(
                "username"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        if (
            !email ||
            !password
        ) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;

        }


        loginButton.disabled =
            true;


        loginButton.textContent =
            "Logging In...";


        loginMessage.textContent =
            "";


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

            loginButton.disabled =
                false;


            loginButton.textContent =
                "Login";

        }

    }

);



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

        products =
            await loadInventory();


        adminProducts.innerHTML =
            "";


        if (
            products.length === 0
        ) {

            adminProducts.innerHTML = `

                <div class="empty-products">

                    <h3>
                        No products found
                    </h3>

                    <p>
                        Add your first snack below.
                    </p>

                </div>

            `;

            populatePromotionDropdowns();

            return;

        }


        products.forEach(

            product => {

                createAdminProduct(
                    product
                );

            }

        );


        /*
        IMPORTANT:

        Populate the promotion dropdowns
        AFTER Firebase inventory has loaded.
        */

        populatePromotionDropdowns();

    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        adminProducts.innerHTML = `

            <div class="empty-products">

                <h3>
                    Unable to load products
                </h3>

                <p>
                    Check the browser console for details.
                </p>

            </div>

        `;

    }

}



// ==========================================================
// POPULATE PROMOTION DROPDOWNS
// ==========================================================

function populatePromotionDropdowns() {

    /*
    Clear both dropdowns.
    */

    qualifyingProduct.innerHTML =
        "";


    rewardProduct.innerHTML =
        "";



    /*
    Add default options.
    */

    const qualifyingDefault =
        document.createElement(
            "option"
        );


    qualifyingDefault.value =
        "";


    qualifyingDefault.textContent =
        "Select qualifying product";


    qualifyingProduct.appendChild(
        qualifyingDefault
    );



    const rewardDefault =
        document.createElement(
            "option"
        );


    rewardDefault.value =
        "";


    rewardDefault.textContent =
        "Select reward product";


    rewardProduct.appendChild(
        rewardDefault
    );



    /*
    Add every Firebase product
    to both dropdowns.
    */

    products.forEach(

        product => {

            const productValue =
                product.firebaseId ||
                product.id.toString();


            const qualifyingOption =
                document.createElement(
                    "option"
                );


            qualifyingOption.value =
                productValue;


            qualifyingOption.textContent =
                `${product.name} — $${Number(product.price).toFixed(2)}`;


            qualifyingProduct.appendChild(
                qualifyingOption
            );



            const rewardOption =
                document.createElement(
                    "option"
                );


            rewardOption.value =
                productValue;


            rewardOption.textContent =
                `${product.name} — $${Number(product.price).toFixed(2)}`;


            rewardProduct.appendChild(
                rewardOption
            );

        }

    );


    console.log(
        "Promotion dropdowns populated:",
        products.length,
        "products"
    );

}



// ==========================================================
// CREATE ADMIN PRODUCT
// ==========================================================

function createAdminProduct(
    product
) {

    const box =
        document.createElement(
            "div"
        );


    box.className =
        "admin-product";


    const productId =
        product.id.toString();


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
            id="image-${productId}"
            value="${product.image || ""}"
        >


        <label>
            Price
        </label>

        <input
            id="price-${productId}"
            value="${product.price}"
            type="number"
            step="0.01"
            min="0"
        >


        <label>
            Stock
        </label>

        <input
            id="stock-${productId}"
            value="${product.stock}"
            type="number"
            min="0"
        >


        <label>
            Restock Date
        </label>

        <input
            id="restock-${productId}"
            value="${product.restock || ""}"
        >


        <div class="product-actions">

            <button
                onclick="saveProduct('${productId}')"
            >
                Save
            </button>


            <button
                class="delete-button"
                onclick="deleteProduct('${productId}')"
            >
                Delete
            </button>

        </div>

    `;


    adminProducts.appendChild(
        box
    );

}



// ==========================================================
// SAVE PRODUCT
// ==========================================================

window.saveProduct =
    async function(id) {

        try {

            const product =
                products.find(

                    item =>
                        item.id.toString() ===
                        id.toString()

                );


            if (!product) {

                alert(
                    "Product not found."
                );

                return;

            }


            const updatedProduct = {

                id:
                    product.id,

                firebaseId:
                    product.firebaseId,

                name:
                    product.name,

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


            if (
                Number.isNaN(
                    updatedProduct.price
                ) ||
                updatedProduct.price < 0
            ) {

                alert(
                    "Please enter a valid price."
                );

                return;

            }


            if (
                Number.isNaN(
                    updatedProduct.stock
                ) ||
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

window.deleteProduct =
    async function(id) {

        const product =
            products.find(

                item =>
                    item.id.toString() ===
                    id.toString()

            );


        if (!product) {

            alert(
                "Product not found."
            );

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

            await deleteProduct(
                product
            );


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

addButton.addEventListener(

    "click",

    async () => {

        const name =
            document.getElementById(
                "newName"
            ).value.trim();


        const price =
            Number(
                document.getElementById(
                    "newPrice"
                ).value
            );


        const stock =
            Number(
                document.getElementById(
                    "newStock"
                ).value
            );


        const restock =
            document.getElementById(
                "newRestock"
            ).value.trim();


        const image =
            document.getElementById(
                "newImage"
            ).value.trim();



        if (!name) {

            alert(
                "Please enter a product name."
            );

            return;

        }


        if (
            Number.isNaN(price) ||
            price < 0
        ) {

            alert(
                "Please enter a valid price."
            );

            return;

        }


        if (
            Number.isNaN(stock) ||
            stock < 0
        ) {

            alert(
                "Please enter a valid stock amount."
            );

            return;

        }



        const newProduct = {

            id:
                Date.now(),

            name:
                name,

            price:
                price,

            stock:
                stock,

            restock:
                restock,

            image:
                image

        };



        try {

            addButton.disabled =
                true;


            addButton.textContent =
                "Adding Product...";


            await addProduct(
                newProduct
            );


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

            addButton.disabled =
                false;


            addButton.textContent =
                "➕ Add Product";

        }

    }

);



// ==========================================================
// LOAD EXISTING PROMOTION
// ==========================================================

async function loadPromotion() {

    try {

        const snapshot =
            await getDoc(
                promotionRef
            );


        if (
            !snapshot.exists()
        ) {

            console.log(
                "No saved promotion found."
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
            "promotionDescription"
        ).value =
            promotion.description || "";


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



        /*
        The dropdowns must be populated before
        selecting the saved products.
        */

        if (
            promotion.qualifyingProduct
        ) {

            qualifyingProduct.value =
                promotion.qualifyingProduct;

        }


        if (
            promotion.rewardProduct
        ) {

            rewardProduct.value =
                promotion.rewardProduct;

        }


        console.log(
            "Promotion loaded:",
            promotion
        );

    }

    catch (error) {

        console.error(
            "Error loading promotion:",
            error
        );

    }

}



// ==========================================================
// SAVE PROMOTION
// ==========================================================

savePromotionButton.addEventListener(

    "click",

    async () => {

        const name =
            document.getElementById(
                "promotionName"
            ).value.trim();


        const description =
            document.getElementById(
                "promotionDescription"
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


        const qualifying =
            qualifyingProduct.value;


        const reward =
            rewardProduct.value;


        const rewardQuantity =
            Number(
                document.getElementById(
                    "rewardQuantity"
                ).value
            );



        if (!name) {

            showPromotionStatus(
                "Please enter a promotion name.",
                "error"
            );

            return;

        }


        if (!qualifying) {

            showPromotionStatus(
                "Please select the qualifying product.",
                "error"
            );

            return;

        }


        if (!reward) {

            showPromotionStatus(
                "Please select the reward product.",
                "error"
            );

            return;

        }


        if (
            !rewardQuantity ||
            rewardQuantity < 1
        ) {

            showPromotionStatus(
                "Reward quantity must be at least 1.",
                "error"
            );

            return;

        }


        if (
            start &&
            end &&
            start >= end
        ) {

            showPromotionStatus(
                "The promotion end time must be after the start time.",
                "error"
            );

            return;

        }



        const promotion = {

            name:
                name,

            description:
                description,

            active:
                active,

            start:
                start,

            end:
                end,

            qualifyingProduct:
                qualifying,

            rewardProduct:
                reward,

            rewardQuantity:
                rewardQuantity,

            updatedAt:
                new Date().toISOString()

        };



        try {

            savePromotionButton.disabled =
                true;


            savePromotionButton.textContent =
                "Saving Promotion...";


            await setDoc(
                promotionRef,
                promotion
            );


            showPromotionStatus(
                "Promotion saved successfully!",
                "success"
            );


            console.log(
                "Promotion saved:",
                promotion
            );

        }

        catch (error) {

            console.error(
                "Error saving promotion:",
                error
            );


            showPromotionStatus(
                "Could not save the promotion. Check the console.",
                "error"
            );

        }

        finally {

            savePromotionButton.disabled =
                false;


            savePromotionButton.textContent =
                "💾 Save Promotion";

        }

    }

);



// ==========================================================
// PROMOTION STATUS MESSAGE
// ==========================================================

function showPromotionStatus(
    message,
    type
) {

    promotionStatus.textContent =
        message;


    promotionStatus.className =
        `promotion-status ${type}`;


    setTimeout(

        () => {

            promotionStatus.className =
                "promotion-status";

        },

        5000

    );

}



// ==========================================================
// LOGOUT
// ==========================================================

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
