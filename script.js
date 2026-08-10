/*
==========================================================
Grayson's Snack Shop
script.js
Main Website
Firebase Inventory + Live Promotions
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

            text:
                "Out of Stock",

            statusClass:
                "out-stock"

        };

    }


    if (
        stock <= 5
    ) {

        return {

            text:
                "Low Stock",

            statusClass:
                "low-stock"

        };

    }


    return {

        text:
            "In Stock",

        statusClass:
            "in-stock"

    };

}



// ==========================================================
// CREATE PRODUCT CARD
// ==========================================================

function createProduct(product) {

    const status =
        getStatus(
            product
        );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "product-card";


    const image =
        product.image ||
        "";


    const name =
        product.name ||
        "Unnamed Product";


    const price =
        money(
            product.price
        );


    const stock =
        Number(
            product.stock
        ) || 0;


    const restock =
        product.restock ||
        "Not specified";


    card.innerHTML = `

        <div class="product-image">

            <img
                src="${image}"
                alt="${name}"
                draggable="false"
                onerror="this.src='https://placehold.co/120x120?text=No+Image'"
            >

        </div>


        <div class="product-info">

            <h3>
                ${name}
            </h3>


            <div class="product-price">
                ${price}
            </div>


            <div class="product-stock">
                Available: ${stock}
            </div>


            <span class="badge ${status.statusClass}">
                ${status.text}
            </span>


            <p style="margin-top:15px;">

                Restock Date:

                <strong>
                    ${restock}
                </strong>

            </p>

        </div>

    `;


    productContainer.appendChild(
        card
    );

}



// ==========================================================
// INVENTORY TABLE
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


    const name =
        product.name ||
        "Unnamed Product";


    const price =
        money(
            product.price
        );


    const stock =
        Number(
            product.stock
        ) || 0;


    const restock =
        product.restock ||
        "Not specified";


    row.innerHTML = `

        <td>
            ${name}
        </td>

        <td>
            ${price}
        </td>

        <td>
            ${stock}
        </td>

        <td>

            <span class="badge ${status.statusClass}">
                ${status.text}
            </span>

        </td>

        <td>
            ${restock}
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

    let total =
        0;


    products.forEach(
        (product) => {

            const stock =
                Number(
                    product.stock
                );


            if (
                !Number.isNaN(stock)
            ) {

                total +=
                    stock;

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
            total;

    }

}



// ==========================================================
// DISPLAY PRODUCTS
// ==========================================================

function displayProducts(products) {

    if (
        !productContainer ||
        !inventoryTable
    ) {

        return;

    }


    productContainer.innerHTML =
        "";


    inventoryTable.innerHTML =
        "";


    if (
        products.length === 0
    ) {

        productContainer.innerHTML = `

            <p
                style="
                    text-align:center;
                    width:100%;
                    grid-column:1/-1;
                "
            >

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

            const text =

                searchInput
                    .value
                    .toLowerCase()
                    .trim();


            const filtered =

                inventory.filter(

                    (product) => {

                        const name =

                            String(
                                product.name ||
                                ""
                            )
                            .toLowerCase();


                        return (
                            name.includes(
                                text
                            )
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
        savedMode ===
        "enabled"
    ) {

        document.body.classList.add(
            "dark"
        );


        if (
            darkButton
        ) {

            darkButton.textContent =
                "☀️";

        }

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


            const enabled =

                document.body
                    .classList
                    .contains(
                        "dark"
                    );


            if (
                enabled
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



loadDarkMode();



// ==========================================================
// FORMAT PROMOTION DATE
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


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(

        undefined,

        {

            month:
                "short",

            day:
                "numeric",

            year:
                "numeric"

        }

    );

}



// ==========================================================
// HIDE PROMOTION
// ==========================================================

function hidePromotion() {

    if (
        promotionSection
    ) {

        promotionSection.classList.add(
            "hidden"
        );

    }


    if (
        referralSection
    ) {

        referralSection.classList.add(
            "hidden"
        );

    }

}



// ==========================================================
// DISPLAY PROMOTION
// ==========================================================

function displayPromotion(
    promotion
) {

    if (
        !promotion ||
        promotion.active !== true
    ) {

        hidePromotion();


        console.log(
            "Promotion turned off."
        );


        return;

    }


    const name =

        promotion.name ||
        "Current Promotion";


    const description =

        promotion.description ||
        "Refer a friend and earn a reward!";


    const qualifyingProduct =

        promotion.qualifyingProduct ||
        "Qualifying Product";


    const rewardProduct =

        promotion.rewardProduct ||
        "Reward";


    const rewardQuantity =

        Number(
            promotion.rewardQuantity
        ) || 1;



    promotionTitle.textContent =

        "🎉 " +
        name;



    promotionDescriptionText.textContent =

        description;



    promotionQualifyingProduct.textContent =

        qualifyingProduct;



    promotionReward.textContent =

        rewardQuantity +
        " × " +
        rewardProduct;



    const startText =

        formatPromotionDate(
            promotion.startDate
        );


    const endText =

        formatPromotionDate(
            promotion.endDate
        );


    if (
        startText &&
        endText
    ) {

        promotionDates.textContent =

            "Promotion dates: " +
            startText +
            " – " +
            endText;

    }

    else if (
        startText
    ) {

        promotionDates.textContent =

            "Starts: " +
            startText;

    }

    else if (
        endText
    ) {

        promotionDates.textContent =

            "Ends: " +
            endText;

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


    console.log(
        "Promotion is LIVE:",
        promotion
    );

}



// ==========================================================
// LIVE PROMOTION LISTENER
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
// START
// ==========================================================

async function startShop() {

    try {

        await loadInventory();


        displayProducts(
            inventory
        );


        startPromotionListener();


        console.log(
            "Grayson's Snack Shop Loaded From Firebase"
        );

    }

    catch (
        error
    ) {

        console.error(
            "Failed to start shop:",
            error
        );

    }

}



startShop();
