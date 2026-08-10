/*
==========================================================
Grayson's Snack Shop
referrals.js
Referral Rewards System
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

const referralCode =
    document.getElementById(
        "referralCode"
    );

const referralCount =
    document.getElementById(
        "referralCount"
    );

const referralRewardsEarned =
    document.getElementById(
        "referralRewardsEarned"
    );

const referralActiveStatus =
    document.getElementById(
        "referralActiveStatus"
    );

const copyReferralButton =
    document.getElementById(
        "copyReferralButton"
    );

const shareReferralButton =
    document.getElementById(
        "shareReferralButton"
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



let unsubscribeMyReferral =
    null;



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
// PROMOTION CHECK
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
        promotion.active !== true
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

    let code =
        generateCode();


    while (
        true
    ) {

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


        code =
            generateCode();

    }

}



// ==========================================================
// DISPLAY CODE
// ==========================================================

function displayReferralCode(
    code,
    referral
) {

    referralCode.textContent =
        code;


    referralCount.textContent =
        Number(
            referral.successfulReferrals ||
            0
        );


    referralRewardsEarned.textContent =
        Number(
            referral.rewardsEarned ||
            0
        );


    if (
        referral.active === false
    ) {

        referralActiveStatus.textContent =
            "DISABLED";

        referralActiveStatus.classList.add(
            "disabled-status"
        );

    }

    else {

        referralActiveStatus.textContent =
            "ACTIVE";

        referralActiveStatus.classList.remove(
            "disabled-status"
        );

    }


    referralResult.classList.remove(
        "hidden"
    );

}



// ==========================================================
// LIVE REFERRAL LISTENER
// ==========================================================

function startReferralListener(
    code
) {

    if (
        unsubscribeMyReferral
    ) {

        unsubscribeMyReferral();
    }


    unsubscribeMyReferral =
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

                    referralResult.classList.add(
                        "hidden"
                    );

                    return;

                }


                displayReferralCode(
                    code,
                    snapshot.data()
                );

            },

            (error) => {

                console.error(
                    "Referral listener error:",
                    error
                );

            }

        );

}



// ==========================================================
// LOAD EXISTING CODE
// ==========================================================

async function loadExistingReferral() {

    const savedCode =
        localStorage.getItem(
            "myReferralCode"
        );

    const savedName =
        localStorage.getItem(
            "myReferralName"
        );


    if (
        !savedCode
    ) {

        return;

    }


    try {

        const snapshot =
            await getDoc(

                doc(
                    db,
                    "referrals",
                    savedCode
                )

            );


        if (
            !snapshot.exists()
        ) {

            localStorage.removeItem(
                "myReferralCode"
            );

            localStorage.removeItem(
                "myReferralName"
            );

            return;

        }


        if (
            savedName
        ) {

            referralName.value =
                savedName;

        }


        displayReferralCode(
            savedCode,
            snapshot.data()
        );


        startReferralListener(
            savedCode
        );

    }

    catch (
        error
    ) {

        console.error(
            "Existing referral error:",
            error
        );

    }

}



// ==========================================================
// CREATE REFERRAL
// ==========================================================

generateReferralButton.addEventListener(

    "click",

    async () => {

        const name =
            referralName
                .value
                .trim();


        if (
            !name
        ) {

            showGenerateMessage(
                "Enter your name first."
            );

            return;

        }


        generateReferralButton.disabled =
            true;

        generateReferralButton.textContent =
            "Creating your code...";


        try {

            await getActivePromotion();


            const existingCode =
                localStorage.getItem(
                    "myReferralCode"
                );


            if (
                existingCode
            ) {

                const existingSnapshot =
                    await getDoc(

                        doc(
                            db,
                            "referrals",
                            existingCode
                        )

                    );


                if (
                    existingSnapshot.exists()
                ) {

                    const existingData =
                        existingSnapshot.data();


                    referralName.value =
                        existingData.referrerName ||
                        name;


                    displayReferralCode(
                        existingCode,
                        existingData
                    );


                    startReferralListener(
                        existingCode
                    );


                    showGenerateMessage(
                        "Your referral code is ready.",
                        true
                    );


                    return;

                }

            }


            const code =
                await createUniqueCode();


            const newReferral = {

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
                    new Date().toISOString()

            };


            await setDoc(

                doc(
                    db,
                    "referrals",
                    code
                ),

                newReferral

            );


            /*
            IMPORTANT:
            DISPLAY THE CODE IMMEDIATELY.
            */

            displayReferralCode(
                code,
                newReferral
            );


            localStorage.setItem(
                "myReferralCode",
                code
            );


            localStorage.setItem(
                "myReferralName",
                name
            );


            startReferralListener(
                code
            );


            showGenerateMessage(
                "Code created. Send it to a friend!",
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
                "Referral creation error:",
                error
            );


            showGenerateMessage(

                error.message ||
                "Unable to create your referral code."

            );

        }

        finally {

            generateReferralButton.disabled =
                false;


            generateReferralButton.innerHTML = `

                Generate My Referral Code

                <span>
                    →
                </span>

            `;

        }

    }

);



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
// COPY CODE
// ==========================================================

copyReferralButton.addEventListener(

    "click",

    async () => {

        const code =
            referralCode
                .textContent
                .trim();


        if (
            !code ||
            !code.startsWith(
                "GS-"
            )
        ) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                code
            );


            copyReferralButton.textContent =
                "✓ Code Copied";


            setTimeout(
                () => {

                    copyReferralButton.textContent =
                        "📋 Copy Code";

                },
                1600
            );

        }

        catch (
            error
        ) {

            console.error(
                "Clipboard error:",
                error
            );

        }

    }

);



// ==========================================================
// SHARE REFERRAL
// ==========================================================

shareReferralButton.addEventListener(

    "click",

    async () => {

        const code =
            referralCode
                .textContent
                .trim();


        if (
            !code ||
            !code.startsWith(
                "GS-"
            )
        ) {

            return;

        }


        const referralLink =
            buildReferralLink(
                code
            );


        const shareText =
            `Use my Grayson's Snack Shop referral code ${code}`;


        try {

            if (
                navigator.share
            ) {

                await navigator.share({

                    title:
                        "Grayson's Snack Shop",

                    text:
                        shareText,

                    url:
                        referralLink

                });

            }

            else {

                await navigator.clipboard.writeText(
                    referralLink
                );


                shareReferralButton.textContent =
                    "✓ Link Copied";


                setTimeout(
                    () => {

                        shareReferralButton.textContent =
                            "↗ Share Referral";

                    },
                    1600
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

);



// ==========================================================
// CREATE REFERRAL USE
// ==========================================================

async function createReferralUse(
    code
) {

    const promotion =
        await getActivePromotion();


    const myCode =
        localStorage.getItem(
            "myReferralCode"
        );


    if (
        myCode === code
    ) {

        throw new Error(
            "You cannot use your own referral code."
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
        referral.active !== true
    ) {

        throw new Error(
            "That referral code is not active."
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


    const existingUse =
        await getDoc(
            useRef
        );


    if (
        existingUse.exists()
    ) {

        const existing =
            existingUse.data();


        if (
            existing.status === "pending" ||
            existing.status === "approved"
        ) {

            if (
                existing.referralCode === code
            ) {

                return {
                    alreadyApplied:
                        true
                };

            }


            throw new Error(
                "This device already has a referral in progress."
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
                new Date().toISOString(),

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
                    "This referral is already active on this device.",
                    true
                );

            }

            else {

                showUseMessage(
                    "Referral applied successfully.",
                    true
                );

            }


            localStorage.setItem(
                "activeReferralCode",
                code
            );

        }

        catch (
            error
        ) {

            console.error(
                "Referral use error:",
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
// REFERRAL FROM URL
// Example:
// index.html?ref=GS-ABC123
// ==========================================================

function loadReferralFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const code =
        params
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
        600
    );

}



// ==========================================================
// ACTIVE REFERRAL STATUS
// ==========================================================

function loadAppliedReferral() {

    const activeCode =
        localStorage.getItem(
            "activeReferralCode"
        );


    if (
        !activeCode
    ) {

        return;

    }


    useReferralCode.value =
        activeCode;


    referralAppliedBox.classList.remove(
        "hidden"
    );


    showUseMessage(
        "This referral is active on this device.",
        true
    );

}



// ==========================================================
// START
// ==========================================================

loadExistingReferral();

loadReferralFromUrl();

loadAppliedReferral();
