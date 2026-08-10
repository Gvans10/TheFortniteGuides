<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
Grayson's Snack Shop — Admin
</title>

<link
    rel="icon"
    type="image/png"
    href="graysonslogos.png"
>

<link
    rel="preconnect"
    href="https://fonts.googleapis.com"
>

<link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin
>

<link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
>


<style>

/*
==========================================================
GRAYSon's SNACK SHOP
ADMIN DASHBOARD
Standalone Design
==========================================================
*/


:root {

    --orange:
        #ff7200;

    --orange-hover:
        #e96800;

    --orange-soft:
        #fff3e8;

    --page:
        #f6f6f4;

    --surface:
        #ffffff;

    --surface-soft:
        #f8f7f5;

    --text:
        #171717;

    --muted:
        #747474;

    --border:
        #e7e5e2;

    --green:
        #188b49;

    --green-soft:
        #eaf8f0;

    --red:
        #d54141;

    --red-soft:
        #fff0f0;

    --blue:
        #3478d4;

    --blue-soft:
        #edf5ff;

    --yellow:
        #b87a08;

    --yellow-soft:
        #fff8df;

    --shadow:
        0 18px 50px
        rgba(
            0,
            0,
            0,
            .07
        );

}


* {

    margin:
        0;

    padding:
        0;

    box-sizing:
        border-box;

    font-family:
        "Poppins",
        sans-serif;

}


body {

    min-height:
        100vh;

    background:
        var(--page);

    color:
        var(--text);

}


button,
input,
textarea,
select {

    font:
        inherit;

}


button {

    cursor:
        pointer;

}


.hidden {

    display:
        none !important;

}



/* ========================================================
LOGIN
======================================================== */

.login-page {

    min-height:
        100vh;

    display:
        grid;

    place-items:
        center;

    padding:
        30px;

    background:

        radial-gradient(
            circle at 15% 20%,
            rgba(
                255,
                114,
                0,
                .11
            ),
            transparent 32%
        ),

        radial-gradient(
            circle at 85% 80%,
            rgba(
                255,
                157,
                70,
                .1
            ),
            transparent 30%
        ),

        #f8f7f5;

}


.login-card {

    width:
        min(
            460px,
            100%
        );

    padding:
        42px;

    background:
        white;

    border:
        1px solid
        var(--border);

    border-radius:
        26px;

    box-shadow:
        var(--shadow);

}


.login-logo {

    width:
        58px;

    height:
        58px;

    display:
        grid;

    place-items:
        center;

    margin-bottom:
        24px;

    border-radius:
        17px;

    background:
        var(--orange-soft);

    font-size:
        28px;

}


.login-eyebrow {

    color:
        var(--orange);

    font-size:
        10px;

    font-weight:
        800;

    letter-spacing:
        1.8px;

}


.login-card h1 {

    margin-top:
        7px;

    font-size:
        31px;

    letter-spacing:
        -1.2px;

}


.login-card > p {

    margin-top:
        8px;

    color:
        var(--muted);

    font-size:
        12px;

    line-height:
        1.6;

}


.login-field {

    margin-top:
        22px;

}


.login-field label {

    display:
        block;

    margin-bottom:
        7px;

    font-size:
        11px;

    font-weight:
        700;

}


.login-field input {

    width:
        100%;

    height:
        49px;

    padding:
        0 15px;

    border:
        1px solid
        #dcdad6;

    border-radius:
        11px;

    outline:
        none;

    background:
        white;

}


.login-field input:focus {

    border-color:
        var(--orange);

    box-shadow:
        0 0 0 4px
        rgba(
            255,
            114,
            0,
            .07
        );

}


#loginButton {

    width:
        100%;

    min-height:
        50px;

    margin-top:
        22px;

    border:
        none;

    border-radius:
        11px;

    background:
        var(--orange);

    color:
        white;

    font-size:
        12px;

    font-weight:
        800;

}


#loginButton:hover {

    background:
        var(--orange-hover);

}


#loginMessage {

    min-height:
        18px;

    margin-top:
        12px;

    color:
        var(--red);

    font-size:
        11px;

    font-weight:
        600;

}



/* ========================================================
DASHBOARD
======================================================== */

.dashboard {

    min-height:
        100vh;

}


.admin-header {

    height:
        72px;

    position:
        sticky;

    top:
        0;

    z-index:
        50;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        20px;

    padding:
        0 30px;

    background:
        rgba(
            255,
            255,
            255,
            .95
        );

    backdrop-filter:
        blur(18px);

    border-bottom:
        1px solid
        var(--border);

}


.admin-brand {

    display:
        flex;

    align-items:
        center;

    gap:
        12px;

}


.admin-brand-icon {

    font-size:
        24px;

}


.admin-brand strong {

    display:
        block;

    font-size:
        14px;

}


.admin-brand span {

    display:
        block;

    margin-top:
        1px;

    color:
        var(--muted);

    font-size:
        9px;

    font-weight:
        600;

    letter-spacing:
        1px;

}


.header-actions {

    display:
        flex;

    align-items:
        center;

    gap:
        9px;

}


.header-button {

    min-height:
        39px;

    padding:
        0 14px;

    border:
        1px solid
        var(--border);

    border-radius:
        10px;

    background:
        white;

    color:
        var(--text);

    text-decoration:
        none;

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        10px;

    font-weight:
        700;

}


.header-button:hover {

    background:
        var(--surface-soft);

}


#logout {

    background:
        var(--text);

    color:
        white;

    border-color:
        var(--text);

}



/* ========================================================
ADMIN LAYOUT
======================================================== */

.admin-layout {

    width:
        min(
            1480px,
            100%
        );

    margin:
        auto;

    display:
        grid;

    grid-template-columns:
        240px 1fr;

    gap:
        0;

}


.admin-sidebar {

    min-height:
        calc(100vh - 72px);

    padding:
        30px 20px;

    border-right:
        1px solid
        var(--border);

    background:
        white;

}


.sidebar-title {

    padding:
        0 10px 12px;

    color:
        #a0a0a0;

    font-size:
        8px;

    font-weight:
        800;

    letter-spacing:
        1.5px;

}


.admin-tab-button {

    width:
        100%;

    display:
        flex;

    align-items:
        center;

    gap:
        11px;

    margin-bottom:
        5px;

    padding:
        12px 13px;

    border:
        none;

    border-radius:
        10px;

    background:
        transparent;

    color:
        #666;

    text-align:
        left;

    font-size:
        11px;

    font-weight:
        600;

}


.admin-tab-button:hover {

    background:
        #f7f6f4;

    color:
        var(--text);

}


.admin-tab-button.active {

    background:
        var(--orange-soft);

    color:
        var(--orange);

    font-weight:
        700;

}


.admin-content {

    min-width:
        0;

    padding:
        38px;

}



/* ========================================================
PAGE HEADINGS
======================================================== */

.page-heading {

    display:
        flex;

    align-items:
        flex-end;

    justify-content:
        space-between;

    gap:
        20px;

    margin-bottom:
        28px;

}


.page-heading span {

    color:
        var(--orange);

    font-size:
        9px;

    font-weight:
        800;

    letter-spacing:
        1.6px;

}


.page-heading h1 {

    margin-top:
        4px;

    font-size:
        32px;

    letter-spacing:
        -1.3px;

}


.page-heading p {

    margin-top:
        6px;

    color:
        var(--muted);

    font-size:
        11px;

}



/* ========================================================
CARDS
======================================================== */

.admin-card {

    margin-bottom:
        22px;

    padding:
        26px;

    border:
        1px solid
        var(--border);

    border-radius:
        19px;

    background:
        var(--surface);

}


.card-heading {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        15px;

    margin-bottom:
        21px;

}


.card-heading h2 {

    font-size:
        16px;

}


.card-heading p {

    margin-top:
        4px;

    color:
        var(--muted);

    font-size:
        10px;

}



/* ========================================================
FORMS
======================================================== */

.admin-form-grid {

    display:
        grid;

    grid-template-columns:
        repeat(
            3,
            minmax(
                0,
                1fr
            )
        );

    gap:
        15px;

}


.admin-field {

    min-width:
        0;

}


.admin-field.full-width {

    grid-column:
        1 / -1;

}


.admin-field label {

    display:
        block;

    margin-bottom:
        7px;

    color:
        #555;

    font-size:
        10px;

    font-weight:
        700;

}


.admin-field input,
.admin-field textarea,
.admin-field select {

    width:
        100%;

    min-height:
        44px;

    padding:
        10px 12px;

    border:
        1px solid
        #dedbd7;

    border-radius:
        10px;

    background:
        white;

    color:
        var(--text);

    outline:
        none;

    font-size:
        11px;

}


.admin-field textarea {

    min-height:
        100px;

    resize:
        vertical;

}


.admin-field input:focus,
.admin-field textarea:focus,
.admin-field select:focus {

    border-color:
        var(--orange);

    box-shadow:
        0 0 0 4px
        rgba(
            255,
            114,
            0,
            .06
        );

}


.checkbox-row {

    display:
        flex;

    align-items:
        center;

    gap:
        9px;

    margin-bottom:
        20px;

}


.checkbox-row input {

    width:
        17px;

    height:
        17px;

    accent-color:
        var(--orange);

}


.checkbox-row label {

    font-size:
        11px;

    font-weight:
        700;

}


.primary-admin-button {

    min-height:
        43px;

    padding:
        0 17px;

    border:
        none;

    border-radius:
        10px;

    background:
        var(--orange);

    color:
        white;

    font-size:
        10px;

    font-weight:
        800;

}


.primary-admin-button:hover {

    background:
        var(--orange-hover);

}


.save-row {

    display:
        flex;

    align-items:
        center;

    gap:
        14px;

    margin-top:
        20px;

}


#promotionMessage {

    font-size:
        10px;

    font-weight:
        700;

}



/* ========================================================
STATS
======================================================== */

.referral-stats {

    display:
        grid;

    grid-template-columns:
        repeat(
            4,
            1fr
        );

    gap:
        12px;

    margin-bottom:
        23px;

}


.referral-stat {

    padding:
        20px;

    border:
        1px solid
        var(--border);

    border-radius:
        16px;

    background:
        white;

}


.referral-stat span {

    display:
        block;

    color:
        #999;

    font-size:
        8px;

    font-weight:
        800;

    letter-spacing:
        1px;

}


.referral-stat strong {

    display:
        block;

    margin-top:
        6px;

    font-size:
        27px;

}



/* ========================================================
INVENTORY ITEMS
======================================================== */

.product-admin-card {

    display:
        grid;

    grid-template-columns:
        90px 1fr auto;

    gap:
        20px;

    align-items:
        center;

    padding:
        18px 0;

    border-bottom:
        1px solid
        var(--border);

}


.product-admin-card:last-child {

    border-bottom:
        none;

}


.admin-product-image {

    width:
        86px;

    height:
        86px;

    display:
        grid;

    place-items:
        center;

    border-radius:
        14px;

    background:
        #f6f5f3;

}


.admin-product-image img {

    width:
        70px;

    height:
        70px;

    object-fit:
        contain;

}


.product-edit-grid {

    display:
        grid;

    grid-template-columns:
        2fr .8fr .8fr 1fr 1.4fr;

    gap:
        9px;

}


.product-edit-grid input {

    width:
        100%;

    min-width:
        0;

    padding:
        10px;

    border:
        1px solid
        #e0ddd9;

    border-radius:
        9px;

    outline:
        none;

    font-size:
        10px;

}


.product-edit-grid input:focus {

    border-color:
        var(--orange);

}


.product-buttons {

    display:
        grid;

    gap:
        7px;

}


.small-button {

    min-width:
        80px;

    min-height:
        36px;

    padding:
        0 11px;

    border:
        none;

    border-radius:
        9px;

    font-size:
        9px;

    font-weight:
        800;

}


.save-button {

    background:
        var(--orange);

    color:
        white;

}


.delete-button {

    background:
        var(--red-soft);

    color:
        var(--red);

}



/* ========================================================
REFERRAL REQUESTS
======================================================== */

.referral-request {

    padding:
        20px 0;

    border-bottom:
        1px solid
        var(--border);

}


.referral-request:last-child {

    border-bottom:
        none;

}


.referral-request-top {

    display:
        flex;

    align-items:
        flex-start;

    justify-content:
        space-between;

    gap:
        20px;

}


.referral-request h3 {

    font-size:
        14px;

}


.referral-meta {

    display:
        flex;

    flex-wrap:
        wrap;

    gap:
        7px 20px;

    margin-top:
        11px;

    color:
        var(--muted);

    font-size:
        10px;

}


.admin-status {

    display:
        inline-flex;

    align-items:
        center;

    min-height:
        25px;

    padding:
        0 9px;

    border-radius:
        100px;

    font-size:
        8px;

    font-weight:
        800;

    letter-spacing:
        .5px;

}


.status-pending {

    background:
        var(--yellow-soft);

    color:
        var(--yellow);

}


.status-approved {

    background:
        var(--green-soft);

    color:
        var(--green);

}


.status-rejected {

    background:
        var(--red-soft);

    color:
        var(--red);

}


.status-rewarded {

    background:
        var(--blue-soft);

    color:
        var(--blue);

}


.action-row {

    display:
        flex;

    flex-wrap:
        wrap;

    gap:
        8px;

    margin-top:
        15px;

}


.action-button {

    min-height:
        35px;

    padding:
        0 12px;

    border:
        none;

    border-radius:
        8px;

    font-size:
        9px;

    font-weight:
        800;

}


.approve-button {

    background:
        var(--green-soft);

    color:
        var(--green);

}


.reject-button {

    background:
        var(--red-soft);

    color:
        var(--red);

}


.reward-button {

    background:
        var(--blue-soft);

    color:
        var(--blue);

}


.reset-button {

    background:
        #f2f2f2;

    color:
        #555;

}


.hard-delete-button {

    background:
        var(--red);

    color:
        white;

}



/* ========================================================
REFERRAL CODE CARDS
======================================================== */

.referral-code-card {

    display:
        grid;

    grid-template-columns:
        1fr auto;

    gap:
        20px;

    padding:
        20px 0;

    border-bottom:
        1px solid
        var(--border);

}


.referral-code-card:last-child {

    border-bottom:
        none;

}


.referral-code {

    color:
        var(--orange);

    font-size:
        22px;

    font-weight:
        800;

    letter-spacing:
        1.5px;

}


.referral-code-name {

    margin-top:
        3px;

    font-size:
        12px;

    font-weight:
        700;

}


.referral-code-meta {

    display:
        flex;

    flex-wrap:
        wrap;

    gap:
        8px 20px;

    margin-top:
        10px;

    color:
        var(--muted);

    font-size:
        9px;

}


.code-buttons {

    display:
        flex;

    align-items:
        center;

    gap:
        7px;

}



/* ========================================================
EMPTY / LOADING
======================================================== */

.admin-empty {

    padding:
        35px 10px;

    color:
        #999;

    text-align:
        center;

    font-size:
        11px;

}



/* ========================================================
MOBILE
======================================================== */

@media(
    max-width:
    1050px
) {

    .admin-layout {

        grid-template-columns:
            1fr;

    }


    .admin-sidebar {

        min-height:
            auto;

        display:
            flex;

        gap:
            7px;

        padding:
            14px 20px;

        overflow-x:
            auto;

        border-right:
            none;

        border-bottom:
            1px solid
            var(--border);

    }


    .sidebar-title {

        display:
            none;

    }


    .admin-tab-button {

        width:
            auto;

        min-width:
            max-content;

        margin:
            0;

    }


    .product-admin-card {

        grid-template-columns:
            75px 1fr;

    }


    .product-buttons {

        grid-column:
            1 / -1;

        display:
            flex;

    }


    .product-edit-grid {

        grid-template-columns:
            repeat(
                2,
                1fr
            );

    }

}


@media(
    max-width:
    760px
) {

    .admin-header {

        padding:
            0 15px;

    }


    .admin-brand strong {

        font-size:
            12px;

    }


    .header-button {

        padding:
            0 9px;

    }


    .admin-content {

        padding:
            24px 15px;

    }


    .page-heading {

        align-items:
            flex-start;

        flex-direction:
            column;

    }


    .admin-form-grid {

        grid-template-columns:
            1fr;

    }


    .admin-field.full-width {

        grid-column:
            auto;

    }


    .referral-stats {

        grid-template-columns:
            repeat(
                2,
                1fr
            );

    }


    .product-admin-card {

        grid-template-columns:
            1fr;

    }


    .admin-product-image {

        width:
            100%;

        height:
            120px;

    }


    .product-edit-grid {

        grid-template-columns:
            1fr;

    }


    .referral-request-top,
    .referral-code-card {

        grid-template-columns:
            1fr;

        flex-direction:
            column;

    }


    .code-buttons {

        margin-top:
            10px;

    }

}

</style>

</head>


<body>


<!-- =====================================================
LOGIN
===================================================== -->

<div
    id="loginBox"
    class="login-page"
>

<div class="login-card">

<div class="login-logo">

🍬

</div>

<div class="login-eyebrow">

OWNER ACCESS

</div>

<h1>

Admin Dashboard

</h1>

<p>

Manage inventory, promotions, referrals, and customer rewards.

</p>


<div class="login-field">

<label for="username">

Username

</label>

<input
    id="username"
    type="text"
    autocomplete="username"
>

</div>


<div class="login-field">

<label for="password">

Password

</label>

<input
    id="password"
    type="password"
    autocomplete="current-password"
>

</div>


<button
    id="loginButton"
    type="button"
>

Log In

</button>


<div id="loginMessage">

</div>

</div>

</div>




<!-- =====================================================
DASHBOARD
===================================================== -->

<div
    id="dashboard"
    class="dashboard hidden"
>


<header class="admin-header">


<div class="admin-brand">

<div class="admin-brand-icon">

🍬

</div>

<div>

<strong>

Grayson's Snack Shop

</strong>

<span>

ADMIN DASHBOARD

</span>

</div>

</div>


<div class="header-actions">

<a
    href="index.html"
    class="header-button"
>

View Shop

</a>

<button
    id="logout"
    class="header-button"
    type="button"
>

Log Out

</button>

</div>

</header>




<div class="admin-layout">


<!-- SIDEBAR -->

<aside class="admin-sidebar">

<div class="sidebar-title">

MANAGEMENT

</div>


<button
    id="inventoryTabButton"
    class="admin-tab-button active"
    type="button"
>

<span>
📦
</span>

Inventory

</button>


<button
    id="promotionsTabButton"
    class="admin-tab-button"
    type="button"
>

<span>
🎁
</span>

Promotions & Referrals

</button>

</aside>




<main class="admin-content">


<!-- =================================================
INVENTORY TAB
================================================= -->

<div
    id="inventoryTab"
    class="admin-tab-panel"
>


<div class="page-heading">

<div>

<span>
STORE MANAGEMENT
</span>

<h1>

Inventory

</h1>

<p>

Add products and update live customer stock.

</p>

</div>

</div>



<div class="admin-card">

<div class="card-heading">

<div>

<h2>

Add Product

</h2>

<p>

Create a new item in the shop.

</p>

</div>

</div>


<div class="admin-form-grid">


<div class="admin-field">

<label for="newName">

Product Name

</label>

<input
    id="newName"
    placeholder="Taki Red Fiesta"
>

</div>


<div class="admin-field">

<label for="newPrice">

Price

</label>

<input
    id="newPrice"
    type="number"
    min="0"
    step="0.01"
    placeholder="8.00"
>

</div>


<div class="admin-field">

<label for="newStock">

Stock

</label>

<input
    id="newStock"
    type="number"
    min="0"
    step="1"
    placeholder="10"
>

</div>


<div class="admin-field">

<label for="newRestock">

Restock Date

</label>

<input
    id="newRestock"
    placeholder="8/15/2026"
>

</div>


<div class="admin-field">

<label for="newImage">

Image Filename

</label>

<input
    id="newImage"
    placeholder="product.png"
>

</div>


</div>


<div class="save-row">

<button
    id="addProduct"
    class="primary-admin-button"
    type="button"
>

Add Product

</button>

</div>

</div>



<div class="admin-card">

<div class="card-heading">

<div>

<h2>

Current Products

</h2>

<p>

Changes update Firestore and the customer shop.

</p>

</div>

</div>


<div id="adminProducts">

<div class="admin-empty">

Loading products...

</div>

</div>

</div>


</div>




<!-- =================================================
PROMOTIONS TAB
================================================= -->

<div
    id="promotionsTab"
    class="admin-tab-panel hidden"
>


<div class="page-heading">

<div>

<span>
REWARDS PROGRAM
</span>

<h1>

Promotions & Referrals

</h1>

<p>

Control the promotion and review customer referrals.

</p>

</div>

</div>



<!-- PROMOTION SETTINGS -->

<div class="admin-card">

<div class="card-heading">

<div>

<h2>

Current Promotion

</h2>

<p>

This controls what customers see on the main website.

</p>

</div>

</div>


<div class="checkbox-row">

<input
    id="promotionActive"
    type="checkbox"
>

<label for="promotionActive">

Promotion Active

</label>

</div>


<div class="admin-form-grid">


<div class="admin-field">

<label for="promotionName">

Promotion Name

</label>

<input
    id="promotionName"
    placeholder="Bring a Friend"
>

</div>


<div class="admin-field">

<label for="promotionStart">

Start Date

</label>

<input
    id="promotionStart"
    type="date"
>

</div>


<div class="admin-field">

<label for="promotionEnd">

End Date

</label>

<input
    id="promotionEnd"
    type="date"
>

</div>


<div class="admin-field">

<label for="promotionQualifyingProduct">

Qualifying Product

</label>

<input
    id="promotionQualifyingProduct"
    list="inventoryProductNames"
    placeholder="Product friend must buy"
>

</div>


<div class="admin-field">

<label for="promotionRewardProduct">

Reward Product

</label>

<input
    id="promotionRewardProduct"
    list="inventoryProductNames"
    placeholder="Reward"
>

</div>


<div class="admin-field">

<label for="promotionRewardQuantity">

Reward Quantity

</label>

<input
    id="promotionRewardQuantity"
    type="number"
    min="1"
    step="1"
    value="1"
>

</div>


<div class="admin-field full-width">

<label for="promotionDescription">

Description

</label>

<textarea
    id="promotionDescription"
    placeholder="Explain how the promotion works..."
></textarea>

</div>


</div>


<datalist id="inventoryProductNames">

</datalist>


<div class="save-row">

<button
    id="savePromotion"
    class="primary-admin-button"
    type="button"
>

Save Promotion

</button>

<span id="promotionMessage">

</span>

</div>

</div>



<!-- REFERRAL STATS -->

<div class="referral-stats">


<div class="referral-stat">

<span>
PENDING REQUESTS
</span>

<strong id="pendingReferralCount">

0

</strong>

</div>


<div class="referral-stat">

<span>
APPROVED
</span>

<strong id="approvedReferralCount">

0

</strong>

</div>


<div class="referral-stat">

<span>
REWARDS TO GIVE
</span>

<strong id="outstandingRewardCount">

0

</strong>

</div>


<div class="referral-stat">

<span>
REFERRAL CODES
</span>

<strong id="totalReferralCodes">

0

</strong>

</div>


</div>



<!-- REFERRAL REQUESTS -->

<div class="admin-card">

<div class="card-heading">

<div>

<h2>

Referral Purchase Requests

</h2>

<p>

Approve, reject, reward, or completely delete submissions.

</p>

</div>

</div>


<div id="referralRequests">

<div class="admin-empty">

Loading referral requests...

</div>

</div>

</div>



<!-- REFERRAL CODES -->

<div class="admin-card">

<div class="card-heading">

<div>

<h2>

Referral Codes

</h2>

<p>

Customers can now create multiple codes for different friends.

</p>

</div>

</div>


<div id="referralCodes">

<div class="admin-empty">

Loading referral codes...

</div>

</div>

</div>


</div>


</main>

</div>

</div>


<script
    type="module"
    src="admin.js"
></script>

</body>

</html>
