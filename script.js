```javascript
/*
==========================================================
Grayson's Snack Shop
script.js
Main Website JavaScript
==========================================================
*/

import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    inventory,
    loadInventory
} from "./inventory.js";


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

const promotionContainer =
    document.getElementById("promotionContainer");


// ==========================================================
// MONEY FORMAT
// ==========================================================

function money(amount) {

    return "$" + Number(amount).toFixed(2);

}


// ==========================================================
// STOCK STATUS
// ==========================================================

function getStatus(product) {

    if (Number(product.stock) <= 0) {

        return {
            text: "Out of Stock",
            class: "out-stock"
        };

    }


    if (Number(product.stock) <= 5) {

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
                ${Number(product.stock)}

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
            ${Number(product.stock)}
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
// UPDATE STATS
// ==========================================================

function updateStats(products) {

    let total =
        0;


    products.forEach((product) => {

        total +=
            Number(product.stock) || 0;

    });


    totalProducts.textContent =
        products.length;


    itemsInStock.textContent =
        total;

}


// ==========================================================
// DISPLAY PRODUCTS
// ==========================================================

function displayProducts(products) {

    productContainer.innerHTML =
        "";

    inventoryTable.innerHTML =
        "";


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
                inventory.filter((product) => {

                    return String(
                        product.name || ""
                    )
                        .toLowerCase()
                        .includes(text);

                });


            displayProducts(filtered);

        }
    );

}


// ==========================================================
// DARK MODE
// ==========================================================

if (
    localStorage.getItem("darkMode") ===
    "enabled"
) {

    document.body.classList.add(
        "dark"
    );


    if (darkButton) {

        darkButton.textContent =
            "☀️";

    }

}


if (darkButton) {

    darkButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            if (
                document.body.classList.contains(
                    "dark"
                )
            ) {

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


// ==========================================================
// LOAD PROMOTION
// ==========================================================

async function loadPromotion() {

    if (!promotionContainer) {

        return;

    }


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

            promotionContainer.innerHTML = `

                <h3>
                    No Current Promotion
                </h3>

                <p>
                    Check back soon for special offers!
                </p>

            `;

            return;

        }


        const promotion =
            snapshot.data();


        if (
            promotion.active !== true
        ) {

            promotionContainer.innerHTML = `

                <h3>
                    No Current Promotion
                </h3>

                <p>
                    Check back soon for special offers!
                </p>

            `;

            return;

        }


        const now =
            new Date();


        if (promotion.start) {

            const start =
                new Date(
                    promotion.start
                );


            if (
                !Number.isNaN(start.getTime()) &&
                now < start
            ) {

                promotionContainer.innerHTML = `

                    <h3>
                        🎉 ${promotion.name || "Special Promotion"}
                    </h3>

                    <p>
                        This promotion starts soon!
                    </p>

                    <p>
                        Qualifying Product:
                        <strong>
                            ${promotion.qualifyingProductName || "Product"}
                        </strong>
                    </p>

                `;

                return;

            }

        }


        if (promotion.end) {

            const end =
                new Date(
                    promotion.end
                );


            if (
                !Number.isNaN(end.getTime()) &&
                now > end
            ) {

                promotionContainer.innerHTML = `

                    <h3>
                        Promotion Ended
                    </h3>

                    <p>
                        Check back soon for our next promotion!
                    </p>

                `;

                return;

            }

        }


        promotionContainer.innerHTML = `

            <h2>
                🎉 ${promotion.name || "Special Promotion"}
            </h2>


            <p style="margin:15px 0;">

                Bring a friend who has never purchased
                from Grayson's Snack Shop before!

            </p>


            <p>

                When they purchase:

                <strong>
                    ${promotion.qualifyingProductName || "the qualifying product"}
                </strong>

            </p>


            <p>

                You receive:

                <strong>
                    ${promotion.rewardQuantity || 1}
                    ×
                    ${promotion.rewardProductName || "your reward"}
                </strong>

            </p>


            <p style="margin-top:15px;">

                <strong>
                    Referral rewards are given after
                    the purchase is approved.
                </strong>

            </p>

        `;

    }

    catch (error) {

        console.error(
            "Error loading promotion:",
            error
        );


        promotionContainer.innerHTML = `

            <h3>
                Promotion Currently Unavailable
            </h3>

            <p>
                Please check back later.
            </p>

        `;

    }

}


// ==========================================================
// START WEBSITE
// ==========================================================

async function startShop() {

    try {

        console.log(
            "Starting Grayson's Snack Shop..."
        );


        await loadInventory();


        displayProducts(
            inventory
        );


        await loadPromotion();


        console.log(
            "Grayson's Snack Shop Loaded Successfully"
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
                    padding:30px;
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
