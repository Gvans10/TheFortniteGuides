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
        icon: "🌶️"
    },


    {
        id: 2,
        name: "Taki Blue Fiesta",
        price: 8.00,
        stock: 8,
        restock: "8/9/2026",
        icon: "🔵"
    },


    {
        id: 3,
        name: "Taki Red 1oz Bag",
        price: 1.00,
        stock: 50,
        restock: "8/9/2026",
        icon: "🌶️"
    },


    {
        id: 4,
        name: "Taki Blue 1oz Bag",
        price: 1.00,
        stock: 50,
        restock: "8/9/2026",
        icon: "🔵"
    },


    {
        id: 5,
        name: "Blue Nerd Clusters 8oz Bag",
        price: 5.00,
        stock: 5,
        restock: "8/9/2026",
        icon: "🍬"
    },


    {
        id: 6,
        name: "Mike N Ike 5oz Box",
        price: 3.00,
        stock: 4,
        restock: "8/9/2026",
        icon: "🍭"
    },


    {
        id: 7,
        name: "Red Bull White",
        price: 6.00,
        stock: 4,
        restock: "8/9/2026",
        icon: "🥤"
    },


    {
        id: 8,
        name: "Red Bull Red",
        price: 6.00,
        stock: 4,
        restock: "8/9/2026",
        icon: "🔴"
    },


    {
        id: 9,
        name: "Arizona Mango Can",
        price: 2.00,
        stock: 4,
        restock: "8/9/2026",
        icon: "🥭"
    },


    {
        id: 10,
        name: "Arizona Fruit Punch Can",
        price: 2.00,
        stock: 4,
        restock: "8/9/2026",
        icon: "🍒"
    }

];





// Load inventory from browser storage

function loadInventory(){

    let saved = localStorage.getItem("snackInventory");


    if(saved){

        return JSON.parse(saved);

    }


    localStorage.setItem(

        "snackInventory",

        JSON.stringify(defaultInventory)

    );


    return defaultInventory;

}





// Save inventory changes

function saveInventory(products){

    localStorage.setItem(

        "snackInventory",

        JSON.stringify(products)

    );

}





// This is what script.js and admin.js use

let inventory = loadInventory();
