/*
==========================================================
Grayson's Snack Shop
referrals.js

Multiple Referral Code System
==========================================================
*/


import {
    db
} from "./firebase.js";


import {

    doc,
    getDoc,
    setDoc,
    onSnapshot

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



// ==========================================================
// SETTINGS
// ==========================================================

const PROMOTION_ID =
    "first-week-takis";


const CODES_STORAGE_KEY =
    "myReferralCodes";



// ==========================================================
// ELEMENTS
// ==========================================================

const referTabButton =
    document.getElementById(
        "referTabButton"
    );

const useTabButton =
    document.getElementById(
        "useTabButton"
    );

const referPanel =
    document.getElementById(
        "referPanel"
    );

const usePanel =
    document.getElementById(
        "usePanel"
    );


const referralName =
    document.getElementById(
        "referralName"
    );

const generateReferralButton =
    document.getElementById(
        "generateReferralButton"
    );

const referralMessage =
    document.getElementById(
        "referralMessage"
    );

const referralResult =
    document.getElementById(
        "referralResult"
    );


const useReferralCode =
    document.getElementById(
        "useReferralCode"
    );

const submitReferralButton =
    document.getElementById(
        "submitReferralButton"
    );

const useReferralMessage =
    document.getElementById(
        "useReferralMessage"
    );

const referralAppliedBox =
    document.getElementById(
        "referralAppliedBox"
    );



// ==========================================================
// STATE
// ==========================================================

let myReferralCodes =
    [];

const referralData =
    new Map();

const referralListeners =
    new Map();



// ==========================================================
// SAFE HTML
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
// TABS
// ==========================================================

function showReferPanel() {

    referPanel.classList.remove(
        "hidden"
    );

    usePanel.classList.add(
        "hidden"
    );


    referTabButton.classList.add(
        "active"
    );

    useTabButton.classList.remove(
        "active"
    );

}



function showUsePanel() {

    usePanel.classList.remove(
        "hidden"
    );

    referPanel.classList.add(
        "hidden"
    );


    useTabButton.classList.add(
        "active"
    );

    referTabButton.classList.remove(
        "active"
    );

}



referTabButton.addEventListener(
    "click",
    showReferPanel
);


useTabButton.addEventListener(
    "click",
    showUsePanel
);



// ==========================================================
// MESSAGES
// ==========================================================

function showGenerateMessage(
    text,
    success = false
) {

    referralMessage.textContent =
        text;


    referralMessage.classList.toggle(
        "success-message",
        success
    );


    referralMessage.classList.toggle(
        "error-message",
        !success
    );

}



function showUseMessage(
    text,
    success = false
) {

    useReferralMessage.textContent =
        text;


    useReferralMessage.classList.toggle(
        "success-message",
        success
    );


    useReferralMessage.classList.toggle(
        "error-message",
        !success
    );

}



// ==========================================================
// LOCAL REFERRAL CODE STORAGE
// ==========================================================

function loadStoredCodes() {

    let codes =
        [];


    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    CODES_STORAGE_KEY
                ) ||
                "[]"
            );


        if (
            Array.isArray(saved)
        ) {

            codes =
                saved;

        }

    }

    catch (
        error
    ) {

        console.warn(
            "Unable to read saved referral codes.",
            error
        );

    }


    /*
    Migrate old one-code system.
    */

    const oldCode =
        localStorage.getItem(
            "myReferralCode"
        );


    if (
        oldCode &&
        !codes.includes(
            oldCode
        )
    ) {

        codes.push(
            oldCode
        );

    }


    myReferralCodes =
        [
            ...new Set(
                codes
                    .map(
                        (code) =>
                            String(code)
                                .trim()
                                .toUpperCase()
                    )
                    .filter(
                        (code) =>
                            code.startsWith(
                                "GS-"
                            )
                    )
            )
        ];


    saveStoredCodes();

}



function saveStoredCodes() {

    localStorage.setItem(

        CODES_STORAGE_KEY,

        JSON.stringify(
            myReferralCodes
        )

    );

}



// ==========================================================
// PROMOTION
// ==========================================================

async function getActivePromotion() {

    const snapshot =
        await getDoc(

            doc(
                db,
                "promotions",
                PROMOTION_ID
            )

        );


    if (
        !snapshot.exists()
    ) {

        throw new Error(
            "The referral promotion is not currently available."
        );

    }


    const promotion =
        snapshot.data();


    if (
        promotion.active !==
        true
    ) {

        throw new Error(
            "The referral promotion is currently turned off."
        );

    }


    return promotion;

}



// ==========================================================
// GENERATE CODE
// ==========================================================

function generateCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let code =
        "GS-";


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        code +=
            characters[
                Math.floor(
                    Math.random() *
                    characters.length
                )
            ];

    }


    return code;

}



// ==========================================================
// UNIQUE CODE
// ==========================================================

async function createUniqueCode() {

    while (
        true
    ) {

        const code =
            generateCode();


        const snapshot =
            await getDoc(

                doc(
                    db,
                    "referrals",
                    code
                )

            );


        if (
            !snapshot.exists()
        ) {

            return code;

        }

    }

}



// ==========================================================
// REFERRAL LINK
// ==========================================================

function buildReferralLink(
    code
) {

    const url =
        new URL(
            window.location.href
        );


    url.searchParams.set(
        "ref",
        code
    );


    url.hash =
        "referralSection";


    return url.toString();

}



// ==========================================================
// RENDER ALL MY CODES
// ==========================================================

function renderMyReferralCodes() {

    if (
        myReferralCodes.length ===
        0
    ) {

        referralResult.classList.add(
            "hidden"
        );


        generateReferralButton.innerHTML = `

            Generate My Referral Code

            <span>
                →
            </span>

        `;


        return;

    }


    referralResult.classList.remove(
        "hidden"
    );


    /*
    Turn the old single-code result box into a clean
    multi-code container without changing index.html.
    */

    referralResult.style.background =
        "transparent";

    referralResult.style.border =
        "none";

    referralResult.style.padding =
        "0";


    const cards =
        myReferralCodes
            .map(
                (
                    code,
                    index
                ) => {

                    const data =
                        referralData.get(
                            code
                        ) || {};


                    const successful =
                        Number(
                            data.successfulReferrals ||
                            0
                        );


                    const rewards =
                        Number(
                            data.rewardsEarned ||
                            0
                        );


                    const active =
                        data.active !==
                        false;


                    return `

                        <div
                            class="generated-referral"
                            style="
                                margin-top:
                                    ${index === 0 ? "0" : "14px"};
                            "
                        >

                            <div class="generated-top">

                                <span>

                                    REFERRAL CODE
                                    ${index + 1}

                                </span>

                                <div
                                    class="code-status ${
                                        active
                                            ? ""
                                            : "disabled-status"
                                    }"
                                >

                                    ${
                                        active
                                            ? "ACTIVE"
                                            : "DISABLED"
                                    }

                                </div>

                            </div>


                            <div class="giant-referral-code">

                                ${escapeHtml(code)}

                            </div>


                            <p class="share-instruction">

                                Send this code to one of your friends.

                            </p>


                            <div class="code-actions">

                                <button
                                    type="button"
                                    class="copy-code-button"
                                    data-code-action="copy"
                                    data-code="${escapeHtml(code)}"
                                >

                                    📋 Copy Code

                                </button>


                                <button
                                    type="button"
                                    class="share-code-button"
                                    data-code-action="share"
                                    data-code="${escapeHtml(code)}"
                                >

                                    ↗ Share Referral

                                </button>

                            </div>


                            <div class="referral-stats-row">

                                <div>

                                    <span>
                                        SUCCESSFUL REFERRALS
                                    </span>

                                    <strong>
                                        ${successful}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        REWARDS EARNED
                                    </span>

                                    <strong>
                                        ${rewards}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    referralResult.innerHTML = `

        <div
            style="
                margin-bottom:16px;
            "
        >

            <div
                style="
                    color:#ff7200;
                    font-size:9px;
                    font-weight:800;
                    letter-spacing:1.5px;
                "
            >

                YOUR REFERRAL CODES

            </div>

            <div
                style="
                    margin-top:4px;
                    font-size:13px;
                    font-weight:700;
                "
            >

                You currently have
                ${myReferralCodes.length}
                ${
                    myReferralCodes.length === 1
                        ? "code"
                        : "codes"
                }.

            </div>

        </div>


        ${cards}


        <button
            id="createAnotherReferralButton"
            type="button"
            class="big-action-button"
            style="
                margin-top:16px;
            "
        >

            Create Another Referral Code

            <span>
                +
            </span>

        </button>

    `;


    generateReferralButton.innerHTML = `

        Generate Another Referral Code

        <span>
            +
        </span>

    `;

}



// ==========================================================
// LIVE CODE LISTENER
// ==========================================================

function startCodeListener(
    code
) {

    if (
        referralListeners.has(
            code
        )
    ) {

        return;

    }


    const unsubscribe =
        onSnapshot(

            doc(
                db,
                "referrals",
                code
            ),

            (snapshot) => {

                if (
                    !snapshot.exists()
                ) {

                    referralData.delete(
                        code
                    );


                    myReferralCodes =
                        myReferralCodes.filter(
                            (item) =>
                                item !==
                                code
                        );


                    saveStoredCodes();

                    renderMyReferralCodes();

                    return;

                }


                referralData.set(
                    code,
                    snapshot.data()
                );


                renderMyReferralCodes();

            },

            (error) => {

                console.error(
                    "Referral listener error:",
                    error
                );

            }

        );


    referralListeners.set(
        code,
        unsubscribe
    );

}



// ==========================================================
// LOAD EXISTING CODES
// ==========================================================

async function loadExistingCodes() {

    loadStoredCodes();


    const validCodes =
        [];


    for (
        const code
        of myReferralCodes
    ) {

        try {

            const snapshot =
                await getDoc(

                    doc(
                        db,
                        "referrals",
                        code
                    )

                );


            if (
                snapshot.exists()
            ) {

                validCodes.push(
                    code
                );


                referralData.set(
                    code,
                    snapshot.data()
                );


                startCodeListener(
                    code
                );

            }

        }

        catch (
            error
        ) {

            console.error(
                "Referral load error:",
                error
            );

        }

    }


    myReferralCodes =
        validCodes;


    saveStoredCodes();


    const savedName =
        localStorage.getItem(
            "myReferralName"
        );


    if (
        savedName
    ) {

        referralName.value =
            savedName;

    }


    renderMyReferralCodes();

}



// ==========================================================
// CREATE NEW REFERRAL CODE
// ==========================================================

async function createNewReferralCode() {

    let name =
        referralName
            .value
            .trim();


    if (
        !name
    ) {

        name =
            localStorage.getItem(
                "myReferralName"
            ) || "";

    }


    if (
        !name
    ) {

        showGenerateMessage(
            "Enter your name first."
        );

        referralName.focus();

        return;

    }


    generateReferralButton.disabled =
        true;


    generateReferralButton.textContent =
        "Creating code...";


    try {

        await getActivePromotion();


        const code =
            await createUniqueCode();


        const referral = {

            code:
                code,

            referrerName:
                name,

            active:
                true,

            successfulReferrals:
                0,

            rewardsEarned:
                0,

            promotionId:
                PROMOTION_ID,

            createdAt:
                new Date()
                    .toISOString()

        };


        await setDoc(

            doc(
                db,
                "referrals",
                code
            ),

            referral

        );


        myReferralCodes.unshift(
            code
        );


        referralData.set(
            code,
            referral
        );


        saveStoredCodes();


        localStorage.setItem(
            "myReferralName",
            name
        );


        /*
        Keep old compatibility key.
        */

        localStorage.setItem(
            "myReferralCode",
            code
        );


        startCodeListener(
            code
        );


        renderMyReferralCodes();


        showGenerateMessage(

            "New referral code created! You can make another one whenever you want.",

            true

        );


        referralResult.scrollIntoView({

            behavior:
                "smooth",

            block:
                "nearest"

        });

    }

    catch (
        error
    ) {

        console.error(
            "Create referral error:",
            error
        );


        showGenerateMessage(

            error.message ||
            "Unable to create a referral code."

        );

    }

    finally {

        generateReferralButton.disabled =
            false;


        renderMyReferralCodes();

    }

}



// ==========================================================
// GENERATE BUTTON
// ==========================================================

generateReferralButton.addEventListener(

    "click",

    createNewReferralCode

);



// ==========================================================
// CODE CARD BUTTONS
// ==========================================================

referralResult.addEventListener(

    "click",

    async (
        event
    ) => {

        const createAnother =
            event.target.closest(
                "#createAnotherReferralButton"
            );


        if (
            createAnother
        ) {

            await createNewReferralCode();

            return;

        }


        const actionButton =
            event.target.closest(
                "[data-code-action]"
            );


        if (
            !actionButton
        ) {

            return;

        }


        const code =
            actionButton
                .dataset
                .code;


        const action =
            actionButton
                .dataset
                .codeAction;


        if (
            action ===
            "copy"
        ) {

            try {

                await navigator.clipboard.writeText(
                    code
                );


                const oldText =
                    actionButton.textContent;


                actionButton.textContent =
                    "✓ Copied";


                setTimeout(
                    () => {

                        actionButton.textContent =
                            oldText;

                    },
                    1500
                );

            }

            catch (
                error
            ) {

                console.error(
                    "Copy error:",
                    error
                );

            }

        }


        if (
            action ===
            "share"
        ) {

            const referralLink =
                buildReferralLink(
                    code
                );


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share({

                        title:
                            "Grayson's Snack Shop",

                        text:
                            `Use my referral code ${code} at Grayson's Snack Shop.`,

                        url:
                            referralLink

                    });

                }

                else {

                    await navigator.clipboard.writeText(
                        referralLink
                    );


                    const oldText =
                        actionButton.textContent;


                    actionButton.textContent =
                        "✓ Link Copied";


                    setTimeout(
                        () => {

                            actionButton.textContent =
                                oldText;

                        },
                        1500
                    );

                }

            }

            catch (
                error
            ) {

                if (
                    error.name !==
                    "AbortError"
                ) {

                    console.error(
                        "Share error:",
                        error
                    );

                }

            }

        }

    }

);



// ==========================================================
// CREATE REFERRAL USE
// ==========================================================

async function createReferralUse(
    code
) {

    const promotion =
        await getActivePromotion();


    /*
    Cannot use ANY of your own codes.
    */

    if (
        myReferralCodes.includes(
            code
        )
    ) {

        throw new Error(
            "You cannot use one of your own referral codes."
        );

    }


    const referralSnapshot =
        await getDoc(

            doc(
                db,
                "referrals",
                code
            )

        );


    if (
        !referralSnapshot.exists()
    ) {

        throw new Error(
            "That referral code does not exist."
        );

    }


    const referral =
        referralSnapshot.data();


    if (
        referral.active !==
        true
    ) {

        throw new Error(
            "That referral code is currently disabled."
        );

    }


    let customerReferralId =
        localStorage.getItem(
            "customerReferralId"
        );


    if (
        !customerReferralId
    ) {

        customerReferralId =
            crypto.randomUUID();


        localStorage.setItem(
            "customerReferralId",
            customerReferralId
        );

    }


    const useRef =
        doc(
            db,
            "referralUses",
            customerReferralId
        );


    const existingSnapshot =
        await getDoc(
            useRef
        );


    if (
        existingSnapshot.exists()
    ) {

        const existing =
            existingSnapshot.data();


        if (
            existing.status ===
                "pending" ||
            existing.status ===
                "approved"
        ) {

            if (
                existing.referralCode ===
                code
            ) {

                return {

                    alreadyApplied:
                        true

                };

            }


            throw new Error(
                "This device already has another referral in progress."
            );

        }

    }


    await setDoc(

        useRef,

        {

            referralId:
                customerReferralId,

            referralCode:
                code,

            referrerName:
                referral.referrerName,

            promotionId:
                PROMOTION_ID,

            promotionName:
                promotion.name ||
                "Referral Promotion",

            qualifyingProduct:
                promotion.qualifyingProduct ||
                "",

            rewardProduct:
                promotion.rewardProduct ||
                "",

            rewardQuantity:
                Number(
                    promotion.rewardQuantity
                ) || 1,

            status:
                "pending",

            rewardStatus:
                "none",

            createdAt:
                new Date()
                    .toISOString(),

            approvedAt:
                null,

            rewardedAt:
                null

        }

    );


    localStorage.setItem(
        "activeReferralCode",
        code
    );


    return {

        alreadyApplied:
            false

    };

}



// ==========================================================
// APPLY CODE
// ==========================================================

submitReferralButton.addEventListener(

    "click",

    async () => {

        const code =
            useReferralCode
                .value
                .trim()
                .toUpperCase();


        if (
            !code
        ) {

            showUseMessage(
                "Enter a referral code first."
            );

            return;

        }


        if (
            !/^GS-[A-Z0-9]{6}$/.test(
                code
            )
        ) {

            showUseMessage(
                "Referral codes look like GS-ABC123."
            );

            return;

        }


        submitReferralButton.disabled =
            true;


        submitReferralButton.textContent =
            "Checking code...";


        try {

            const result =
                await createReferralUse(
                    code
                );


            referralAppliedBox.classList.remove(
                "hidden"
            );


            if (
                result.alreadyApplied
            ) {

                showUseMessage(
                    "This referral is already active.",
                    true
                );

            }

            else {

                showUseMessage(
                    "Referral applied successfully!",
                    true
                );

            }

        }

        catch (
            error
        ) {

            console.error(
                "Use referral error:",
                error
            );


            referralAppliedBox.classList.add(
                "hidden"
            );


            showUseMessage(

                error.message ||
                "Unable to apply that referral code."

            );

        }

        finally {

            submitReferralButton.disabled =
                false;


            submitReferralButton.innerHTML = `

                Apply Referral Code

                <span>
                    ✓
                </span>

            `;

        }

    }

);



// ==========================================================
// REFERRAL LINK
// ==========================================================

function loadReferralFromUrl() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    const code =
        parameters
            .get(
                "ref"
            )
            ?.trim()
            .toUpperCase();


    if (
        !code
    ) {

        return;

    }


    useReferralCode.value =
        code;


    showUsePanel();


    setTimeout(
        () => {

            document
                .getElementById(
                    "referralSection"
                )
                ?.scrollIntoView({

                    behavior:
                        "smooth"

                });

        },
        500
    );

}



// ==========================================================
// ACTIVE REFERRAL
// ==========================================================

async function loadAppliedReferral() {

    const customerReferralId =
        localStorage.getItem(
            "customerReferralId"
        );


    if (
        !customerReferralId
    ) {

        return;

    }


    try {

        const snapshot =
            await getDoc(

                doc(
                    db,
                    "referralUses",
                    customerReferralId
                )

            );


        /*
        Important:
        If you deleted the request from Admin,
        the customer is allowed to submit another.
        */

        if (
            !snapshot.exists()
        ) {

            localStorage.removeItem(
                "activeReferralCode"
            );

            referralAppliedBox.classList.add(
                "hidden"
            );

            return;

        }


        const referral =
            snapshot.data();


        if (
            referral.status ===
                "pending" ||
            referral.status ===
                "approved"
        ) {

            useReferralCode.value =
                referral.referralCode ||
                "";


            referralAppliedBox.classList.remove(
                "hidden"
            );


            showUseMessage(
                "This referral is currently active.",
                true
            );

        }

    }

    catch (
        error
    ) {

        console.error(
            "Applied referral load error:",
            error
        );

    }

}



// ==========================================================
// START
// ==========================================================

await loadExistingCodes();

loadReferralFromUrl();

await loadAppliedReferral();
