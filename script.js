/*
==========================================================
Grayson's Snack Shop
script.js
==========================================================
*/

const productContainer = document.getElementById("productContainer");
const inventoryTable = document.getElementById("inventoryTable");
const searchInput = document.getElementById("searchInput");
const totalProducts = document.getElementById("totalProducts");
const itemsInStock = document.getElementById("itemsInStock");
const darkButton = document.getElementById("darkModeButton");

// Money format
function money(amount) {
    return "$" + Number(amount).toFixed(2);
}

// Stock status
function getStatus(product) {

    if (product.stock <= 0) {
        return {
            text: "Out of Stock",
            class: "out-stock"
        };
    }

    if (product.stock <= 5) {
        return {
            text: "Low Stock",
            class: "low-stock"
        };
    }

    return {
        text: "In Stock",
        class: "in-stock"
    };
}

// Create Product Card
function createProduct(product) {

    const status = getStatus(product);

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `

        <div class="product-image">
            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.src='https://placehold.co/120x120?text=No+Image'"
            >
        </div>

        <div class="product-info">

            <h3>${product.name}</h3>

            <div class="product-price">
                ${money(product.price)}
            </div>

            <div class="product-stock">
                Available: ${product.stock}
            </div>

            <span class="badge ${status.class}">
                ${status.text}
            </span>

            <p style="margin-top:15px;">
                Restock Date:
                <strong>${product.restock}</strong>
            </p>

        </div>

    `;

    productContainer.appendChild(card);

}

// Inventory Table
function createTableRow(product) {

    const status = getStatus(product);

    const row = document.createElement("tr");

    row.innerHTML = `

        <td>${product.name}</td>

        <td>${money(product.price)}</td>

        <td>${product.stock}</td>

        <td>
            <span class="badge ${status.class}">
                ${status.text}
            </span>
        </td>

        <td>${product.restock}</td>

    `;

    inventoryTable.appendChild(row);

}

// Update Stats
function updateStats(products) {

    let total = 0;

    products.forEach(product => {
        total += Number(product.stock);
    });

    totalProducts.textContent = products.length;
    itemsInStock.textContent = total;

}

// Display Products
function displayProducts(products) {

    productContainer.innerHTML = "";
    inventoryTable.innerHTML = "";

    products.forEach(product => {

        createProduct(product);
        createTableRow(product);

    });

    updateStats(products);

}

// Search
searchInput.addEventListener("input", () => {

    const text = searchInput.value.toLowerCase();

    const filtered = inventory.filter(product =>
        product.name.toLowerCase().includes(text)
    );

    displayProducts(filtered);

});

// Dark Mode
if (localStorage.getItem("darkMode") === "enabled") {

    document.body.classList.add("dark");
    darkButton.textContent = "☀️";

}

darkButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("darkMode", "enabled");
        darkButton.textContent = "☀️";

    } else {

        localStorage.setItem("darkMode", "disabled");
        darkButton.textContent = "🌙";

    }

});

// Load Website
displayProducts(inventory);

console.log("Grayson's Snack Shop Loaded");
