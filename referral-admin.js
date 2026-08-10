/*
==========================================================
Grayson's Snack Shop
referral-admin.js
Admin Referral Management System
==========================================================
*/

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================================
// FIRESTORE
// ==========================================================

const referralsRef = collection(
    db,
    "referrals"
);


// ==========================================================
// LOAD REFERRALS
// ==========================================================

export async function loadReferrals() {

    try {

        const snapshot =
            await getDocs(
                referralsRef
            );


        const referrals = [];


        snapshot.forEach(
            item => {

                referrals.push({

                    id: item.id,

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


        console.log(
            "Firebase Referrals Loaded:",
            referrals
        );


        return referrals;

    }

    catch (error) {

        console.error(
            "Error loading referrals:",
            error
        );


        throw error;

    }

}


// ==========================================================
// UPDATE REFERRAL
// ==========================================================

export async function updateReferral(
    referralId,
    changes
) {

    try {

        await updateDoc(
            doc(
                db,
                "referrals",
                referralId
            ),
            changes
        );


        console.log(
            "Referral updated:",
            referralId
        );


        return true;

    }

    catch (error) {

        console.error(
            "Error updating referral:",
            error
        );


        throw error;

    }

}


// ==========================================================
// APPROVE REFERRAL
// ==========================================================

export async function approveReferral(
    referralId
) {

    return await updateReferral(
        referralId,
        {

            status:
                "approved",

            approvedAt:
                new Date().toISOString(),

            rewardStatus:
                "pending"

        }
    );

}


// ==========================================================
// REJECT REFERRAL
// ==========================================================

export async function rejectReferral(
    referralId
) {

    return await updateReferral(
        referralId,
        {

            status:
                "rejected",

            rejectedAt:
                new Date().toISOString(),

            rewardStatus:
                "none"

        }
    );

}


// ==========================================================
// MARK REWARD AS GIVEN
// ==========================================================

export async function rewardReferral(
    referralId
) {

    return await updateReferral(
        referralId,
        {

            status:
                "rewarded",

            rewardStatus:
                "given",

            rewardedAt:
                new Date().toISOString()

        }
    );

}


// ==========================================================
// RESET REFERRAL
// ==========================================================

export async function resetReferral(
    referralId
) {

    return await updateReferral(
        referralId,
        {

            status:
                "pending",

            rewardStatus:
                "none",

            approvedAt:
                null,

            rejectedAt:
                null,

            rewardedAt:
                null

        }
    );

}


// ==========================================================
// EXPORT
// ==========================================================

export default {

    loadReferrals,

    updateReferral,

    approveReferral,

    rejectReferral,

    rewardReferral,

    resetReferral

};
