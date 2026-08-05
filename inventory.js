/*
==========================================================
Grayson's Snack Shop
inventory.js
Shared Product Storage
==========================================================
*/

const defaultInventory = [

    {
        id: 1,
        name: "Taki Red Fiesta",
        price: 8.00,
        stock: 8,
        restock: "8/9/2026",
        image: "redtakifiesta.png"
    },

    {
        id: 2,
        name: "Taki Blue Fiesta",
        price: 8.00,
        stock: 8,
        restock: "8/9/2026",
        image: "bluetakifiesta.png"
    },

    {
        id: 3,
        name: "Taki Red 1oz Bag",
        price: 1.00,
        stock: 50,
        restock: "8/9/2026",
        image: "redtakismall.png"
    },

    {
        id: 4,
        name: "Taki Blue 1oz Bag",
        price: 1.00,
        stock: 50,
        restock: "8/9/2026",
        image: "bluetakismall.png"
    },

    {
        id: 5,
        name: "Blue Nerd Clusters 8oz Bag",
        price: 5.00,
        stock: 5,
        restock: "8/9/2026",
        image: "bluenerdcluster.png"
    },

    {
        id: 6,
        name: "Mike N Ike 5oz Box",
        price: 3.00,
        stock: 4,
        restock: "8/9/2026",
        image: "mikenike.png"
    },

    {
        id: 7,
        name: "Red Bull White",
        price: 6.00,
        stock: 4,
        restock: "8/9/2026",
        image: "redbullwhite.png"
    },

    {
        id: 8,
        name: "Red Bull Red",
        price: 6.00,
        stock: 4,
        restock: "8/9/2026",
        image: "redbullred.png"
    },

    {
        id: 9,
        name: "Arizona Mango Can",
        price: 2.00,
        stock: 4,
        restock: "8/9/2026",
        image: "arizonamango.png"
    },

    {
        id: 10,
        name: "Arizona Fruit Punch Can",
        price: 2.00,
        stock: 4,
        restock: "8/9/2026",
        image: "arizonafruitpunch.png"
    }

];

function loadInventory() {

    const saved = localStorage.getItem("snackInventory");

    if (saved) {
        return JSON.parse(saved);
    }

    localStorage.setItem(
        "snackInventory",
        JSON.stringify(defaultInventory)
    );

    return defaultInventory;
}

function saveInventory(products) {

    localStorage.setItem(
        "snackInventory",
        JSON.stringify(products)
    );

}

let inventory = loadInventory();
