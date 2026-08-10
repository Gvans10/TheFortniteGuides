/*
==========================================================
Grayson's Snack Shop
script.js
Main Website
Firebase Inventory + Promotions
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

const productContainer = document.getElementById("productContainer");
const inventoryTable = document.getElementById("inventoryTable");
const searchInput = document.getElementById("searchInput");
const totalProducts = document.getElementById("totalProducts");
const itemsInStock = document.getElementById("itemsInStock");
const darkButton = document.getElementById("darkModeButton");


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
            statusClass: "out-stock"
        };

    }

    if (stock <= 5) {

        return {
            text: "Low Stock",
            statusClass: "low-stock"
        };

    }

    return {
        text: "In Stock",
        statusClass: "in-stock"
    };
}


// ==========================================================
// CREATE PRODUCT CARD
// ==========================================================

function createProduct(product) {

    const status = getStatus(product);

    const card = document.createElement("div");

    card.className = "product-card";

    const image = product.image || "";
    const name = product.name || "Unnamed Product";
    const price = money(product.price);
    const stock = Number(product.stock) || 0;
    const restock = product.restock || "Not specified";

    card.innerHTML =
        '<div class="product-image">' +
            '<img ' +
                'src="' + image + '" ' +
                'alt="' + name + '" ' +
                'onerror="this.src=\'https://placehold.co/120x120?text=No+Image\'">' +
        '</div>' +

        '<div class="product-info">' +

            '<h3>' +
                name +
            '</h3>' +

            '<div class="product-price">' +
                price +
            '</div>' +

            '<div class="product-stock">' +
                'Available: ' + stock +
            '</div>' +

            '<span class="badge ' + status.statusClass + '">' +
                status.text +
            '</span>' +

            '<p style="margin-top:15px;">' +
                'Restock Date: ' +
                '<strong>' +
                    restock +
                '</strong>' +
            '</p>' +

        '</div>';

    productContainer.appendChild(card);
}


// ==========================================================
// CREATE INVENTORY TABLE ROW
// ==========================================================

function createTableRow(product) {

    const status = getStatus(product);

    const row = document.createElement("tr");

    const name = product.name || "Unnamed Product";
    const price = money(product.price);
    const stock = Number(product.stock) || 0;
    const restock = product.restock || "Not specified";

    row.innerHTML =
        '<td>' +
            name +
        '</td>' +

        '<td>' +
            price +
        '</td>' +

        '<td>' +
            stock +
        '</td>' +

        '<td>' +
            '<span class="badge ' + status.statusClass + '">' +
                status.text +
            '</span>' +
        '</td>' +

        '<td>' +
            restock +
        '</td>';

    inventoryTable.appendChild(row);
}


// ==========================================================
// UPDATE STATISTICS
// ==========================================================

function updateStats(products) {

    let total = 0;

    products.forEach(function(product) {

        const stock = Number(product.stock);

        if (!Number.isNaN(stock)) {
            total += stock;
        }

    });

    if (totalProducts) {
        totalProducts.textContent = products.length;
    }

    if (itemsInStock) {
        itemsInStock.textContent = total;
    }
}


// ==========================================================
// DISPLAY PRODUCTS
// ==========================================================

function displayProducts(products) {

    if (!productContainer || !inventoryTable) {

        console.error(
            "Product containers were not found in index.html."
        );

        return;
    }

    productContainer.innerHTML = "";
    inventoryTable.innerHTML = "";

    if (products.length === 0) {

        productContainer.innerHTML =
            '<p style="' +
                'text-align:center;' +
                'width:100%;' +
                'grid-column:1/-1;' +
            '">' +
                'No products found.' +
            '</p>';

        inventoryTable.innerHTML =
            '<tr>' +
                '<td colspan="5">' +
                    'No products found.' +
                '</td>' +
            '</tr>';

        updateStats([]);

        return;
    }

    products.forEach(function(product) {

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
        function() {

            const text =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const filtered =
                inventory.filter(function(product) {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();

                    return name.includes(text);

                });

            displayProducts(filtered);

        }
    );

}


// ==========================================================
// DARK MODE
// ==========================================================

function loadDarkMode() {

    const savedMode =
        localStorage.getItem("darkMode");

    if (
        savedMode === "enabled" &&
        document.body
    ) {

        document.body.classList.add("dark");

        if (darkButton) {
            darkButton.textContent = "☀️";
        }

    }

}


if (darkButton) {

    darkButton.addEventListener(
        "click",
        function() {

            document.body.classList.toggle("dark");

            const enabled =
                document.body.classList.contains("dark");

            if (enabled) {

                localStorage.setItem(
                    "darkMode",
                    "enabled"
                );

                darkButton.textContent = "☀️";

            } else {

                localStorage.setItem(
                    "darkMode",
                    "disabled"
                );

                darkButton.textContent = "🌙";

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

        displayPromotion(promotion);

    }

    catch (error) {

        console.error(
            "Error loading promotion:",
            error
        );

    }

}


// ==========================================================
// CHECK PROMOTION DATES
// ==========================================================

function promotionIsCurrentlyActive(promotion) {

    if (!promotion || promotion.active !== true) {
        return false;
    }

    const now = new Date();

    if (promotion.start) {

        const startDate =
            new Date(promotion.start);

        if (
            !Number.isNaN(startDate.getTime()) &&
            now < startDate
        ) {

            return false;

        }

    }

    if (promotion.end) {

        const endDate =
            new Date(promotion.end);

        if (
            !Number.isNaN(endDate.getTime()) &&
            now > endDate
        ) {

            return false;

        }

    }

    return true;
}


// ==========================================================
// DISPLAY PROMOTION
// ==========================================================

function displayPromotion(promotion) {

    if (!promotionIsCurrentlyActive(promotion)) {

        console.log(
            "Promotion exists but is not currently active."
        );

        return;

    }

    let promotionBox =
        document.getElementById(
            "promotionBanner"
        );

    if (!promotionBox) {

        promotionBox =
            document.createElement("section");

        promotionBox.id =
            "promotionBanner";

        promotionBox.style.cssText =
            "margin:30px auto;" +
            "max-width:1000px;" +
            "padding:30px;" +
            "border-radius:20px;" +
            "background:#fff3e6;" +
            "text-align:center;" +
            "box-shadow:0 5px 20px rgba(0,0,0,0.12);";

        const productsSection =
            document.getElementById(
                "products"
            );

        if (productsSection) {

            productsSection.parentNode.insertBefore(
                promotionBox,
                productsSection
            );

        } else {

            document.body.appendChild(
                promotionBox
            );

        }

    }

    const promotionName =
        promotion.name ||
        "Special Promotion";

    const qualifyingName =
        promotion.qualifyingProductName ||
        "a qualifying product";

    const rewardQuantity =
        promotion.rewardQuantity ||
        1;

    const rewardName =
        promotion.rewardProductName ||
        "reward";

    promotionBox.innerHTML =
        '<h2 style="margin-bottom:10px;">' +
            '🎉 ' +
            promotionName +
        '</h2>' +

        '<p style="margin-bottom:10px;">' +
            'Bring a new customer to ' +
            "Grayson's Snack Shop!" +
        '</p>' +

        '<p>' +
            'Buy: ' +
            '<strong>' +
                qualifyingName +
            '</strong>' +
            '<br>' +
            'The person who referred them receives: ' +
            '<strong>' +
                rewardQuantity +
                ' × ' +
                rewardName +
            '</strong>' +
        '</p>';

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

            productContainer.innerHTML =
                '<p style="' +
                    'text-align:center;' +
                    'width:100%;' +
                    'grid-column:1/-1;' +
                '">' +
                    'Unable to load the shop right now. ' +
                    'Please refresh the page.' +
                '</p>';

        }

    }

}


// ==========================================================
// START
// ==========================================================

startShop();
