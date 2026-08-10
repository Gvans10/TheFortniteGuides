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
setDoc,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==========================================================
// FIRESTORE COLLECTION
// ==========================================================

const referralsRef = collection(
db,
"referrals"
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
let code = "";

let exists = true;


while (exists) {

    code = generateCode();


    const codeRef =
        doc(
            db,
            "referrals",
            code
        );


    const snapshot =
        await getDoc(codeRef);


    exists =
        snapshot.exists();

}


return code;
```

}

// ==========================================================
// SHOW MESSAGE
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
// GENERATE REFERRAL
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

                    active: true,

                    successfulReferrals:
                        0,

                    rewardsEarned:
                        0,

                    createdAt:
                        new Date().toISOString()

                }
            );


            referralCode.textContent =
                code;


            referralResult.classList.remove(
                "hidden"
            );


            referralName.value =
                name;


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


            updateReferralCount(
                code
            );


        } catch (error) {

            console.error(
                "Error creating referral code:",
                error
            );


            showReferralMessage(
                "Unable to create your referral code. Please try again."
            );

        } finally {

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
// LOAD EXISTING CUSTOMER CODE
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


    referralName.value =
        referral.referrerName;


    referralCode.textContent =
        referral.code;


    referralResult.classList.remove(
        "hidden"
    );


    showReferralMessage(
        "Your referral code is ready!",
        true
    );


    updateReferralCount(
        savedCode
    );

} catch (error) {

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

} catch (error) {

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


            setTimeout(() => {

                copyReferralButton.textContent =
                    "Copy";

            }, 1500);

        } catch (error) {

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

            return;

        }


        submitReferralButton.disabled =
            true;


        submitReferralButton.textContent =
            "Checking...";


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

                useReferralMessage.textContent =
                    "That referral code does not exist.";

                return;

            }


            const referral =
                snapshot.data();


            if (
                referral.active !== true
            ) {

                useReferralMessage.textContent =
                    "That referral code is no longer active.";

                return;

            }


            localStorage.setItem(
                "activeReferralCode",
                code
            );


            useReferralMessage.textContent =
                `Referral code ${code} accepted!`;

            useReferralMessage.style.color =
                "green";


            useReferralCode.value =
                code;


        } catch (error) {

            console.error(
                "Referral code error:",
                error
            );


            useReferralMessage.textContent =
                "Unable to verify the referral code.";

        } finally {

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
// EXPORTS
// ==========================================================

export {
generateCode,
createUniqueCode
};
