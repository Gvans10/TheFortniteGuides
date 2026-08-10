/*
==========================================================
Grayson's Snack Shop
admin.js
Firebase Admin Dashboard
Inventory + Promotions + Referral Management
==========================================================
*/


import { db } from "./firebase.js";

import {

    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    runTransaction

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



// ==========================================================
// ADMIN LOGIN
// ==========================================================

const ADMIN_USERNAME =
    "60340276";

const ADMIN_PASSWORD =
    "5527GSS02";



// ==========================================================
// FIRESTORE REFERENCES
// ==========================================================

const inventoryRef =
    collection(
        db,
        "inventory"
    );


const referralsRef =
    collection(
        db,
        "referrals"
    );


const referralUsesRef =
    collection(
        db,
        "referralUses"
    );


const promotionRef =
    doc(
        db,
        "promotions",
        "first-week-takis"
    );



// ==========================================================
// DATA
// ==========================================================

let inventory = [];

let referrals = [];

let referralUses = [];


let unsubscribeInventory =
    null;

let unsubscribeReferrals =
    null;

let unsubscribeReferralUses =
    null;

let unsubscribePromotion =
    null;



// ==========================================================
// LOGIN ELEMENTS
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


const usernameInput =
    document.getElementById(
        "username"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const logoutButton =
    document.getElementById(
        "logout"
    );



// ==========================================================
// TAB ELEMENTS
// ==========================================================

const inventoryTabButton =
    document.getElementById(
        "inventoryTabButton"
    );


const promotionsTabButton =
    document.getElementById(
        "promotionsTabButton"
    );


const inventoryTab =
    document.getElementById(
        "inventoryTab"
    );


const promotionsTab =
    document.getElementById(
        "promotionsTab"
    );



// ==========================================================
// INVENTORY ELEMENTS
// ==========================================================

const adminProducts =
    document.getElementById(
        "adminProducts"
    );


const addButton =
    document.getElementById(
        "addProduct"
    );


const inventoryProductNames =
    document.getElementById(
        "inventoryProductNames"
    );



// ==========================================================
// PROMOTION ELEMENTS
// ==========================================================

const promotionActive =
    document.getElementById(
        "promotionActive"
    );


const promotionName =
    document.getElementById(
        "promotionName"
    );


const promotionStart =
    document.getElementById(
        "promotionStart"
    );


const promotionEnd =
    document.getElementById(
        "promotionEnd"
    );


const promotionQualifyingProduct =
    document.getElementById(
        "promotionQualifyingProduct"
    );


const promotionRewardProduct =
    document.getElementById(
        "promotionRewardProduct"
    );


const promotionRewardQuantity =
    document.getElementById(
        "promotionRewardQuantity"
    );


const promotionDescription =
    document.getElementById(
        "promotionDescription"
    );


const savePromotionButton =
    document.getElementById(
        "savePromotion"
    );


const promotionMessage =
    document.getElementById(
        "promotionMessage"
    );



// ==========================================================
// REFERRAL ELEMENTS
// ==========================================================

const referralRequests =
    document.getElementById(
        "referralRequests"
    );


const referralCodes =
    document.getElementById(
        "referralCodes"
    );


const pendingReferralCount =
    document.getElementById(
        "pendingReferralCount"
    );


const approvedReferralCount =
    document.getElementById(
        "approvedReferralCount"
    );


const outstandingRewardCount =
    document.getElementById(
        "outstandingRewardCount"
    );


const totalReferralCodes =
    document.getElementById(
        "totalReferralCodes"
    );



// ==========================================================
// HELPERS
// ==========================================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}



function formatDate(value) {

    if (!value) {

        return "Not set";

    }


    let date;


    if (
        typeof value === "object" &&
        typeof value.toDate === "function"
    ) {

        date =
            value.toDate();

    }

    else {

        date =
            new Date(value);

    }


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleString();

}



function showPromotionMessage(
    message,
    success = true
) {

    promotionMessage.textContent =
        message;


    promotionMessage.style.color =
        success
            ? "green"
            : "red";

}



// ==========================================================
// LOGIN
// ==========================================================

function login() {

    const username =
        usernameInput.value.trim();


    const password =
        passwordInput.value.trim();


    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        loginMessage.textContent =
            "";


        loginBox.classList.add(
            "hidden"
        );


        dashboard.classList.remove(
            "hidden"
        );


        startFirebaseListeners();

    }

    else {

        loginMessage.textContent =
            "Incorrect username or password";

    }

}



loginButton.addEventListener(
    "click",
    login
);


usernameInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            login();

        }

    }
);


passwordInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            login();

        }

    }
);



// ==========================================================
// TABS
// ==========================================================

function openInventoryTab() {

    inventoryTab.classList.remove(
        "hidden"
    );


    promotionsTab.classList.add(
        "hidden"
    );


    inventoryTabButton.classList.add(
        "active"
    );


    promotionsTabButton.classList.remove(
        "active"
    );

}



function openPromotionsTab() {

    promotionsTab.classList.remove(
        "hidden"
    );


    inventoryTab.classList.add(
        "hidden"
    );


    promotionsTabButton.classList.add(
        "active"
    );


    inventoryTabButton.classList.remove(
        "active"
    );

}



inventoryTabButton.addEventListener(
    "click",
    openInventoryTab
);


promotionsTabButton.addEventListener(
    "click",
    openPromotionsTab
);



// ==========================================================
// START FIREBASE LISTENERS
// ==========================================================

function startFirebaseListeners() {

    startInventoryListener();

    startPromotionListener();

    startReferralUsesListener();

    startReferralsListener();

}



// ==========================================================
// INVENTORY LISTENER
// ==========================================================

function startInventoryListener() {

    if (
        unsubscribeInventory
    ) {

        unsubscribeInventory();

    }


    unsubscribeInventory =
        onSnapshot(

            inventoryRef,

            (snapshot) => {

                inventory =
                    [];


                snapshot.forEach(
                    (item) => {

                        inventory.push({

                            firestoreId:
                                item.id,

                            ...item.data()

                        });

                    }
                );


                inventory.sort(
                    (a, b) =>

                        String(
                            a.name || ""
                        ).localeCompare(

                            String(
                                b.name || ""
                            )

                        )
                );


                loadAdminProducts();

                loadProductDatalist();

            },

            (error) => {

                console.error(
                    "Inventory listener error:",
                    error
                );


                adminProducts.innerHTML =
                    "<p>Unable to load inventory.</p>";

            }

        );

}



// ==========================================================
// PRODUCT DATALIST
// ==========================================================

function loadProductDatalist() {

    inventoryProductNames.innerHTML =
        "";


    inventory.forEach(
        (product) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                product.name || "";


            inventoryProductNames.appendChild(
                option
            );

        }
    );

}



// ==========================================================
// DISPLAY INVENTORY
// ==========================================================

function loadAdminProducts() {

    adminProducts.innerHTML =
        "";


    if (
        inventory.length === 0
    ) {

        adminProducts.innerHTML =
            "<p>No products are currently in Firestore.</p>";

        return;

    }


    inventory.forEach(
        (product) => {

            createAdminProduct(
                product
            );

        }
    );

}



// ==========================================================
// CREATE PRODUCT EDITOR
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


    const safeName =
        escapeHtml(
            product.name ||
            "Unnamed Product"
        );


    const safeImage =
        escapeHtml(
            product.image ||
            ""
        );


    const safeRestock =
        escapeHtml(
            product.restock ||
            ""
        );


    box.innerHTML = `

        <div class="product-image">

            <img
                src="${safeImage}"
                alt="${safeName}"
                onerror="this.src='https://placehold.co/100x100?text=No+Image'"
            >

        </div>


        <h3>
            ${safeName}
        </h3>


        <label>
            Product Name
        </label>

        <input
            class="admin-name-input"
            value="${safeName}"
        >


        <label>
            Image Filename
        </label>

        <input
            class="admin-image-input"
            value="${safeImage}"
        >


        <label>
            Price
        </label>

        <input
            class="admin-price-input"
            value="${Number(product.price || 0)}"
            type="number"
            min="0"
            step="0.01"
        >


        <label>
            Stock
        </label>

        <input
            class="admin-stock-input"
            value="${Number(product.stock || 0)}"
            type="number"
            min="0"
            step="1"
        >


        <label>
            Restock Date
        </label>

        <input
            class="admin-restock-input"
            value="${safeRestock}"
        >

    `;


    const buttonRow =
        document.createElement(
            "div"
        );


    buttonRow.className =
        "admin-button-row";


    const saveButton =
        document.createElement(
            "button"
        );


    saveButton.textContent =
        "Save";


    saveButton.addEventListener(
        "click",
        () => {

            saveProduct(
                product,
                box
            );

        }
    );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.textContent =
        "Delete";


    deleteButton.className =
        "danger-button";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteProduct(
                product
            );

        }
    );


    buttonRow.appendChild(
        saveButton
    );


    buttonRow.appendChild(
        deleteButton
    );


    box.appendChild(
        buttonRow
    );


    adminProducts.appendChild(
        box
    );

}



// ==========================================================
// SAVE PRODUCT
// ==========================================================

async function saveProduct(
    product,
    box
) {

    const name =
        box
            .querySelector(
                ".admin-name-input"
            )
            .value
            .trim();


    const image =
        box
            .querySelector(
                ".admin-image-input"
            )
            .value
            .trim();


    const price =
        Number(

            box
                .querySelector(
                    ".admin-price-input"
                )
                .value

        );


    const stock =
        Number(

            box
                .querySelector(
                    ".admin-stock-input"
                )
                .value

        );


    const restock =
        box
            .querySelector(
                ".admin-restock-input"
            )
            .value
            .trim();


    if (!name) {

        alert(
            "Product name cannot be empty."
        );

        return;

    }


    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        alert(
            "Enter a valid price."
        );

        return;

    }


    if (
        Number.isNaN(stock) ||
        stock < 0
    ) {

        alert(
            "Enter a valid stock amount."
        );

        return;

    }


    try {

        await updateDoc(

            doc(
                db,
                "inventory",
                product.firestoreId
            ),

            {

                name,
                image,
                price,
                stock,
                restock

            }

        );


        alert(
            "Product Updated!"
        );

    }

    catch (error) {

        console.error(
            "Product update error:",
            error
        );


        alert(
            "There was an error updating the product."
        );

    }

}



// ==========================================================
// DELETE PRODUCT
// ==========================================================

async function deleteProduct(
    product
) {

    const confirmed =
        confirm(

            `Delete "${product.name}"?`

        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteDoc(

            doc(
                db,
                "inventory",
                product.firestoreId
            )

        );

    }

    catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        alert(
            "There was an error deleting the product."
        );

    }

}



// ==========================================================
// ADD PRODUCT
// ==========================================================

addButton.addEventListener(
    "click",
    addNewProduct
);



async function addNewProduct() {

    const name =
        document
            .getElementById(
                "newName"
            )
            .value
            .trim();


    const priceValue =
        document
            .getElementById(
                "newPrice"
            )
            .value;


    const stockValue =
        document
            .getElementById(
                "newStock"
            )
            .value;


    const restock =
        document
            .getElementById(
                "newRestock"
            )
            .value
            .trim();


    const image =
        document
            .getElementById(
                "newImage"
            )
            .value
            .trim();


    if (!name) {

        alert(
            "Enter a product name."
        );

        return;

    }


    if (
        priceValue === ""
    ) {

        alert(
            "Enter a price."
        );

        return;

    }


    if (
        stockValue === ""
    ) {

        alert(
            "Enter a stock amount."
        );

        return;

    }


    const price =
        Number(priceValue);


    const stock =
        Number(stockValue);


    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        alert(
            "Enter a valid price."
        );

        return;

    }


    if (
        Number.isNaN(stock) ||
        stock < 0
    ) {

        alert(
            "Enter a valid stock amount."
        );

        return;

    }


    const productId =
        Date.now().toString();


    const newProduct = {

        id:
            Number(
                productId
            ),

        name,

        price,

        stock,

        restock,

        image

    };


    try {

        await setDoc(

            doc(
                db,
                "inventory",
                productId
            ),

            newProduct

        );


        clearAddProductForm();


        alert(
            "Product Added!"
        );

    }

    catch (error) {

        console.error(
            "Add product error:",
            error
        );


        alert(
            "There was an error adding the product."
        );

    }

}



// ==========================================================
// CLEAR ADD PRODUCT FORM
// ==========================================================

function clearAddProductForm() {

    document.getElementById(
        "newName"
    ).value =
        "";


    document.getElementById(
        "newPrice"
    ).value =
        "";


    document.getElementById(
        "newStock"
    ).value =
        "";


    document.getElementById(
        "newRestock"
    ).value =
        "";


    document.getElementById(
        "newImage"
    ).value =
        "";

}



// ==========================================================
// PROMOTION LISTENER
// ==========================================================

function startPromotionListener() {

    if (
        unsubscribePromotion
    ) {

        unsubscribePromotion();

    }


    unsubscribePromotion =
        onSnapshot(

            promotionRef,

            (snapshot) => {

                if (
                    !snapshot.exists()
                ) {

                    loadDefaultPromotion();

                    return;

                }


                const promotion =
                    snapshot.data();


                promotionActive.checked =
                    promotion.active === true;


                promotionName.value =
                    promotion.name ||
                    "Bring a Friend";


                promotionStart.value =
                    promotion.startDate ||
                    "";


                promotionEnd.value =
                    promotion.endDate ||
                    "";


                promotionQualifyingProduct.value =
                    promotion.qualifyingProduct ||
                    "";


                promotionRewardProduct.value =
                    promotion.rewardProduct ||
                    "";


                promotionRewardQuantity.value =
                    Number(
                        promotion.rewardQuantity ||
                        1
                    );


                promotionDescription.value =
                    promotion.description ||
                    "";

            },

            (error) => {

                console.error(
                    "Promotion listener error:",
                    error
                );


                showPromotionMessage(
                    "Unable to load promotion.",
                    false
                );

            }

        );

}



// ==========================================================
// DEFAULT PROMOTION
// ==========================================================

function loadDefaultPromotion() {

    promotionActive.checked =
        false;


    promotionName.value =
        "Bring a Friend";


    promotionStart.value =
        "";


    promotionEnd.value =
        "";


    promotionQualifyingProduct.value =
        "";


    promotionRewardProduct.value =
        "";


    promotionRewardQuantity.value =
        1;


    promotionDescription.value =
        "Refer a friend and earn a reward after their qualifying purchase is approved.";

}



// ==========================================================
// SAVE PROMOTION
// ==========================================================

savePromotionButton.addEventListener(
    "click",
    savePromotion
);



async function savePromotion() {

    const quantity =
        Number(
            promotionRewardQuantity.value
        );


    if (
        !promotionName.value.trim()
    ) {

        showPromotionMessage(
            "Enter a promotion name.",
            false
        );

        return;

    }


    if (
        Number.isNaN(quantity) ||
        quantity < 1
    ) {

        showPromotionMessage(
            "Reward quantity must be at least 1.",
            false
        );

        return;

    }


    savePromotionButton.disabled =
        true;


    savePromotionButton.textContent =
        "Saving...";


    try {

        await setDoc(

            promotionRef,

            {

                id:
                    "first-week-takis",

                name:
                    promotionName.value.trim(),

                active:
                    promotionActive.checked,

                startDate:
                    promotionStart.value,

                endDate:
                    promotionEnd.value,

                qualifyingProduct:
                    promotionQualifyingProduct.value.trim(),

                rewardProduct:
                    promotionRewardProduct.value.trim(),

                rewardQuantity:
                    quantity,

                description:
                    promotionDescription.value.trim(),

                updatedAt:
                    new Date().toISOString()

            },

            {
                merge: true
            }

        );


        showPromotionMessage(
            "Promotion saved!",
            true
        );

    }

    catch (error) {

        console.error(
            "Save promotion error:",
            error
        );


        showPromotionMessage(
            "Unable to save promotion.",
            false
        );

    }

    finally {

        savePromotionButton.disabled =
            false;


        savePromotionButton.textContent =
            "Save Promotion";

    }

}



// ==========================================================
// REFERRAL USES LISTENER
// ==========================================================

function startReferralUsesListener() {

    if (
        unsubscribeReferralUses
    ) {

        unsubscribeReferralUses();

    }


    unsubscribeReferralUses =
        onSnapshot(

            referralUsesRef,

            (snapshot) => {

                referralUses =
                    [];


                snapshot.forEach(
                    (item) => {

                        referralUses.push({

                            firestoreId:
                                item.id,

                            ...item.data()

                        });

                    }
                );


                referralUses.sort(
                    (a, b) => {

                        return new Date(
                            b.createdAt || 0
                        ) -
                        new Date(
                            a.createdAt || 0
                        );

                    }
                );


                renderReferralUses();

                updateReferralStats();

            },

            (error) => {

                console.error(
                    "Referral uses listener error:",
                    error
                );


                referralRequests.innerHTML =
                    "<p>Unable to load referral requests.</p>";

            }

        );

}



// ==========================================================
// REFERRALS LISTENER
// ==========================================================

function startReferralsListener() {

    if (
        unsubscribeReferrals
    ) {

        unsubscribeReferrals();

    }


    unsubscribeReferrals =
        onSnapshot(

            referralsRef,

            (snapshot) => {

                referrals =
                    [];


                snapshot.forEach(
                    (item) => {

                        referrals.push({

                            firestoreId:
                                item.id,

                            ...item.data()

                        });

                    }
                );


                referrals.sort(
                    (a, b) => {

                        return Number(
                            b.successfulReferrals || 0
                        ) -
                        Number(
                            a.successfulReferrals || 0
                        );

                    }
                );


                renderReferralCodes();

                updateReferralStats();

            },

            (error) => {

                console.error(
                    "Referral codes listener error:",
                    error
                );


                referralCodes.innerHTML =
                    "<p>Unable to load referral codes.</p>";

            }

        );

}



// ==========================================================
// REFERRAL STATS
// ==========================================================

function updateReferralStats() {

    const pending =
        referralUses.filter(
            (use) =>

                use.status ===
                "pending"
        ).length;


    const approved =
        referralUses.filter(
            (use) =>

                use.status ===
                "approved"
        ).length;


    const outstanding =
        referralUses.filter(
            (use) =>

                use.status ===
                    "approved" &&

                use.rewardStatus !==
                    "rewarded"
        ).length;


    pendingReferralCount.textContent =
        pending;


    approvedReferralCount.textContent =
        approved;


    outstandingRewardCount.textContent =
        outstanding;


    totalReferralCodes.textContent =
        referrals.length;

}



// ==========================================================
// RENDER REFERRAL USES
// ==========================================================

function renderReferralUses() {

    referralRequests.innerHTML =
        "";


    if (
        referralUses.length === 0
    ) {

        referralRequests.innerHTML =
            "<p>No referral purchases have been submitted yet.</p>";

        return;

    }


    referralUses.forEach(
        (use) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "referral-request";


            const status =
                use.status ||
                "pending";


            const rewardStatus =
                use.rewardStatus ||
                "none";


            let statusClass =
                "status-pending";


            if (
                status === "approved"
            ) {

                statusClass =
                    "status-approved";

            }


            if (
                status === "rejected"
            ) {

                statusClass =
                    "status-rejected";

            }


            const safeName =
                escapeHtml(
                    use.referrerName ||
                    "Unknown"
                );


            const safeCode =
                escapeHtml(
                    use.referralCode ||
                    "Unknown"
                );


            card.innerHTML = `

                <div class="referral-request-top">

                    <div>

                        <strong>
                            ${safeName}
                        </strong>

                        <div>
                            Code:
                            <strong>
                                ${safeCode}
                            </strong>
                        </div>

                    </div>


                    <span class="admin-status ${statusClass}">
                        ${escapeHtml(status.toUpperCase())}
                    </span>

                </div>


                <p>
                    <strong>
                        Submitted:
                    </strong>

                    ${escapeHtml(formatDate(use.createdAt))}
                </p>


                <p>
                    <strong>
                        Approved:
                    </strong>

                    ${escapeHtml(formatDate(use.approvedAt))}
                </p>


                <p>
                    <strong>
                        Reward:
                    </strong>

                    ${escapeHtml(rewardStatus)}
                </p>

            `;


            const buttonRow =
                document.createElement(
                    "div"
                );


            buttonRow.className =
                "admin-button-row";


            if (
                status === "pending"
            ) {

                const approveButton =
                    document.createElement(
                        "button"
                    );


                approveButton.textContent =
                    "Approve Purchase";


                approveButton.className =
                    "approve-button";


                approveButton.addEventListener(
                    "click",
                    () => {

                        approveReferralUse(
                            use
                        );

                    }
                );


                const rejectButton =
                    document.createElement(
                        "button"
                    );


                rejectButton.textContent =
                    "Reject";


                rejectButton.className =
                    "reject-button";


                rejectButton.addEventListener(
                    "click",
                    () => {

                        rejectReferralUse(
                            use
                        );

                    }
                );


                buttonRow.appendChild(
                    approveButton
                );


                buttonRow.appendChild(
                    rejectButton
                );

            }


            if (
                status === "approved" &&
                rewardStatus !== "rewarded"
            ) {

                const rewardButton =
                    document.createElement(
                        "button"
                    );


                rewardButton.textContent =
                    "Mark Reward Given";


                rewardButton.className =
                    "reward-button";


                rewardButton.addEventListener(
                    "click",
                    () => {

                        markRewardGiven(
                            use
                        );

                    }
                );


                buttonRow.appendChild(
                    rewardButton
                );

            }


            if (
                status === "approved" &&
                rewardStatus === "rewarded"
            ) {

                const badge =
                    document.createElement(
                        "span"
                    );


                badge.className =
                    "admin-status status-rewarded";


                badge.textContent =
                    "✓ Reward Given";


                buttonRow.appendChild(
                    badge
                );

            }


            if (
                status === "rejected"
            ) {

                const reopenButton =
                    document.createElement(
                        "button"
                    );


                reopenButton.textContent =
                    "Return To Pending";


                reopenButton.className =
                    "secondary-button";


                reopenButton.addEventListener(
                    "click",
                    () => {

                        reopenReferralUse(
                            use
                        );

                    }
                );


                buttonRow.appendChild(
                    reopenButton
                );

            }


            card.appendChild(
                buttonRow
            );


            referralRequests.appendChild(
                card
            );

        }
    );

}



// ==========================================================
// APPROVE REFERRAL
// ==========================================================

async function approveReferralUse(
    use
) {

    const confirmed =
        confirm(

            `Approve this referral for ${use.referrerName || "this customer"}?`

        );


    if (!confirmed) {

        return;

    }


    try {

        await runTransaction(

            db,

            async (
                transaction
            ) => {

                const useRef =
                    doc(
                        db,
                        "referralUses",
                        use.firestoreId
                    );


                const useSnapshot =
                    await transaction.get(
                        useRef
                    );


                if (
                    !useSnapshot.exists()
                ) {

                    throw new Error(
                        "Referral use no longer exists."
                    );

                }


                const latestUse =
                    useSnapshot.data();


                if (
                    latestUse.status !==
                    "pending"
                ) {

                    throw new Error(
                        "This referral has already been reviewed."
                    );

                }


                const code =
                    latestUse.referralCode;


                const referralRef =
                    doc(
                        db,
                        "referrals",
                        code
                    );


                const referralSnapshot =
                    await transaction.get(
                        referralRef
                    );


                if (
                    !referralSnapshot.exists()
                ) {

                    throw new Error(
                        "The referral code no longer exists."
                    );

                }


                const referralData =
                    referralSnapshot.data();


                const successfulReferrals =
                    Number(
                        referralData.successfulReferrals ||
                        0
                    );


                const rewardsEarned =
                    Number(
                        referralData.rewardsEarned ||
                        0
                    );


                transaction.update(

                    useRef,

                    {

                        status:
                            "approved",

                        rewardStatus:
                            "earned",

                        approvedAt:
                            new Date().toISOString(),

                        rewardedAt:
                            null

                    }

                );


                transaction.update(

                    referralRef,

                    {

                        successfulReferrals:
                            successfulReferrals +
                            1,

                        rewardsEarned:
                            rewardsEarned +
                            1

                    }

                );

            }

        );


        alert(
            "Referral approved. Reward has been earned."
        );

    }

    catch (error) {

        console.error(
            "Approve referral error:",
            error
        );


        alert(
            error.message ||
            "Unable to approve referral."
        );

    }

}



// ==========================================================
// REJECT REFERRAL
// ==========================================================

async function rejectReferralUse(
    use
) {

    const confirmed =
        confirm(
            "Reject this referral purchase?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await updateDoc(

            doc(
                db,
                "referralUses",
                use.firestoreId
            ),

            {

                status:
                    "rejected",

                rewardStatus:
                    "none",

                approvedAt:
                    null,

                rewardedAt:
                    null

            }

        );

    }

    catch (error) {

        console.error(
            "Reject referral error:",
            error
        );


        alert(
            "Unable to reject referral."
        );

    }

}



// ==========================================================
// REOPEN REJECTED REFERRAL
// ==========================================================

async function reopenReferralUse(
    use
) {

    try {

        await updateDoc(

            doc(
                db,
                "referralUses",
                use.firestoreId
            ),

            {

                status:
                    "pending",

                rewardStatus:
                    "none",

                approvedAt:
                    null,

                rewardedAt:
                    null

            }

        );

    }

    catch (error) {

        console.error(
            "Reopen referral error:",
            error
        );


        alert(
            "Unable to return referral to pending."
        );

    }

}



// ==========================================================
// MARK REWARD GIVEN
// ==========================================================

async function markRewardGiven(
    use
) {

    if (
        use.status !== "approved"
    ) {

        alert(
            "Approve the referral before giving the reward."
        );

        return;

    }


    const confirmed =
        confirm(
            "Mark this reward as given?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await updateDoc(

            doc(
                db,
                "referralUses",
                use.firestoreId
            ),

            {

                rewardStatus:
                    "rewarded",

                rewardedAt:
                    new Date().toISOString()

            }

        );

    }

    catch (error) {

        console.error(
            "Reward update error:",
            error
        );


        alert(
            "Unable to mark reward as given."
        );

    }

}



// ==========================================================
// RENDER REFERRAL CODES
// ==========================================================

function renderReferralCodes() {

    referralCodes.innerHTML =
        "";


    if (
        referrals.length === 0
    ) {

        referralCodes.innerHTML =
            "<p>No referral codes have been created yet.</p>";

        return;

    }


    referrals.forEach(
        (referral) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "referral-code-card";


            const active =
                referral.active === true;


            const safeCode =
                escapeHtml(
                    referral.code ||
                    referral.firestoreId
                );


            const safeName =
                escapeHtml(
                    referral.referrerName ||
                    "Unknown"
                );


            card.innerHTML = `

                <div class="referral-code-header">

                    <div>

                        <div class="referral-code">
                            ${safeCode}
                        </div>

                        <strong>
                            ${safeName}
                        </strong>

                    </div>


                    <span class="admin-status ${active ? "status-approved" : "status-rejected"}">

                        ${active ? "ACTIVE" : "INACTIVE"}

                    </span>

                </div>


                <p>
                    Successful Referrals:
                    <strong>
                        ${Number(referral.successfulReferrals || 0)}
                    </strong>
                </p>


                <p>
                    Rewards Earned:
                    <strong>
                        ${Number(referral.rewardsEarned || 0)}
                    </strong>
                </p>


                <p>
                    Created:
                    ${escapeHtml(formatDate(referral.createdAt))}
                </p>

            `;


            const toggleButton =
                document.createElement(
                    "button"
                );


            toggleButton.textContent =
                active
                    ? "Disable Code"
                    : "Enable Code";


            toggleButton.className =
                active
                    ? "danger-button"
                    : "approve-button";


            toggleButton.addEventListener(
                "click",
                () => {

                    toggleReferralCode(
                        referral
                    );

                }
            );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "admin-button-row";


            row.appendChild(
                toggleButton
            );


            card.appendChild(
                row
            );


            referralCodes.appendChild(
                card
            );

        }
    );

}



// ==========================================================
// ENABLE / DISABLE REFERRAL CODE
// ==========================================================

async function toggleReferralCode(
    referral
) {

    const newStatus =
        referral.active !== true;


    try {

        await updateDoc(

            doc(
                db,
                "referrals",
                referral.firestoreId
            ),

            {

                active:
                    newStatus

            }

        );

    }

    catch (error) {

        console.error(
            "Referral toggle error:",
            error
        );


        alert(
            "Unable to update referral code."
        );

    }

}



// ==========================================================
// STOP FIREBASE LISTENERS
// ==========================================================

function stopFirebaseListeners() {

    if (
        unsubscribeInventory
    ) {

        unsubscribeInventory();

        unsubscribeInventory =
            null;

    }


    if (
        unsubscribePromotion
    ) {

        unsubscribePromotion();

        unsubscribePromotion =
            null;

    }


    if (
        unsubscribeReferralUses
    ) {

        unsubscribeReferralUses();

        unsubscribeReferralUses =
            null;

    }


    if (
        unsubscribeReferrals
    ) {

        unsubscribeReferrals();

        unsubscribeReferrals =
            null;

    }

}



// ==========================================================
// LOGOUT
// ==========================================================

logoutButton.addEventListener(
    "click",
    () => {

        stopFirebaseListeners();


        inventory =
            [];

        referrals =
            [];

        referralUses =
            [];


        adminProducts.innerHTML =
            "";

        referralRequests.innerHTML =
            "";

        referralCodes.innerHTML =
            "";


        dashboard.classList.add(
            "hidden"
        );


        loginBox.classList.remove(
            "hidden"
        );


        usernameInput.value =
            "";

        passwordInput.value =
            "";

        loginMessage.textContent =
            "";


        openInventoryTab();

    }
);



// ==========================================================
// READY
// ==========================================================

console.log(
    "Grayson's Snack Shop Admin Dashboard Loaded"
);
