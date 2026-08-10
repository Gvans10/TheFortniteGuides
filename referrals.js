# /*

Grayson's Snack Shop
referrals.js
Customer Referral System
========================

*/

import { db } from "./firebase.js";

import {
collection,
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==========================================================
// FIRESTORE COLLECTIONS
// ==========================================================

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

// ==========================================================
// ELEMENTS
// ==========================================================

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

const copyReferralButton =
document.getElementById(
"copyReferralButton"
);

const referralCount =
document.getElementById(
"referralCount"
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

// ==========================================================
// GENERATE RANDOM CODE
// ==========================================================

function generateCode() {

```
const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let code = "GS-";


for (
    let i = 0;
    i < 6;
    i++
) {

    const randomIndex =
        Math.floor(
            Math.random() *
            characters.length
        );


    code +=
        characters[randomIndex];

}


return code;
```

}

// ==========================================================
// CREATE UNIQUE CODE
// ==========================================================

async function createUniqueCode() {

```
let code;

let exists = true;


while (exists) {

    code =
        generateCode();


    const codeRef =
        doc(
            db,
            "referrals",
            code
        );


    const snapshot =
        await getDoc(
            codeRef
        );


    exists =
        snapshot.exists();

}


return code;
```

}

// ==========================================================
// SHOW GENERATOR MESSAGE
// ==========================================================

function showReferralMessage(
message,
success = false
) {

```
if (!referralMessage) {

    return;

}


referralMessage.textContent =
    message;


referralMessage.style.color =
    success
        ? "green"
        : "red";
```

}

// ==========================================================
// SHOW CODE
// ==========================================================

function showReferralCode(
code,
name
) {

```
if (referralCode) {

    referralCode.textContent =
        code;

}


if (referralName) {

    referralName.value =
        name;

}


if (referralResult) {

    referralResult.classList.remove(
        "hidden"
    );

}
```

}

// ==========================================================
// GENERATE REFERRAL CODE
// ==========================================================

if (generateReferralButton) {

```
generateReferralButton.addEventListener(
    "click",
    async () => {

        const name =
            referralName.value.trim();


        if (!name) {

            showReferralMessage(
                "Please enter your name."
            );

            return;

        }


        generateReferralButton.disabled =
            true;


        generateReferralButton.textContent =
            "Generating...";


        try {

            const code =
                await createUniqueCode();


            await setDoc(
                doc(
                    db,
                    "referrals",
                    code
                ),
                {

                    code: code,

                    referrerName:
                        name,

                    active:
                        true,

                    successfulReferrals:
                        0,

                    rewardsEarned:
                        0,

                    createdAt:
                        new Date().toISOString()

                }
            );


            showReferralCode(
                code,
                name
            );


            showReferralMessage(
                "Your referral code was created!",
                true
            );


            localStorage.setItem(
                "myReferralCode",
                code
            );


            localStorage.setItem(
                "myReferralName",
                name
            );


            await updateReferralCount(
                code
            );

        }

        catch (error) {

            console.error(
                "Error creating referral code:",
                error
            );


            showReferralMessage(
                "Unable to create your referral code. Please try again."
            );

        }

        finally {

            generateReferralButton.disabled =
                false;


            generateReferralButton.textContent =
                "Generate My Referral Code";

        }

    }
);
```

}

// ==========================================================
// LOAD EXISTING CODE
// ==========================================================

async function loadMyReferralCode() {

```
const savedCode =
    localStorage.getItem(
        "myReferralCode"
    );


const savedName =
    localStorage.getItem(
        "myReferralName"
    );


if (
    !savedCode ||
    !savedName
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


    if (!snapshot.exists()) {

        localStorage.removeItem(
            "myReferralCode"
        );

        localStorage.removeItem(
            "myReferralName"
        );

        return;

    }


    const referral =
        snapshot.data();


    showReferralCode(
        referral.code,
        referral.referrerName
    );


    showReferralMessage(
        "Your referral code is ready!",
        true
    );


    await updateReferralCount(
        savedCode
    );

}

catch (error) {

    console.error(
        "Error loading referral code:",
        error
    );

}
```

}

// ==========================================================
// UPDATE REFERRAL COUNT
// ==========================================================

async function updateReferralCount(
code
) {

```
try {

    const snapshot =
        await getDoc(
            doc(
                db,
                "referrals",
                code
            )
        );


    if (!snapshot.exists()) {

        return;

    }


    const data =
        snapshot.data();


    const successful =
        Number(
            data.successfulReferrals || 0
        );


    if (referralCount) {

        referralCount.textContent =
            `Successful Referrals: ${successful}`;

    }

}

catch (error) {

    console.error(
        "Error loading referral count:",
        error
    );

}
```

}

// ==========================================================
// COPY CODE
// ==========================================================

if (copyReferralButton) {

```
copyReferralButton.addEventListener(
    "click",
    async () => {

        const code =
            referralCode.textContent.trim();


        if (
            !code ||
            code === "------"
        ) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                code
            );


            copyReferralButton.textContent =
                "Copied!";


            setTimeout(
                () => {

                    copyReferralButton.textContent =
                        "Copy";

                },
                1500
            );

        }

        catch (error) {

            console.error(
                "Copy error:",
                error
            );

        }

    }
);
```

}

// ==========================================================
// CREATE REFERRAL USE
// ==========================================================

async function createReferralUse(
code
) {

```
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
        "Referral code does not exist."
    );

}


const referral =
    referralSnapshot.data();


if (
    referral.active !== true
) {

    throw new Error(
        "Referral code is inactive."
    );

}


/*
----------------------------------------------------------
IMPORTANT

A browser-generated ID is used for the referral
transaction.

This lets the same customer continue their referral
without exposing their personal information.
----------------------------------------------------------
*/

let customerReferralId =
    localStorage.getItem(
        "customerReferralId"
    );


if (!customerReferralId) {

    customerReferralId =
        crypto.randomUUID();


    localStorage.setItem(
        "customerReferralId",
        customerReferralId
    );

}


const existingReferral =
    localStorage.getItem(
        "activeReferralCode"
    );


if (existingReferral) {

    if (
        existingReferral === code
    ) {

        return {

            alreadyActive:
                true,

            referralId:
                customerReferralId

        };

    }

}


await setDoc(
    doc(
        db,
        "referralUses",
        customerReferralId
    ),
    {

        referralId:
            customerReferralId,

        referralCode:
            code,

        referrerName:
            referral.referrerName,

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

    alreadyActive:
        false,

    referralId:
        customerReferralId

};
```

}

// ==========================================================
// USE REFERRAL CODE
// ==========================================================

if (submitReferralButton) {

```
submitReferralButton.addEventListener(
    "click",
    async () => {

        const code =
            useReferralCode.value
                .trim()
                .toUpperCase();


        if (!code) {

            useReferralMessage.textContent =
                "Please enter a referral code.";

            useReferralMessage.style.color =
                "red";

            return;

        }


        submitReferralButton.disabled =
            true;


        submitReferralButton.textContent =
            "Checking...";


        try {

            const result =
                await createReferralUse(
                    code
                );


            if (
                result.alreadyActive
            ) {

                useReferralMessage.textContent =
                    "This referral code is already active for this customer.";

            }

            else {

                useReferralMessage.textContent =
                    "Referral code accepted! Your purchase can now be reviewed by the shop owner.";

            }


            useReferralMessage.style.color =
                "green";


            useReferralCode.value =
                code;

        }

        catch (error) {

            console.error(
                "Referral code error:",
                error
            );


            useReferralMessage.textContent =
                error.message ||
                "Unable to verify the referral code.";

            useReferralMessage.style.color =
                "red";

        }

        finally {

            submitReferralButton.disabled =
                false;


            submitReferralButton.textContent =
                "Use Referral Code";

        }

    }
);
```

}

// ==========================================================
// START
// ==========================================================

loadMyReferralCode();

// ==========================================================
// EXPORT
// ==========================================================

export {

```
generateCode,

createUniqueCode,

createReferralUse
```

};
