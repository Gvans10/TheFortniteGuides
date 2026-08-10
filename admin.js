/*
==========================================================
Grayson's Snack Shop
admin.js

Inventory
Promotions
Referral Management
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
    runTransaction,
    writeBatch
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


const referralUsesRef =
    collection(
        db,
        "referralUses"
    );


const referralsRef =
    collection(
        db,
        "referrals"
    );


const promotionRef =
    doc(
        db,
        "promotions",
        "first-week-takis"
    );



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


const username =
    document.getElementById(
        "username"
    );


const password =
    document.getElementById(
        "password"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
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


const newName =
    document.getElementById(
        "newName"
    );


const newPrice =
    document.getElementById(
        "newPrice"
    );


const newStock =
    document.getElementById(
        "newStock"
    );


const newRestock =
    document.getElementById(
        "newRestock"
    );


const newImage =
    document.getElementById(
        "newImage"
    );


const addProductButton =
    document.getElementById(
        "addProduct"
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


const inventoryProductNames =
    document.getElementById(
        "inventoryProductNames"
    );



// ==========================================================
// REFERRAL ELEMENTS
// ==========================================================

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


const referralRequests =
    document.getElementById(
        "referralRequests"
    );


const referralCodes =
    document.getElementById(
        "referralCodes"
    );



// ==========================================================
// STATE
// ==========================================================

let inventory =
    [];


let referralUses =
    [];


let referrals =
    [];


let unsubscribeInventory =
    null;


let unsubscribePromotion =
    null;


let unsubscribeReferralUses =
    null;


let unsubscribeReferrals =
    null;



// ==========================================================
// ESCAPE HTML
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



// ==========================================================
// FORMAT DATE
// ==========================================================

function formatDate(value) {

    if (
        !value
    ) {

        return "Not recorded";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleString();

}



// ==========================================================
// LOGIN
// ==========================================================

function login() {

    const enteredUsername =
        username.value.trim();


    const enteredPassword =
        password.value;


    if (
        enteredUsername === ADMIN_USERNAME &&
        enteredPassword === ADMIN_PASSWORD
    ) {

        loginMessage.textContent =
            "";


        showDashboard();

    }

    else {

        loginMessage.textContent =
            "Incorrect username or password.";

    }

}



// ==========================================================
// SHOW DASHBOARD
// ==========================================================

function showDashboard() {

    loginBox.classList.add(
        "hidden"
    );


    dashboard.classList.remove(
        "hidden"
    );


    sessionStorage.setItem(
        "gssAdminLoggedIn",
        "true"
    );


    startListeners();

}



// ==========================================================
// LOGIN EVENTS
// ==========================================================

loginButton.addEventListener(
    "click",
    login
);


username.addEventListener(

    "keydown",

    (event) => {

        if (
            event.key ===
            "Enter"
        ) {

            login();

        }

    }

);


password.addEventListener(

    "keydown",

    (event) => {

        if (
            event.key ===
            "Enter"
        ) {

            login();

        }

    }

);



// ==========================================================
// LOGOUT
// ==========================================================

logoutButton.addEventListener(

    "click",

    () => {

        stopListeners();


        sessionStorage.removeItem(
            "gssAdminLoggedIn"
        );


        dashboard.classList.add(
            "hidden"
        );


        loginBox.classList.remove(
            "hidden"
        );


        username.value =
            "";


        password.value =
            "";

    }

);



// ==========================================================
// TABS
// ==========================================================

function showInventoryTab() {

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



function showPromotionsTab() {

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
    showInventoryTab
);


promotionsTabButton.addEventListener(
    "click",
    showPromotionsTab
);



// ==========================================================
// RENDER INVENTORY
// ==========================================================

function renderInventory() {

    inventoryProductNames.innerHTML =
        "";


    inventory.forEach(
        (product) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                product.name ||
                "";


            inventoryProductNames.appendChild(
                option
            );

        }
    );


    if (
        inventory.length === 0
    ) {

        adminProducts.innerHTML = `

            <div class="admin-empty">

                No products found.

            </div>

        `;


        return;

    }


    adminProducts.innerHTML =
        inventory
            .map(
                (product) => {

                    return `

                        <div
                            class="product-admin-card"
                            data-product-id="${escapeHtml(product.firestoreId)}"
                        >

                            <div class="admin-product-image">

                                <img
                                    src="${escapeHtml(product.image || "")}"
                                    alt="${escapeHtml(product.name || "")}"
                                    onerror="this.src='https://placehold.co/100x100?text=No+Image'"
                                >

                            </div>


                            <div class="product-edit-grid">

                                <input
                                    data-field="name"
                                    value="${escapeHtml(product.name || "")}"
                                    placeholder="Product Name"
                                >


                                <input
                                    data-field="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value="${Number(product.price) || 0}"
                                >


                                <input
                                    data-field="stock"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value="${Number(product.stock) || 0}"
                                >


                                <input
                                    data-field="restock"
                                    value="${escapeHtml(product.restock || "")}"
                                    placeholder="Restock Date"
                                >


                                <input
                                    data-field="image"
                                    value="${escapeHtml(product.image || "")}"
                                    placeholder="Image Filename"
                                >

                            </div>


                            <div class="product-buttons">

                                <button
                                    class="small-button save-button"
                                    data-action="save-product"
                                    type="button"
                                >

                                    Save

                                </button>


                                <button
                                    class="small-button delete-button"
                                    data-action="delete-product"
                                    type="button"
                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}



// ==========================================================
// ADD PRODUCT
// ==========================================================

addProductButton.addEventListener(

    "click",

    async () => {

        const name =
            newName.value.trim();


        const price =
            Number(
                newPrice.value
            );


        const stock =
            Number(
                newStock.value
            );


        const restock =
            newRestock.value.trim();


        const image =
            newImage.value.trim();


        if (
            !name
        ) {

            alert(
                "Enter a product name."
            );


            return;

        }


        const firestoreId =
            Date.now()
                .toString();


        try {

            await setDoc(

                doc(
                    db,
                    "inventory",
                    firestoreId
                ),

                {

                    id:
                        Number(
                            firestoreId
                        ),

                    name:
                        name,

                    price:
                        Number.isNaN(price)
                            ? 0
                            : price,

                    stock:
                        Number.isNaN(stock)
                            ? 0
                            : stock,

                    restock:
                        restock,

                    image:
                        image

                }

            );


            newName.value =
                "";


            newPrice.value =
                "";


            newStock.value =
                "";


            newRestock.value =
                "";


            newImage.value =
                "";

        }

        catch (
            error
        ) {

            console.error(
                "Add product error:",
                error
            );


            alert(
                "Unable to add product."
            );

        }

    }

);



// ==========================================================
// INVENTORY ACTIONS
// ==========================================================

adminProducts.addEventListener(

    "click",

    async (event) => {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (
            !button
        ) {

            return;

        }


        const productCard =
            button.closest(
                ".product-admin-card"
            );


        if (
            !productCard
        ) {

            return;

        }


        const firestoreId =
            productCard.dataset.productId;


        const action =
            button.dataset.action;


        if (
            action ===
            "save-product"
        ) {

            const field =
                (name) => {

                    return productCard.querySelector(
                        `[data-field="${name}"]`
                    );

                };


            const name =
                field(
                    "name"
                ).value.trim();


            if (
                !name
            ) {

                alert(
                    "Product needs a name."
                );


                return;

            }


            try {

                await updateDoc(

                    doc(
                        db,
                        "inventory",
                        firestoreId
                    ),

                    {

                        name:
                            name,

                        price:
                            Number(
                                field(
                                    "price"
                                ).value
                            ) || 0,

                        stock:
                            Number(
                                field(
                                    "stock"
                                ).value
                            ) || 0,

                        restock:
                            field(
                                "restock"
                            )
                                .value
                                .trim(),

                        image:
                            field(
                                "image"
                            )
                                .value
                                .trim()

                    }

                );


                button.textContent =
                    "Saved ✓";


                setTimeout(
                    () => {

                        button.textContent =
                            "Save";

                    },
                    1200
                );

            }

            catch (
                error
            ) {

                console.error(
                    "Save product error:",
                    error
                );


                alert(
                    "Unable to save product."
                );

            }

        }


        if (
            action ===
            "delete-product"
        ) {

            const confirmed =
                confirm(
                    "Delete this product permanently?"
                );


            if (
                !confirmed
            ) {

                return;

            }


            try {

                await deleteDoc(

                    doc(
                        db,
                        "inventory",
                        firestoreId
                    )

                );

            }

            catch (
                error
            ) {

                console.error(
                    "Delete product error:",
                    error
                );


                alert(
                    "Unable to delete product."
                );

            }

        }

    }

);



// ==========================================================
// LOAD PROMOTION INTO FORM
// ==========================================================

function loadPromotionIntoForm(
    promotion
) {

    promotionActive.checked =
        promotion.active ===
        true;


    promotionName.value =
        promotion.name ||
        "";


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
            promotion.rewardQuantity
        ) || 1;


    promotionDescription.value =
        promotion.description ||
        "";

}



// ==========================================================
// SAVE PROMOTION
// ==========================================================

savePromotionButton.addEventListener(

    "click",

    async () => {

        promotionMessage.textContent =
            "Saving...";


        promotionMessage.style.color =
            "#777";


        try {

            await setDoc(

                promotionRef,

                {

                    id:
                        "first-week-takis",

                    name:
                        promotionName
                            .value
                            .trim(),

                    active:
                        promotionActive
                            .checked,

                    startDate:
                        promotionStart
                            .value,

                    endDate:
                        promotionEnd
                            .value,

                    qualifyingProduct:
                        promotionQualifyingProduct
                            .value
                            .trim(),

                    rewardProduct:
                        promotionRewardProduct
                            .value
                            .trim(),

                    rewardQuantity:
                        Number(
                            promotionRewardQuantity
                                .value
                        ) || 1,

                    description:
                        promotionDescription
                            .value
                            .trim(),

                    updatedAt:
                        new Date()
                            .toISOString()

                },

                {
                    merge:
                        true
                }

            );


            promotionMessage.textContent =
                "Saved ✓";


            promotionMessage.style.color =
                "#188b49";

        }

        catch (
            error
        ) {

            console.error(
                "Save promotion error:",
                error
            );


            promotionMessage.textContent =
                "Save failed";


            promotionMessage.style.color =
                "#d54141";

        }

    }

);



// ==========================================================
// REFERRAL STATS
// ==========================================================

function updateReferralStats() {

    const pending =
        referralUses
            .filter(
                (item) => {

                    return (
                        item.status ===
                        "pending"
                    );

                }
            )
            .length;


    const approved =
        referralUses
            .filter(
                (item) => {

                    return (
                        item.status ===
                        "approved"
                    );

                }
            )
            .length;


    const outstanding =
        referralUses
            .filter(
                (item) => {

                    return (
                        item.rewardStatus ===
                        "earned"
                    );

                }
            )
            .length;


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
// REQUEST STATUS
// ==========================================================

function getRequestStatus(
    item
) {

    if (
        item.rewardStatus ===
        "rewarded"
    ) {

        return {

            text:
                "REWARD GIVEN",

            className:
                "status-rewarded"

        };

    }


    if (
        item.status ===
        "approved"
    ) {

        return {

            text:
                "APPROVED",

            className:
                "status-approved"

        };

    }


    if (
        item.status ===
        "rejected"
    ) {

        return {

            text:
                "REJECTED",

            className:
                "status-rejected"

        };

    }


    return {

        text:
            "PENDING",

        className:
            "status-pending"

    };

}



// ==========================================================
// RENDER REFERRAL REQUESTS
// ==========================================================

function renderReferralRequests() {

    updateReferralStats();


    if (
        referralUses.length ===
        0
    ) {

        referralRequests.innerHTML = `

            <div class="admin-empty">

                No referral submissions yet.

            </div>

        `;


        return;

    }


    const sorted =
        [...referralUses]
            .sort(
                (a, b) => {

                    return String(
                        b.createdAt ||
                        ""
                    )
                        .localeCompare(
                            String(
                                a.createdAt ||
                                ""
                            )
                        );

                }
            );


    referralRequests.innerHTML =
        sorted
            .map(
                (item) => {

                    const status =
                        getRequestStatus(
                            item
                        );


                    let actions =
                        "";


                    if (
                        item.status ===
                        "pending"
                    ) {

                        actions += `

                            <button
                                class="action-button approve-button"
                                data-action="approve-request"
                                type="button"
                            >

                                Approve Purchase

                            </button>


                            <button
                                class="action-button reject-button"
                                data-action="reject-request"
                                type="button"
                            >

                                Reject

                            </button>

                        `;

                    }


                    if (
                        item.status ===
                        "rejected"
                    ) {

                        actions += `

                            <button
                                class="action-button reset-button"
                                data-action="return-pending"
                                type="button"
                            >

                                Return To Pending

                            </button>

                        `;

                    }


                    if (
                        item.status ===
                            "approved" &&
                        item.rewardStatus ===
                            "earned"
                    ) {

                        actions += `

                            <button
                                class="action-button reward-button"
                                data-action="reward-given"
                                type="button"
                            >

                                Mark Reward Given

                            </button>

                        `;

                    }


                    actions += `

                        <button
                            class="action-button hard-delete-button"
                            data-action="delete-request"
                            type="button"
                        >

                            Delete Request

                        </button>

                    `;


                    return `

                        <div
                            class="referral-request"
                            data-request-id="${escapeHtml(item.firestoreId)}"
                        >

                            <div class="referral-request-top">

                                <div>

                                    <h3>

                                        ${escapeHtml(item.referrerName || "Unknown Referrer")}

                                    </h3>


                                    <div class="referral-meta">

                                        <span>

                                            Code:

                                            <strong>

                                                ${escapeHtml(item.referralCode || "")}

                                            </strong>

                                        </span>


                                        <span>

                                            Purchase:

                                            <strong>

                                                ${escapeHtml(item.qualifyingProduct || "Not recorded")}

                                            </strong>

                                        </span>


                                        <span>

                                            Reward:

                                            <strong>

                                                ${Number(item.rewardQuantity) || 1}
                                                ×
                                                ${escapeHtml(item.rewardProduct || "Reward")}

                                            </strong>

                                        </span>


                                        <span>

                                            Submitted:

                                            ${escapeHtml(formatDate(item.createdAt))}

                                        </span>

                                    </div>

                                </div>


                                <span
                                    class="admin-status ${status.className}"
                                >

                                    ${status.text}

                                </span>

                            </div>


                            <div class="action-row">

                                ${actions}

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}



// ==========================================================
// APPROVE REFERRAL
// ==========================================================

async function approveReferralRequest(
    requestId
) {

    await runTransaction(

        db,

        async (
            transaction
        ) => {

            const useRef =
                doc(
                    db,
                    "referralUses",
                    requestId
                );


            const useSnapshot =
                await transaction.get(
                    useRef
                );


            if (
                !useSnapshot.exists()
            ) {

                throw new Error(
                    "Referral request no longer exists."
                );

            }


            const use =
                useSnapshot.data();


            if (
                use.status !==
                "pending"
            ) {

                throw new Error(
                    "This referral has already been reviewed."
                );

            }


            const codeRef =
                doc(
                    db,
                    "referrals",
                    use.referralCode
                );


            const codeSnapshot =
                await transaction.get(
                    codeRef
                );


            if (
                !codeSnapshot.exists()
            ) {

                throw new Error(
                    "Referral code no longer exists."
                );

            }


            const referralCode =
                codeSnapshot.data();


            transaction.update(

                useRef,

                {

                    status:
                        "approved",

                    rewardStatus:
                        "earned",

                    approvedAt:
                        new Date()
                            .toISOString(),

                    rewardedAt:
                        null

                }

            );


            transaction.update(

                codeRef,

                {

                    successfulReferrals:

                        Number(
                            referralCode.successfulReferrals ||
                            0
                        ) + 1,

                    rewardsEarned:

                        Number(
                            referralCode.rewardsEarned ||
                            0
                        ) + 1

                }

            );

        }

    );

}



// ==========================================================
// DELETE REFERRAL REQUEST
// ==========================================================

async function deleteReferralRequest(
    requestId
) {

    await runTransaction(

        db,

        async (
            transaction
        ) => {

            const useRef =
                doc(
                    db,
                    "referralUses",
                    requestId
                );


            const useSnapshot =
                await transaction.get(
                    useRef
                );


            if (
                !useSnapshot.exists()
            ) {

                return;

            }


            const use =
                useSnapshot.data();


            if (
                use.status ===
                    "approved" &&
                use.referralCode
            ) {

                const codeRef =
                    doc(
                        db,
                        "referrals",
                        use.referralCode
                    );


                const codeSnapshot =
                    await transaction.get(
                        codeRef
                    );


                if (
                    codeSnapshot.exists()
                ) {

                    const referralCode =
                        codeSnapshot.data();


                    transaction.update(

                        codeRef,

                        {

                            successfulReferrals:

                                Math.max(
                                    0,
                                    Number(
                                        referralCode.successfulReferrals ||
                                        0
                                    ) - 1
                                ),

                            rewardsEarned:

                                Math.max(
                                    0,
                                    Number(
                                        referralCode.rewardsEarned ||
                                        0
                                    ) - 1
                                )

                        }

                    );

                }

            }


            transaction.delete(
                useRef
            );

        }

    );

}



// ==========================================================
// REFERRAL REQUEST BUTTONS
// ==========================================================

referralRequests.addEventListener(

    "click",

    async (event) => {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (
            !button
        ) {

            return;

        }


        const requestCard =
            button.closest(
                ".referral-request"
            );


        if (
            !requestCard
        ) {

            return;

        }


        const requestId =
            requestCard.dataset.requestId;


        const action =
            button.dataset.action;


        try {

            if (
                action ===
                "approve-request"
            ) {

                await approveReferralRequest(
                    requestId
                );

            }


            if (
                action ===
                "reject-request"
            ) {

                await updateDoc(

                    doc(
                        db,
                        "referralUses",
                        requestId
                    ),

                    {

                        status:
                            "rejected",

                        rewardStatus:
                            "none"

                    }

                );

            }


            if (
                action ===
                "return-pending"
            ) {

                await updateDoc(

                    doc(
                        db,
                        "referralUses",
                        requestId
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


            if (
                action ===
                "reward-given"
            ) {

                await updateDoc(

                    doc(
                        db,
                        "referralUses",
                        requestId
                    ),

                    {

                        rewardStatus:
                            "rewarded",

                        rewardedAt:
                            new Date()
                                .toISOString()

                    }

                );

            }


            if (
                action ===
                "delete-request"
            ) {

                const confirmed =
                    confirm(
                        "Delete this referral request permanently?"
                    );


                if (
                    confirmed
                ) {

                    await deleteReferralRequest(
                        requestId
                    );

                }

            }

        }

        catch (
            error
        ) {

            console.error(
                "Referral request action error:",
                error
            );


            alert(
                error.message ||
                "Unable to update referral."
            );

        }

    }

);



// ==========================================================
// RENDER REFERRAL CODES
// ==========================================================

function renderReferralCodes() {

    updateReferralStats();


    if (
        referrals.length ===
        0
    ) {

        referralCodes.innerHTML = `

            <div class="admin-empty">

                No customer referral codes yet.

            </div>

        `;


        return;

    }


    const sorted =
        [...referrals]
            .sort(
                (a, b) => {

                    return String(
                        b.createdAt ||
                        ""
                    )
                        .localeCompare(
                            String(
                                a.createdAt ||
                                ""
                            )
                        );

                }
            );


    referralCodes.innerHTML =
        sorted
            .map(
                (referral) => {

                    const code =
                        referral.code ||
                        referral.firestoreId;


                    const active =
                        referral.active !==
                        false;


                    return `

                        <div
                            class="referral-code-card"
                            data-referral-code="${escapeHtml(referral.firestoreId)}"
                        >

                            <div>

                                <div class="referral-code">

                                    ${escapeHtml(code)}

                                </div>


                                <div class="referral-code-name">

                                    ${escapeHtml(referral.referrerName || "Unknown")}

                                </div>


                                <div class="referral-code-meta">

                                    <span>

                                        Successful:

                                        <strong>

                                            ${Number(referral.successfulReferrals) || 0}

                                        </strong>

                                    </span>


                                    <span>

                                        Rewards:

                                        <strong>

                                            ${Number(referral.rewardsEarned) || 0}

                                        </strong>

                                    </span>


                                    <span>

                                        Status:

                                        <strong>

                                            ${
                                                active
                                                    ? "Active"
                                                    : "Disabled"
                                            }

                                        </strong>

                                    </span>


                                    <span>

                                        Created:

                                        ${escapeHtml(formatDate(referral.createdAt))}

                                    </span>

                                </div>

                            </div>


                            <div class="code-buttons">

                                <button
                                    class="small-button ${
                                        active
                                            ? "delete-button"
                                            : "save-button"
                                    }"
                                    data-action="toggle-code"
                                    type="button"
                                >

                                    ${
                                        active
                                            ? "Disable"
                                            : "Enable"
                                    }

                                </button>


                                <button
                                    class="small-button hard-delete-button"
                                    data-action="delete-code"
                                    type="button"
                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}



// ==========================================================
// DELETE REFERRAL CODE AND ITS REQUESTS
// ==========================================================

async function deleteReferralCode(
    code
) {

    const batch =
        writeBatch(
            db
        );


    batch.delete(

        doc(
            db,
            "referrals",
            code
        )

    );


    referralUses
        .filter(
            (item) => {

                return (
                    item.referralCode ===
                    code
                );

            }
        )
        .forEach(
            (item) => {

                batch.delete(

                    doc(
                        db,
                        "referralUses",
                        item.firestoreId
                    )

                );

            }
        );


    await batch.commit();

}



// ==========================================================
// REFERRAL CODE ACTIONS
// ==========================================================

referralCodes.addEventListener(

    "click",

    async (event) => {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (
            !button
        ) {

            return;

        }


        const card =
            button.closest(
                ".referral-code-card"
            );


        if (
            !card
        ) {

            return;

        }


        const code =
            card.dataset.referralCode;


        const referral =
            referrals.find(
                (item) => {

                    return (
                        item.firestoreId ===
                        code
                    );

                }
            );


        if (
            !referral
        ) {

            return;

        }


        const action =
            button.dataset.action;


        try {

            if (
                action ===
                "toggle-code"
            ) {

                await updateDoc(

                    doc(
                        db,
                        "referrals",
                        code
                    ),

                    {

                        active:
                            referral.active ===
                            false

                    }

                );

            }


            if (
                action ===
                "delete-code"
            ) {

                const confirmed =
                    confirm(
                        "Delete this referral code AND all submissions connected to it?"
                    );


                if (
                    confirmed
                ) {

                    await deleteReferralCode(
                        code
                    );

                }

            }

        }

        catch (
            error
        ) {

            console.error(
                "Referral code action error:",
                error
            );


            alert(
                "Unable to update referral code."
            );

        }

    }

);



// ==========================================================
// START FIRESTORE LISTENERS
// ==========================================================

function startListeners() {

    stopListeners();


    unsubscribeInventory =
        onSnapshot(

            inventoryRef,

            (snapshot) => {

                inventory =
                    snapshot.docs
                        .map(
                            (item) => {

                                return {

                                    firestoreId:
                                        item.id,

                                    ...item.data()

                                };

                            }
                        )
                        .sort(
                            (a, b) => {

                                return String(
                                    a.name ||
                                    ""
                                )
                                    .localeCompare(
                                        String(
                                            b.name ||
                                            ""
                                        )
                                    );

                            }
                        );


                renderInventory();

            },

            (error) => {

                console.error(
                    "Inventory listener error:",
                    error
                );

            }

        );


    unsubscribePromotion =
        onSnapshot(

            promotionRef,

            (snapshot) => {

                if (
                    snapshot.exists()
                ) {

                    loadPromotionIntoForm(
                        snapshot.data()
                    );

                }

                else {

                    loadPromotionIntoForm({

                        active:
                            false,

                        rewardQuantity:
                            1

                    });

                }

            },

            (error) => {

                console.error(
                    "Promotion listener error:",
                    error
                );

            }

        );


    unsubscribeReferralUses =
        onSnapshot(

            referralUsesRef,

            (snapshot) => {

                referralUses =
                    snapshot.docs
                        .map(
                            (item) => {

                                return {

                                    firestoreId:
                                        item.id,

                                    ...item.data()

                                };

                            }
                        );


                renderReferralRequests();

            },

            (error) => {

                console.error(
                    "Referral request listener error:",
                    error
                );

            }

        );


    unsubscribeReferrals =
        onSnapshot(

            referralsRef,

            (snapshot) => {

                referrals =
                    snapshot.docs
                        .map(
                            (item) => {

                                return {

                                    firestoreId:
                                        item.id,

                                    ...item.data()

                                };

                            }
                        );


                renderReferralCodes();

            },

            (error) => {

                console.error(
                    "Referral codes listener error:",
                    error
                );

            }

        );

}



// ==========================================================
// STOP LISTENERS
// ==========================================================

function stopListeners() {

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
// RESTORE SESSION
// ==========================================================

if (
    sessionStorage.getItem(
        "gssAdminLoggedIn"
    ) ===
    "true"
) {

    showDashboard();

}



// ==========================================================
// READY
// ==========================================================

console.log(
    "Grayson's Snack Shop Admin Dashboard Loaded"
);
