/*
==========================================================
Grayson's Snack Shop
script.js
Main Website
Inventory + Live Promotions
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
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



// ==========================================================
// ELEMENTS
// ==========================================================

const productContainer =
    document.getElementById(
        "productContainer"
    );

const inventoryTable =
    document.getElementById(
        "inventoryTable"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const totalProducts =
    document.getElementById(
        "totalProducts"
    );

const itemsInStock =
    document.getElementById(
        "itemsInStock"
    );

const darkButton =
    document.getElementById(
        "darkModeButton"
    );



// ==========================================================
// PROMOTION ELEMENTS
// ==========================================================

const promotionSection =
    document.getElementById(
        "promotionSection"
    );

const referralSection =
    document.getElementById(
        "referralSection"
    );

const rewardsNavLink =
    document.getElementById(
        "rewardsNavLink"
    );

const heroRewardsButton =
    document.getElementById(
        "heroRewardsButton"
    );

const promotionTitle =
    document.getElementById(
        "promotionTitle"
    );

const promotionDescriptionText =
    document.getElementById(
        "promotionDescriptionText"
    );

const promotionQualifyingProduct =
    document.getElementById(
        "promotionQualifyingProduct"
    );

const promotionReward =
    document.getElementById(
        "promotionReward"
    );

const promotionDates =
    document.getElementById(
        "promotionDates"
    );

const referralRewardSummary =
    document.getElementById(
        "referralRewardSummary"
    );

const referralQualifyingSummary =
    document.getElementById(
        "referralQualifyingSummary"
    );



// ==========================================================
// SAFE HTML
// ==========================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



// ==========================================================
// MONEY
// ==========================================================

function money(amount) {

    const number =
        Number(amount);

    if (
        Number.isNaN(number)
    ) {

        return "$0.00";

    }

    return (
        "$" +
        number.toFixed(2)
    );

}



// ==========================================================
// STOCK STATUS
// ==========================================================

function getStatus(product) {

    const stock =
        Number(
            product.stock
        );

    if (
        stock <= 0
    ) {

        return {
            text: "Out of Stock",
            statusClass: "out-stock"
        };

    }

    if (
        stock <= 5
    ) {

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
// PRODUCT CARD
// ==========================================================

function createProduct(product) {

    const status =
        getStatus(
            product
        );

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "product-card";


    const image =
        escapeHtml(
            product.image || ""
        );

    const name =
        escapeHtml(
            product.name ||
            "Unnamed Product"
        );

    const price =
        money(
            product.price
        );

    const stock =
        Number(
            product.stock
        ) || 0;

    const restock =
        escapeHtml(
            product.restock ||
            "Not specified"
        );


    card.innerHTML = `

        <div class="product-image">

            <img
                src="${image}"
                alt="${name}"
                draggable="false"
                onerror="this.src='https://placehold.co/160x160?text=No+Image'"
            >

        </div>

        <div class="product-info">

            <h3>
                ${name}
            </h3>

            <div class="product-price">
                ${price}
            </div>

            <div class="product-card-bottom">

                <span>
                    ${stock} available
                </span>

                <span class="badge ${status.statusClass}">
                    ${status.text}
                </span>

            </div>

            <div class="product-restock">

                Restock:
                <strong>
                    ${restock}
                </strong>

            </div>

        </div>

    `;


    productContainer.appendChild(
        card
    );

}



// ==========================================================
// TABLE ROW
// ==========================================================

function createTableRow(product) {

    const status =
        getStatus(
            product
        );

    const row =
        document.createElement(
            "tr"
        );

    row.innerHTML = `

        <td>
            ${escapeHtml(product.name || "Unnamed Product")}
        </td>

        <td>
            ${money(product.price)}
        </td>

        <td>
            ${Number(product.stock) || 0}
        </td>

        <td>

            <span class="badge ${status.statusClass}">
                ${status.text}
            </span>

        </td>

        <td>
            ${escapeHtml(product.restock || "Not specified")}
        </td>

    `;

    inventoryTable.appendChild(
        row
    );

}



// ==========================================================
// STATS
// ==========================================================

function updateStats(products) {

    let stockTotal =
        0;

    products.forEach(
        (product) => {

            const amount =
                Number(
                    product.stock
                );

            if (
                !Number.isNaN(amount)
            ) {

                stockTotal +=
                    amount;

            }

        }
    );


    if (
        totalProducts
    ) {

        totalProducts.textContent =
            products.length;

    }


    if (
        itemsInStock
    ) {

        itemsInStock.textContent =
            stockTotal;

    }

}



// ==========================================================
// DISPLAY INVENTORY
// ==========================================================

function displayProducts(products) {

    productContainer.innerHTML =
        "";

    inventoryTable.innerHTML =
        "";


    if (
        products.length === 0
    ) {

        productContainer.innerHTML = `

            <div class="empty-state">

                No matching products found.

            </div>

        `;

        inventoryTable.innerHTML = `

            <tr>

                <td colspan="5">

                    No matching products found.

                </td>

            </tr>

        `;

        updateStats(
            []
        );

        return;

    }


    products.forEach(
        (product) => {

            createProduct(
                product
            );

            createTableRow(
                product
            );

        }
    );


    updateStats(
        products
    );

}



// ==========================================================
// SEARCH
// ==========================================================

if (
    searchInput
) {

    searchInput.addEventListener(

        "input",

        () => {

            const query =
                searchInput
                    .value
                    .trim()
                    .toLowerCase();


            const results =
                inventory.filter(
                    (product) => {

                        return String(
                            product.name ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                query
                            );

                    }
                );


            displayProducts(
                results
            );

        }

    );

}



// ==========================================================
// DARK MODE
// ==========================================================

function loadDarkMode() {

    const saved =
        localStorage.getItem(
            "darkMode"
        );

    if (
        saved === "enabled"
    ) {

        document.body.classList.add(
            "dark"
        );

        darkButton.textContent =
            "☀️";

    }

}



if (
    darkButton
) {

    darkButton.addEventListener(

        "click",

        () => {

            document.body.classList.toggle(
                "dark"
            );

            const dark =
                document.body
                    .classList
                    .contains(
                        "dark"
                    );

            localStorage.setItem(
                "darkMode",
                dark
                    ? "enabled"
                    : "disabled"
            );

            darkButton.textContent =
                dark
                    ? "☀️"
                    : "🌙";

        }

    );

}


loadDarkMode();



// ==========================================================
// PROMOTION DATE
// ==========================================================

function formatPromotionDate(
    dateString
) {

    if (
        !dateString
    ) {

        return "";

    }


    const parts =
        dateString.split(
            "-"
        );

    if (
        parts.length !== 3
    ) {

        return dateString;

    }


    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}



// ==========================================================
// HIDE PROMOTION
// ==========================================================

function hidePromotion() {

    promotionSection.classList.add(
        "hidden"
    );

    referralSection.classList.add(
        "hidden"
    );

    rewardsNavLink.classList.add(
        "hidden"
    );

    heroRewardsButton.classList.add(
        "hidden"
    );

}



// ==========================================================
// SHOW PROMOTION
// ==========================================================

function displayPromotion(
    promotion
) {

    if (
        !promotion ||
        promotion.active !== true
    ) {

        hidePromotion();

        return;

    }


    const name =
        promotion.name ||
        "Referral Promotion";

    const description =
        promotion.description ||
        "Refer a friend and earn a reward.";

    const qualifyingProduct =
        promotion.qualifyingProduct ||
        "Qualifying product";

    const rewardProduct =
        promotion.rewardProduct ||
        "Reward";

    const rewardQuantity =
        Number(
            promotion.rewardQuantity
        ) || 1;


    promotionTitle.textContent =
        name;

    promotionDescriptionText.textContent =
        description;

    promotionQualifyingProduct.textContent =
        qualifyingProduct;

    promotionReward.textContent =
        `${rewardQuantity} × ${rewardProduct}`;


    referralRewardSummary.textContent =
        `${rewardQuantity} × ${rewardProduct}`;

    referralQualifyingSummary.textContent =
        qualifyingProduct;


    const start =
        formatPromotionDate(
            promotion.startDate
        );

    const end =
        formatPromotionDate(
            promotion.endDate
        );


    if (
        start &&
        end
    ) {

        promotionDates.textContent =
            `${start} – ${end}`;

    }

    else if (
        end
    ) {

        promotionDates.textContent =
            `Ends ${end}`;

    }

    else {

        promotionDates.textContent =
            "";

    }


    promotionSection.classList.remove(
        "hidden"
    );

    referralSection.classList.remove(
        "hidden"
    );

    rewardsNavLink.classList.remove(
        "hidden"
    );

    heroRewardsButton.classList.remove(
        "hidden"
    );

}



// ==========================================================
// LIVE PROMOTION
// ==========================================================

function startPromotionListener() {

    const promotionRef =
        doc(
            db,
            "promotions",
            "first-week-takis"
        );


    onSnapshot(

        promotionRef,

        (snapshot) => {

            if (
                !snapshot.exists()
            ) {

                hidePromotion();

                return;

            }


            displayPromotion(
                snapshot.data()
            );

        },

        (error) => {

            console.error(
                "Promotion listener error:",
                error
            );

            hidePromotion();

        }

    );

}



// ==========================================================
// START SITE
// ==========================================================

async function startShop() {

    try {

        await loadInventory();

        displayProducts(
            inventory
        );

        startPromotionListener();


        console.log(
            "Grayson's Snack Shop loaded."
        );

    }

    catch (
        error
    ) {

        console.error(
            "Shop loading error:",
            error
        );

    }

}


startShop();
