/*
==========================================================
Grayson's Snack Shop
admin.js
Firebase Admin Dashboard
==========================================================
*/

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



// CHANGE YOUR LOGIN HERE

const ADMIN_USERNAME = "60340276";
const ADMIN_PASSWORD = "5527GSS02";




// Elements

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const adminProducts = document.getElementById("adminProducts");
const logoutButton = document.getElementById("logout");
const addButton = document.getElementById("addProduct");




// Store products locally after loading

let products = [];




// Login

loginButton.addEventListener("click", () => {


    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;



    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {


        loginBox.classList.add("hidden");

        dashboard.classList.remove("hidden");


        loadAdminProducts();


    }

    else {


        loginMessage.textContent = "Incorrect login";


    }


});







// Get products from Firebase

async function loadAdminProducts() {


    adminProducts.innerHTML = "";

    products = [];


    const snapshot = await getDocs(
        collection(db, "inventory")
    );



    snapshot.forEach((item) => {


        products.push({

            id: item.id,

            ...item.data()

        });


    });



    products.forEach(product => {


        createAdminCard(product);


    });


}







// Create admin product card

function createAdminCard(product) {


    const box = document.createElement("div");


    box.className = "admin-product";



    box.innerHTML = `


        <div class="product-image">

            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.src='https://placehold.co/100x100?text=No+Image'"
            >

        </div>



        <h3>
            ${product.name}
        </h3>



        <label>
            Image Filename
        </label>


        <input
            id="image-${product.id}"
            value="${product.image || ""}"
        >




        <label>
            Price
        </label>


        <input
            id="price-${product.id}"
            type="number"
            value="${product.price}"
        >




        <label>
            Stock
        </label>


        <input
            id="stock-${product.id}"
            type="number"
            value="${product.stock}"
        >




        <label>
            Restock Date
        </label>


        <input
            id="restock-${product.id}"
            value="${product.restock || ""}"
        >




        <button onclick="saveProduct('${product.id}')">

            Save

        </button>




        <button onclick="deleteProduct('${product.id}')">

            Delete

        </button>


    `;



    adminProducts.appendChild(box);


}









// Save Product

window.saveProduct = async function(id) {


    await updateDoc(

        doc(db, "inventory", id),

        {

            image:
            document.getElementById(
                `image-${id}`
            ).value,


            price:
            Number(
                document.getElementById(
                    `price-${id}`
                ).value
            ),


            stock:
            Number(
                document.getElementById(
                    `stock-${id}`
                ).value
            ),


            restock:
            document.getElementById(
                `restock-${id}`
            ).value

        }

    );



    alert("Product Updated");


    loadAdminProducts();


};









// Delete Product

window.deleteProduct = async function(id) {


    await deleteDoc(

        doc(db, "inventory", id)

    );



    loadAdminProducts();


};









// Add Product

addButton.addEventListener("click", async () => {



    const newProduct = {


        name:
        document.getElementById("newName").value,



        price:
        Number(
            document.getElementById("newPrice").value
        ),



        stock:
        Number(
            document.getElementById("newStock").value
        ),



        restock:
        document.getElementById("newRestock").value,



        image:
        document.getElementById("newImage").value


    };




    await addDoc(

        collection(db, "inventory"),

        newProduct

    );




    alert("Product Added");



    loadAdminProducts();


});









// Logout

logoutButton.addEventListener("click", () => {


    dashboard.classList.add("hidden");


    loginBox.classList.remove("hidden");


    document.getElementById("password").value = "";


});
