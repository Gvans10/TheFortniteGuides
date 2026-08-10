```javascript
/*
==========================================================
Grayson's Snack Shop
script.js
Main Website
Firebase Inventory Version
==========================================================
*/

import {
    inventory,
    loadInventory
} from "./inventory.js";

import {
    db
} from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================================
// ELEMENTS
// ==========================================================

const productContainer =
    document.getElementById("productContainer");

const inventoryTable =
    document.getElementById("inventoryTable");

const searchInput =
    document.getElementById("searchInput");

const totalProducts =
    document.getElementById("totalProducts");

const itemsInStock =
    document.getElementById("itemsInStock");

const darkButton =
    document.getElementById("darkModeButton");


// ==========================================================
// MONEY FORMAT
// ==========================================================

function money(amount) {

    const number = Number(amount);

    if (Number.isNaN(number)) {
        return "$0.00";
    }

    return "$" + number.toFixed(2);
}


// ==========================================================
// STOCK STATUS
// ==========================================================

function getStatus(product) {

    const stock = Number(product.stock);

    if (stock <= 0) {

        return {
            text: "Out of Stock",
            class: "out-stock"
        };

    }

    if (stock <= 5) {

        return {
            text: "Low Stock",
            class: "low-stock"
        };

    }

    return {
        text: "In Stock",
        class: "in-stock"
    };

}


// ==========================================================
// CREATE PRODUCT CARD
// ==========================================================

function createProduct(product) {

    const status =
        getStatus(product);

    const card =
        document.createElement("div");

    card.className =
        "product-card";


    card.innerHTML = `

        <div class="product-image">

            <img
                src="${product.image || ""}"
                alt="${product.name || "Product"}"
                onerror="this.src='https://placehold.co/120x120?text=No+Image'"
            >

        </div>


        <div class="product-info">

            <h3>
                ${product.name || "Unnamed Product"}
            </h3>


            <div class="product-price">

                ${money(product.price)}

            </div>


            <div class="product-stock">

                Available:
                ${Number(product.stock) || 0}

            </div>


            <span class="badge ${status.class}">

                ${status.text}

            </span>


            <p style="margin-top:15px;">

                Restock Date:

                <strong>
                    ${product.restock || "Not specified"}
                </strong>

            </p>

        </div>

    `;


    productContainer.appendChild(card);

}


// ==========================================================
// CREATE INVENTORY TABLE ROW
// ==========================================================

function createTableRow(product) {

    const status =
        getStatus(product);

    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>
            ${product.name || "Unnamed Product"}
        </td>


        <td>
            ${money(product.price)}
        </td>


        <td>
            ${Number(product.stock) || 0}
        </td>


        <td>

            <span class="badge ${status.class}">

                ${status.text}

            </span>

        </td>


        <td>
            ${product.restock || "Not specified"}
        </td>

    `;


    inventoryTable.appendChild(row);

}


// ==========================================================
// UPDATE STATISTICS
// ==========================================================

function updateStats(products) {

    let total =
        0;


    products.forEach((product) => {

        const stock =
            Number(product.stock);


        if (!Number.isNaN(stock)) {

            total += stock;

        }

    });


    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    if (itemsInStock) {

        itemsInStock.textContent =
            total;

    }

}


// ==========================================================
// DISPLAY PRODUCTS
// ==========================================================

function displayProducts(products) {

    if (!productContainer ||
        !inventoryTable) {

        console.error(
            "Product containers were not found in index.html."
        );

        return;

    }


    productContainer.innerHTML =
        "";

    inventoryTable.innerHTML =
        "";


    if (products.length === 0) {

        productContainer.innerHTML = `

            <p style="
                text-align:center;
                width:100%;
                grid-column:1/-1;
            ">

                No products found.

            </p>

        `;


        inventoryTable.innerHTML = `

            <tr>

                <td colspan="5">

                    No products found.

                </td>

            </tr>

        `;


        updateStats([]);

        return;

    }


    products.forEach((product) => {

        createProduct(product);

        createTableRow(product);

    });


    updateStats(products);

}


// ==========================================================
// SEARCH
// ==========================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const text =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const filtered =
                inventory.filter(
                    (product) => {

                        const name =
                            String(
                                product.name || ""
                            ).toLowerCase();


                        return name.includes(text);

                    }
                );


            displayProducts(filtered);

        }
    );

}


// ==========================================================
// DARK MODE
// ==========================================================

function loadDarkMode() {

    const savedMode =
        localStorage.getItem(
            "darkMode"
        );


    if (
        savedMode === "enabled" &&
        document.body
    ) {

        document.body.classList.add(
            "dark"
        );


        if (darkButton) {

            darkButton.textContent =
                "☀️";

        }

    }

}


if (darkButton) {

    darkButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const enabled =
                document.body.classList.contains(
                    "dark"
                );


            if (enabled) {

                localStorage.setItem(
                    "darkMode",
                    "enabled"
                );


                darkButton.textContent =
                    "☀️";

            }

            else {

                localStorage.setItem(
                    "darkMode",
                    "disabled"
                );


                darkButton.textContent =
                    "🌙";

            }

        }
    );

}


loadDarkMode();


// ==========================================================
// PROMOTION
// ==========================================================

async function loadPromotion() {

    try {

        const promotionRef =
            doc(
                db,
                "promotions",
                "current"
            );


        const snapshot =
            await getDoc(
                promotionRef
            );


        if (!snapshot.exists()) {

            console.log(
                "No promotion currently saved."
            );

            return;

        }


        const promotion =
            snapshot.data();


        console.log(
            "Promotion loaded:",
            promotion
        );


        displayPromotion(
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
// DISPLAY PROMOTION
// ==========================================================

function displayPromotion(promotion) {

    if (!promotion) {
        return;
    }


    if (promotion.active !== true) {

        return;

    }


    let promotionBox =
        document.getElementById(
            "promotionBanner"
        );


    /*
    If there isn't a promotion banner
    in index.html yet, create one.
    */

    if (!promotionBox) {

        promotionBox =
            document.createElement(
                "section"
            );


        promotionBox.id =
            "promotionBanner";


        promotionBox.style.cssText = `

            margin: 30px auto;
            max-width: 1000px;
            padding: 30px;
            border-radius: 20px;
            background: #fff3e6;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.12);

        `;


        const productsSection =
            document.getElementById(
                "products"
            );


        if (productsSection) {

            productsSection.parentNode.insertBefore(
                promotionBox,
                productsSection
            );

        }

    }


    promotionBox.innerHTML = `

        <h2 style="
            margin-bottom:10px;
        ">

            🎉 ${promotion.name || "Special Promotion"}

        </h2>


        <p style="
            margin-bottom:10px;
        ">

            Bring a new customer to
            Grayson's Snack Shop!

        </p>


        <p>

            Buy:

            <strong>
                ${promotion.qualifyingProductName || "a qualifying product"}
            </strong>

            and the referrer can receive:

            <strong>
                ${promotion.rewardQuantity || 1} ×
                ${promotion.rewardProductName || "reward"}
            </strong>

        </p>

    `;

}


// ==========================================================
// START SHOP
// ==========================================================

async function startShop() {

    try {

        console.log(
            "Loading Grayson's Snack Shop..."
        );


        await loadInventory();


        displayProducts(
            inventory
        );


        await loadPromotion();


        console.log(
            "Grayson's Snack Shop Loaded From Firebase"
        );

    }

    catch (error) {

        console.error(
            "Failed to start Grayson's Snack Shop:",
            error
        );


        if (productContainer) {

            productContainer.innerHTML = `

                <p style="
                    text-align:center;
                    width:100%;
                    grid-column:1/-1;
                ">

                    Unable to load the shop right now.
                    Please refresh the page.

                </p>

            `;

        }

    }

}


// ==========================================================
// START
// ==========================================================

startShop();
```
