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
// GET WEBSITE ELEMENTS
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
// MONEY
// ==========================================================

function money(amount) {

    const value = Number(amount);

    if (Number.isNaN(value)) {
        return "$0.00";
    }

    return "$" + value.toFixed(2);
}


// ==========================================================
// STOCK STATUS
// ==========================================================

function getStatus(product) {

    const stock = Number(product.stock);

    if (stock <= 0) {

        return {
            text: "Out of Stock",
            cssClass: "out-stock"
        };

    }

    if (stock <= 5) {

        return {
            text: "Low Stock",
            cssClass: "low-stock"
        };

    }

    return {
        text: "In Stock",
        cssClass: "in-stock"
    };

}


// ==========================================================
// CREATE PRODUCT CARD
// ==========================================================

function createProduct(product) {

    const card =
        document.createElement("div");

    card.className =
        "product-card";


    // Product image

    const imageContainer =
        document.createElement("div");

    imageContainer.className =
        "product-image";


    const image =
        document.createElement("img");

    image.src =
        product.image || "";

    image.alt =
        product.name || "Product";


    image.onerror =
        function() {

            this.src =
                "https://placehold.co/120x120?text=No+Image";

        };


    imageContainer.appendChild(
        image
    );


    // Product info

    const info =
        document.createElement("div");

    info.className =
        "product-info";


    // Product name

    const name =
        document.createElement("h3");

    name.textContent =
        product.name || "Unnamed Product";


    // Price

    const price =
        document.createElement("div");

    price.className =
        "product-price";

    price.textContent =
        money(product.price);


    // Stock

    const stock =
        document.createElement("div");

    stock.className =
        "product-stock";

    stock.textContent =
        "Available: " +
        (Number(product.stock) || 0);


    // Status

    const status =
        getStatus(product);


    const badge =
        document.createElement("span");

    badge.className =
        "badge " +
        status.cssClass;

    badge.textContent =
        status.text;


    // Restock

    const restock =
        document.createElement("p");

    restock.style.marginTop =
        "15px";

    restock.textContent =
        "Restock Date: " +
        (product.restock || "Not specified");


    // Put everything together

    info.appendChild(name);

    info.appendChild(price);

    info.appendChild(stock);

    info.appendChild(badge);

    info.appendChild(restock);

    card.appendChild(
        imageContainer
    );

    card.appendChild(
        info
    );


    productContainer.appendChild(
        card
    );

}


// ==========================================================
// CREATE INVENTORY TABLE ROW
// ==========================================================

function createTableRow(product) {

    const row =
        document.createElement("tr");


    const nameCell =
        document.createElement("td");

    nameCell.textContent =
        product.name || "Unnamed Product";


    const priceCell =
        document.createElement("td");

    priceCell.textContent =
        money(product.price);


    const stockCell =
        document.createElement("td");

    stockCell.textContent =
        Number(product.stock) || 0;


    const statusCell =
        document.createElement("td");


    const status =
        getStatus(product);


    const badge =
        document.createElement("span");

    badge.className =
        "badge " +
        status.cssClass;

    badge.textContent =
        status.text;


    statusCell.appendChild(
        badge
    );


    const restockCell =
        document.createElement("td");

    restockCell.textContent =
        product.restock || "Not specified";


    row.appendChild(
        nameCell
    );

    row.appendChild(
        priceCell
    );

    row.appendChild(
        stockCell
    );

    row.appendChild(
        statusCell
    );

    row.appendChild(
        restockCell
    );


    inventoryTable.appendChild(
        row
    );

}


// ==========================================================
// UPDATE STATISTICS
// ==========================================================

function updateStats(products) {

    let total =
        0;


    products.forEach(
        function(product) {

            const stock =
                Number(product.stock);


            if (!Number.isNaN(stock)) {

                total += stock;

            }

        }
    );


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

    if (!productContainer) {

        console.error(
            "productContainer was not found."
        );

        return;

    }


    if (!inventoryTable) {

        console.error(
            "inventoryTable was not found."
        );

        return;

    }


    productContainer.innerHTML =
        "";

    inventoryTable.innerHTML =
        "";


    if (products.length === 0) {

        const message =
            document.createElement("p");

        message.textContent =
            "No products found.";

        message.style.textAlign =
            "center";

        productContainer.appendChild(
            message
        );


        const row =
            document.createElement("tr");


        const cell =
            document.createElement("td");

        cell.colSpan =
            5;

        cell.textContent =
            "No products found.";

        row.appendChild(
            cell
        );

        inventoryTable.appendChild(
            row
        );


        updateStats([]);

        return;

    }


    products.forEach(
        function(product) {

            createProduct(product);

            createTableRow(product);

        }
    );


    updateStats(products);

}


// ==========================================================
// SEARCH
// ==========================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const searchText =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const filtered =
                inventory.filter(
                    function(product) {

                        const name =
                            String(
                                product.name || ""
                            ).toLowerCase();


                        return name.includes(
                            searchText
                        );

                    }
                );


            displayProducts(
                filtered
            );

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
        savedMode === "enabled"
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
        function() {

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
// LOAD PROMOTION
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
                "No promotion found."
            );

            return;

        }


        const promotion =
            snapshot.data();


        console.log(
            "Promotion loaded:",
            promotion
        );


        if (
            promotion.active === true
        ) {

            displayPromotion(
                promotion
            );

        }

    }

    catch (error) {

        console.error(
            "Promotion error:",
            error
        );

    }

}


// ==========================================================
// DISPLAY PROMOTION
// ==========================================================

function displayPromotion(promotion) {

    let banner =
        document.getElementById(
            "promotionBanner"
        );


    if (!banner) {

        banner =
            document.createElement(
                "section"
            );

        banner.id =
            "promotionBanner";


        banner.style.margin =
            "30px auto";

        banner.style.maxWidth =
            "1000px";

        banner.style.padding =
            "30px";

        banner.style.borderRadius =
            "20px";

        banner.style.background =
            "#fff3e6";

        banner.style.textAlign =
            "center";

        banner.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.12)";


        const productsSection =
            document.getElementById(
                "products"
            );


        if (productsSection) {

            productsSection.parentNode.insertBefore(
                banner,
                productsSection
            );

        }

    }


    banner.innerHTML =
        "";


    const title =
        document.createElement("h2");

    title.textContent =
        "🎉 " +
        (
            promotion.name ||
            "Special Promotion"
        );


    const description =
        document.createElement("p");

    description.style.marginTop =
        "10px";

    description.textContent =
        "Bring a new customer to Grayson's Snack Shop!";


    const details =
        document.createElement("p");

    details.style.marginTop =
        "10px";


    details.textContent =
        "Buy " +
        (
            promotion.qualifyingProductName ||
            "a qualifying product"
        ) +
        " and the referrer can receive " +
        (
            promotion.rewardQuantity ||
            1
        ) +
        " x " +
        (
            promotion.rewardProductName ||
            "reward"
        ) +
        ".";


    banner.appendChild(
        title
    );

    banner.appendChild(
        description
    );

    banner.appendChild(
        details
    );

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


        console.log(
            "Inventory loaded:",
            inventory
        );


        displayProducts(
            inventory
        );


        await loadPromotion();


        console.log(
            "Grayson's Snack Shop loaded successfully!"
        );

    }

    catch (error) {

        console.error(
            "SHOP START ERROR:",
            error
        );


        if (productContainer) {

            productContainer.innerHTML =
                "";


            const errorMessage =
                document.createElement("p");

            errorMessage.textContent =
                "Unable to load the shop. Check the browser console for details.";

            errorMessage.style.textAlign =
                "center";

            productContainer.appendChild(
                errorMessage
            );

        }

    }

}


// ==========================================================
// START
// ==========================================================

startShop();
```
