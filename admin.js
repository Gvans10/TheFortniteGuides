# /*

Grayson's Snack Shop
admin.js
Complete Admin Dashboard
========================

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
getDocs,
getDoc,
setDoc,
updateDoc,
deleteDoc
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
document.getElementById("loginBox");

const dashboard =
document.getElementById("dashboard");

const loginButton =
document.getElementById("loginButton");

const loginMessage =
document.getElementById("loginMessage");

const adminProducts =
document.getElementById("adminProducts");

const logoutButton =
document.getElementById("logout");

const addButton =
document.getElementById("addProduct");

const adminReferrals =
document.getElementById("adminReferrals");

const refreshReferralsButton =
document.getElementById("refreshReferrals");

const pendingReferralCount =
document.getElementById("pendingReferralCount");

const approvedReferralCount =
document.getElementById("approvedReferralCount");

const rewardDueCount =
document.getElementById("rewardDueCount");

const rewardedReferralCount =
document.getElementById("rewardedReferralCount");

const rejectedReferralCount =
document.getElementById("rejectedReferralCount");

const promotionName =
document.getElementById("promotionName");

const promotionActive =
document.getElementById("promotionActive");

const promotionStart =
document.getElementById("promotionStart");

const promotionEnd =
document.getElementById("promotionEnd");

const qualifyingProduct =
document.getElementById("qualifyingProduct");

const rewardProduct =
document.getElementById("rewardProduct");

const rewardQuantity =
document.getElementById("rewardQuantity");

const savePromotionButton =
document.getElementById("savePromotion");

const promotionMessage =
document.getElementById("promotionMessage");

// ==========================================================
// DATA
// ==========================================================

let products = [];

let referrals = [];

// ==========================================================
// FIRESTORE REFERENCES
// ==========================================================

const referralsRef =
collection(
db,
"referralUses"
);

const promotionsRef =
collection(
db,
"promotions"
);

// ==========================================================
// AUTHENTICATION
// ==========================================================

onAuthStateChanged(
auth,
async (user) => {

```
    if (user) {

        loginBox.classList.add(
            "hidden"
        );

        dashboard.classList.remove(
            "hidden"
        );

        loginMessage.textContent =
            "";

        await initializeDashboard();

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
```

);

// ==========================================================
// LOGIN
// ==========================================================

loginButton.addEventListener(
"click",
async () => {

```
    const email =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;


    if (!email || !password) {

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
```

);

// ==========================================================
// INITIALIZE DASHBOARD
// ==========================================================

async function initializeDashboard() {

```
try {

    await loadAdminProducts();

    await loadPromotion();

    await loadReferrals();

}

catch (error) {

    console.error(
        "Dashboard initialization error:",
        error
    );

}
```

}

// ==========================================================
// LOAD PRODUCTS
// ==========================================================

async function loadAdminProducts() {

```
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
            <p>
                No products found.
            </p>
        `;

        populateProductDropdowns();

        return;

    }


    products.forEach(
        product => {

            createAdminProduct(
                product
            );

        }
    );


    populateProductDropdowns();

}

catch (error) {

    console.error(
        "Error loading products:",
        error
    );


    adminProducts.innerHTML = `
        <p>
            Unable to load products.
        </p>
    `;

}
```

}

// ==========================================================
// CREATE ADMIN PRODUCT
// ==========================================================

function createAdminProduct(
product
) {

```
const box =
    document.createElement(
        "div"
    );


box.className =
    "admin-product";


const safeId =
    String(
        product.firebaseId ||
        product.id
    )
    .replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
    );


box.innerHTML = `

    <div class="product-image">

        <img
            src="${product.image || ""}"
            alt="${product.name || "Product"}"
            onerror="this.src='https://placehold.co/100x100?text=No+Image'"
        >

    </div>


    <h3>
        ${product.name || "Unnamed Product"}
    </h3>


    <label>
        Image Filename
    </label>

    <input
        id="image-${safeId}"
        value="${product.image || ""}"
    >


    <label>
        Price
    </label>

    <input
        id="price-${safeId}"
        value="${Number(product.price || 0).toFixed(2)}"
        type="number"
        step="0.01"
        min="0"
    >


    <label>
        Stock
    </label>

    <input
        id="stock-${safeId}"
        value="${Number(product.stock || 0)}"
        type="number"
        min="0"
    >


    <label>
        Restock Date
    </label>

    <input
        id="restock-${safeId}"
        value="${product.restock || ""}"
    >


    <button
        class="save-product-button"
        data-product-id="${product.id}"
        data-safe-id="${safeId}"
        type="button"
    >
        Save
    </button>


    <button
        class="delete-product-button"
        data-product-id="${product.id}"
        type="button"
    >
        Delete
    </button>

`;


const saveButton =
    box.querySelector(
        ".save-product-button"
    );


saveButton.addEventListener(
    "click",
    async () => {

        await saveProductFromForm(
            product,
            safeId
        );

    }
);


const deleteButton =
    box.querySelector(
        ".delete-product-button"
    );


deleteButton.addEventListener(
    "click",
    async () => {

        await deleteProductFromAdmin(
            product
        );

    }
);


adminProducts.appendChild(
    box
);
```

}

// ==========================================================
// SAVE PRODUCT
// ==========================================================

async function saveProductFromForm(
product,
safeId
) {

```
try {

    const updatedProduct = {

        ...product,

        image:
            document.getElementById(
                `image-${safeId}`
            ).value.trim(),

        price:
            Number(
                document.getElementById(
                    `price-${safeId}`
                ).value
            ),

        stock:
            Number(
                document.getElementById(
                    `stock-${safeId}`
                ).value
            ),

        restock:
            document.getElementById(
                `restock-${safeId}`
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
```

}

// ==========================================================
// DELETE PRODUCT
// ==========================================================

async function deleteProductFromAdmin(
product
) {

```
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
```

}

// ==========================================================
// ADD PRODUCT
// ==========================================================

addButton.addEventListener(
"click",
async () => {

```
    const name =
        document
            .getElementById("newName")
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById("newPrice")
                .value
        );


    const stock =
        Number(
            document
                .getElementById("newStock")
                .value
        );


    const restock =
        document
            .getElementById("newRestock")
            .value
            .trim();


    const image =
        document
            .getElementById("newImage")
            .value
            .trim();


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
            "Add Product";

    }

}
```

);

// ==========================================================
// PRODUCT DROPDOWNS
// ==========================================================

function populateProductDropdowns() {

```
if (!qualifyingProduct ||
    !rewardProduct) {

    return;

}


qualifyingProduct.innerHTML =
    "";

rewardProduct.innerHTML =
    "";


const defaultQualifying =
    document.createElement(
        "option"
    );


defaultQualifying.value =
    "";


defaultQualifying.textContent =
    "Select qualifying product";


qualifyingProduct.appendChild(
    defaultQualifying
);


const defaultReward =
    document.createElement(
        "option"
    );


defaultReward.value =
    "";


defaultReward.textContent =
    "Select reward product";


rewardProduct.appendChild(
    defaultReward
);


products.forEach(
    product => {

        const productId =
            String(
                product.firebaseId ||
                product.id
            );


        const option1 =
            document.createElement(
                "option"
            );


        option1.value =
            productId;


        option1.textContent =
            `${product.name} — $${Number(product.price || 0).toFixed(2)}`;


        qualifyingProduct.appendChild(
            option1
        );


        const option2 =
            document.createElement(
                "option"
            );


        option2.value =
            productId;


        option2.textContent =
            `${product.name} — $${Number(product.price || 0).toFixed(2)}`;


        rewardProduct.appendChild(
            option2
        );

    }
);
```

}

// ==========================================================
// SAVE PROMOTION
// ==========================================================

if (savePromotionButton) {

```
savePromotionButton.addEventListener(
    "click",
    async () => {

        const name =
            promotionName.value.trim();


        const active =
            promotionActive.checked;


        const start =
            promotionStart.value;


        const end =
            promotionEnd.value;


        const qualifying =
            qualifyingProduct.value;


        const reward =
            rewardProduct.value;


        const quantity =
            Number(
                rewardQuantity.value
            );


        if (!name) {

            showPromotionMessage(
                "Please enter a promotion name.",
                false
            );

            return;

        }


        if (!qualifying) {

            showPromotionMessage(
                "Please select a qualifying product.",
                false
            );

            return;

        }


        if (!reward) {

            showPromotionMessage(
                "Please select a reward product.",
                false
            );

            return;

        }


        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            showPromotionMessage(
                "Reward quantity must be at least 1.",
                false
            );

            return;

        }


        try {

            savePromotionButton.disabled =
                true;

            savePromotionButton.textContent =
                "Saving...";


            const promotion = {

                name:
                    name,

                active:
                    active,

                start:
                    start || null,

                end:
                    end || null,

                qualifyingProductId:
                    qualifying,

                rewardProductId:
                    reward,

                rewardQuantity:
                    quantity,

                updatedAt:
                    new Date().toISOString()

            };


            await setDoc(
                doc(
                    db,
                    "promotions",
                    "current"
                ),
                promotion
            );


            showPromotionMessage(
                "Promotion saved successfully!",
                true
            );

        }

        catch (error) {

            console.error(
                "Error saving promotion:",
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
);
```

}

// ==========================================================
// PROMOTION MESSAGE
// ==========================================================

function showPromotionMessage(
message,
success
) {

```
if (!promotionMessage) {

    return;

}


promotionMessage.textContent =
    message;


promotionMessage.style.color =
    success
        ? "green"
        : "red";
```

}

// ==========================================================
// LOAD PROMOTION
// ==========================================================

async function loadPromotion() {

```
try {

    const snapshot =
        await getDoc(
            doc(
                db,
                "promotions",
                "current"
            )
        );


    if (
        !snapshot.exists()
    ) {

        return;

    }


    const promotion =
        snapshot.data();


    promotionName.value =
        promotion.name || "";


    promotionActive.checked =
        promotion.active === true;


    promotionStart.value =
        promotion.start || "";


    promotionEnd.value =
        promotion.end || "";


    rewardQuantity.value =
        promotion.rewardQuantity || 1;


    populateProductDropdowns();


    if (
        promotion.qualifyingProductId
    ) {

        qualifyingProduct.value =
            promotion.qualifyingProductId;

    }


    if (
        promotion.rewardProductId
    ) {

        rewardProduct.value =
            promotion.rewardProductId;

    }

}

catch (error) {

    console.error(
        "Error loading promotion:",
        error
    );

}
```

}

// ==========================================================
// LOAD REFERRALS
// ==========================================================

async function loadReferrals() {

```
if (!adminReferrals) {

    return;

}


adminReferrals.innerHTML = `
    <p>
        Loading referrals...
    </p>
`;


try {

    const snapshot =
        await getDocs(
            referralsRef
        );


    referrals = [];


    snapshot.forEach(
        item => {

            referrals.push({

                id:
                    item.id,

                ...item.data()

            });

        }
    );


    referrals.sort(
        (a, b) => {

            const dateA =
                new Date(
                    a.createdAt || 0
                );


            const dateB =
                new Date(
                    b.createdAt || 0
                );


            return dateB - dateA;

        }
    );


    updateReferralStats();

    displayReferrals();

}

catch (error) {

    console.error(
        "Error loading referrals:",
        error
    );


    adminReferrals.innerHTML = `
        <p>
            Unable to load referrals.
        </p>
    `;

}
```

}

// ==========================================================
// REFERRAL STATS
// ==========================================================

function updateReferralStats() {

```
let pending =
    0;

let approved =
    0;

let rewardDue =
    0;

let rewarded =
    0;

let rejected =
    0;


referrals.forEach(
    referral => {

        const status =
            referral.status || "pending";


        const rewardStatus =
            referral.rewardStatus || "none";


        if (
            status === "pending"
        ) {

            pending++;

        }


        if (
            status === "approved"
        ) {

            approved++;

        }


        if (
            rewardStatus === "pending"
        ) {

            rewardDue++;

        }


        if (
            status === "rewarded" ||
            rewardStatus === "given"
        ) {

            rewarded++;

        }


        if (
            status === "rejected"
        ) {

            rejected++;

        }

    }
);


pendingReferralCount.textContent =
    pending;


approvedReferralCount.textContent =
    approved;


rewardDueCount.textContent =
    rewardDue;


rewardedReferralCount.textContent =
    rewarded;


rejectedReferralCount.textContent =
    rejected;
```

}

// ==========================================================
// DISPLAY REFERRALS
// ==========================================================

function displayReferrals() {

```
adminReferrals.innerHTML =
    "";


if (
    referrals.length === 0
) {

    adminReferrals.innerHTML = `
        <div class="admin-info-box">

            <h3>
                No Referrals Yet
            </h3>

            <p>
                When a customer uses a referral
                code, it will appear here.
            </p>

        </div>
    `;

    return;

}


referrals.forEach(
    referral => {

        createReferralCard(
            referral
        );

    }
);
```

}

// ==========================================================
// CREATE REFERRAL CARD
// ==========================================================

function createReferralCard(
referral
) {

```
const card =
    document.createElement(
        "div"
    );


card.className =
    "admin-referral-card";


const status =
    referral.status ||
    "pending";


const rewardStatus =
    referral.rewardStatus ||
    "none";


const createdDate =
    referral.createdAt
        ? new Date(
            referral.createdAt
          ).toLocaleString()
        : "Unknown";


let statusText =
    "Pending";

let statusClass =
    "referral-pending";


if (
    status === "approved"
) {

    statusText =
        "Purchase Approved";

    statusClass =
        "referral-approved";

}


if (
    status === "rejected"
) {

    statusText =
        "Rejected";

    statusClass =
        "referral-rejected";

}


if (
    status === "rewarded"
) {

    statusText =
        "Reward Given";

    statusClass =
        "referral-rewarded";

}


card.innerHTML = `

    <div class="referral-card-header">

        <div>

            <h3>
                ${referral.referrerName || "Unknown Referrer"}
            </h3>

            <p>
                Referral Code:
                <strong>
                    ${referral.referralCode || "Unknown"}
                </strong>
            </p>

        </div>


        <span
            class="referral-status ${statusClass}"
        >
            ${statusText}
        </span>

    </div>


    <div class="referral-card-details">

        <p>
            <strong>Referral ID:</strong>
            ${referral.id}
        </p>


        <p>
            <strong>Submitted:</strong>
            ${createdDate}
        </p>


        <p>
            <strong>Reward:</strong>
            ${rewardStatus === "given"
                ? "Given"
                : rewardStatus === "pending"
                    ? "Ready to give"
                    : "Not earned yet"}
        </p>

    </div>


    <div
        class="referral-card-actions"
        data-actions="${referral.id}"
    >

    </div>

`;


const actions =
    card.querySelector(
        ".referral-card-actions"
    );


// ------------------------------------------------------
// PENDING
// ------------------------------------------------------

if (
    status === "pending"
) {

    const approveButton =
        createActionButton(
            "Approve Purchase",
            "approve-referral"
        );


    approveButton.addEventListener(
        "click",
        async () => {

            await approveReferral(
                referral
            );

        }
    );


    actions.appendChild(
        approveButton
    );


    const rejectButton =
        createActionButton(
            "Reject",
            "reject-referral"
        );


    rejectButton.addEventListener(
        "click",
        async () => {

            await rejectReferral(
                referral
            );

        }
    );


    actions.appendChild(
        rejectButton
    );

}


// ------------------------------------------------------
// APPROVED / REWARD DUE
// ------------------------------------------------------

else if (
    status === "approved" &&
    rewardStatus === "pending"
) {

    const rewardButton =
        createActionButton(
            "🎁 Mark Reward Given",
            "reward-referral"
        );


    rewardButton.addEventListener(
        "click",
        async () => {

            await markRewardGiven(
                referral
            );

        }
    );


    actions.appendChild(
        rewardButton
    );

}


// ------------------------------------------------------
// REWARDED
// ------------------------------------------------------

else if (
    status === "rewarded"
) {

    const completed =
        document.createElement(
            "p"
        );


    completed.textContent =
        "✅ This referral has been completed.";


    actions.appendChild(
        completed
    );

}


// ------------------------------------------------------
// REJECTED
// ------------------------------------------------------

else if (
    status === "rejected"
) {

    const rejected =
        document.createElement(
            "p"
        );


    rejected.textContent =
        "❌ This referral was rejected.";


    actions.appendChild(
        rejected
    );

}


adminReferrals.appendChild(
    card
);
```

}

// ==========================================================
// CREATE ACTION BUTTON
// ==========================================================

function createActionButton(
text,
className
) {

```
const button =
    document.createElement(
        "button"
    );


button.type =
    "button";


button.textContent =
    text;


button.className =
    className;


return button;
```

}

// ==========================================================
// APPROVE REFERRAL
// ==========================================================

async function approveReferral(
referral
) {

```
const confirmed =
    confirm(
        `Approve the purchase for the referral from ${referral.referrerName || "this customer"}?`
    );


if (!confirmed) {

    return;

}


try {

    await updateDoc(
        doc(
            db,
            "referralUses",
            referral.id
        ),
        {

            status:
                "approved",

            rewardStatus:
                "pending",

            approvedAt:
                new Date().toISOString()

        }
    );


    alert(
        "Purchase approved. The reward is now due."
    );


    await loadReferrals();

}

catch (error) {

    console.error(
        "Error approving referral:",
        error
    );


    alert(
        "Unable to approve this referral."
    );

}
```

}

// ==========================================================
// REJECT REFERRAL
// ==========================================================

async function rejectReferral(
referral
) {

```
const confirmed =
    confirm(
        `Reject the referral from ${referral.referrerName || "this customer"}?`
    );


if (!confirmed) {

    return;

}


try {

    await updateDoc(
        doc(
            db,
            "referralUses",
            referral.id
        ),
        {

            status:
                "rejected",

            rewardStatus:
                "none",

            rejectedAt:
                new Date().toISOString()

        }
    );


    alert(
        "Referral rejected."
    );


    await loadReferrals();

}

catch (error) {

    console.error(
        "Error rejecting referral:",
        error
    );


    alert(
        "Unable to reject this referral."
    );

}
```

}

// ==========================================================
// MARK REWARD GIVEN
// ==========================================================

async function markRewardGiven(
referral
) {

```
const confirmed =
    confirm(
        `Confirm that you gave the reward to ${referral.referrerName || "the referrer"}?`
    );


if (!confirmed) {

    return;

}


try {

    await updateDoc(
        doc(
            db,
            "referralUses",
            referral.id
        ),
        {

            status:
                "rewarded",

            rewardStatus:
                "given",

            rewardedAt:
                new Date().toISOString()

        }
    );


    // --------------------------------------------------
    // Update referrer's total
    // --------------------------------------------------

    if (
        referral.referralCode
    ) {

        const referrerRef =
            doc(
                db,
                "referrals",
                referral.referralCode
            );


        const referrerSnapshot =
            await getDoc(
                referrerRef
            );


        if (
            referrerSnapshot.exists()
        ) {

            const referrer =
                referrerSnapshot.data();


            const currentSuccessful =
                Number(
                    referrer.successfulReferrals || 0
                );


            const currentRewards =
                Number(
                    referrer.rewardsEarned || 0
                );


            await updateDoc(
                referrerRef,
                {

                    successfulReferrals:
                        currentSuccessful + 1,

                    rewardsEarned:
                        currentRewards + 1

                }
            );

        }

    }


    alert(
        "Reward marked as given!"
    );


    await loadReferrals();

}

catch (error) {

    console.error(
        "Error marking reward:",
        error
    );


    alert(
        "Unable to mark the reward as given."
    );

}
```

}

// ==========================================================
// REFRESH REFERRALS
// ==========================================================

if (
refreshReferralsButton
) {

```
refreshReferralsButton.addEventListener(
    "click",
    async () => {

        refreshReferralsButton.disabled =
            true;

        refreshReferralsButton.textContent =
            "Refreshing...";


        try {

            await loadReferrals();

        }

        finally {

            refreshReferralsButton.disabled =
                false;

            refreshReferralsButton.textContent =
                "Refresh Referrals";

        }

    }
);
```

}

// ==========================================================
// LOGOUT
// ==========================================================

logoutButton.addEventListener(
"click",
async () => {

```
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
```

);
