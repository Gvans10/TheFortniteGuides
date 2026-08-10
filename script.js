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


const qualifyingProductBox =
    document.getElementById(
        "qualifyingProductBox"
    );


const rewardProductBox =
    document.getElementById(
        "rewardProductBox"
    );



// ==========================================================
// MONEY FORMAT
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
// CREATE INVENTORY TABLE ROW
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
// UPDATE STATS
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

        console.error(
            "Product containers were not found in index.html."
        );

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
        savedMode === "enabled"
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


    const year =
        Number(
            parts[0]
        );


    const month =
        Number(
            parts[1]
        ) - 1;


    const day =
        Number(
            parts[2]
        );


    const date =
        new Date(
            year,
            month,
            day
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

}



// ==========================================================
// DISPLAY PROMOTION
// ==========================================================

function displayPromotion(
    promotion
) {

    if (
        !promotionSection
    ) {

        console.error(
            "Promotion section was not found."
        );

        return;

    }


    /*
    ========================================================
    THE ADMIN ACTIVE SWITCH IS THE MASTER SWITCH.

    Dates are informational only.
    ========================================================
    */

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
        "Check out our current special offer!";



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



    qualifyingProductBox.classList.remove(
        "hidden"
    );


    rewardProductBox.classList.remove(
        "hidden"
    );



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


                console.log(
                    "No promotion saved."
                );


                return;

            }


            const promotion =
                snapshot.data();


            console.log(
                "Promotion Firestore data:",
                promotion
            );


            displayPromotion(
                promotion
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


        startPromotionListener();


        console.log(
            "Grayson's Snack Shop Loaded From Firebase"
        );

    }

    catch (
        error
    ) {

        console.error(
            "Failed to start Grayson's Snack Shop:",
            error
        );


        if (
            productContainer
        ) {

            productContainer.innerHTML = `

                <p
                    style="
                        text-align:center;
                        width:100%;
                        grid-column:1/-1;
                    "
                >

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
