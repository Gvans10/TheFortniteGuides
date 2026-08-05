/*
==========================================================
Grayson's Snack Shop
admin.js
Admin Dashboard
==========================================================
*/


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







// Login

loginButton.addEventListener("click",()=>{


    const username = document.getElementById("username").value;


    const password = document.getElementById("password").value;




    if(
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ){


        loginBox.classList.add("hidden");


        dashboard.classList.remove("hidden");


        loadAdminProducts();


    }


    else{


        loginMessage.textContent =

        "Incorrect login";


    }



});







// Load products

function loadAdminProducts(){


    adminProducts.innerHTML="";



    inventory.forEach(product=>{


        const box = document.createElement("div");


        box.className="admin-product";



        box.innerHTML = `


        <h3>

        ${product.icon} ${product.name}

        </h3>



        <label>
        Price
        </label>

        <input

        id="price-${product.id}"

        value="${product.price}"

        type="number"

        >



        <label>
        Stock
        </label>

        <input

        id="stock-${product.id}"

        value="${product.stock}"

        type="number"

        >




        <label>
        Restock Date
        </label>


        <input

        id="restock-${product.id}"

        value="${product.restock}"

        >




        <button onclick="saveProduct(${product.id})">

        Save

        </button>



        <button onclick="deleteProduct(${product.id})">

        Delete

        </button>



        `;



        adminProducts.appendChild(box);



    });



}









// Save changes

window.saveProduct = function(id){


    const product = inventory.find(

        item=>item.id === id

    );



    product.price = Number(

        document.getElementById(

        `price-${id}`

        ).value

    );



    product.stock = Number(

        document.getElementById(

        `stock-${id}`

        ).value

    );



    product.restock = document.getElementById(

        `restock-${id}`

    ).value;





    saveInventory(inventory);



    alert("Product Updated");


};









// Delete product

window.deleteProduct = function(id){


    inventory = inventory.filter(

        product=>product.id !== id

    );



    saveInventory(inventory);



    loadAdminProducts();


};









// Add product

addButton.addEventListener("click",()=>{


    const newProduct = {


        id: Date.now(),


        name: document.getElementById("newName").value,


        price: Number(

            document.getElementById("newPrice").value

        ),


        stock: Number(

            document.getElementById("newStock").value

        ),


        restock: document.getElementById("newRestock").value,


        icon: document.getElementById("newIcon").value



    };



    inventory.push(newProduct);



    saveInventory(inventory);



    loadAdminProducts();



    alert("Product Added");



});









// Logout

logoutButton.addEventListener("click",()=>{


    dashboard.classList.add("hidden");


    loginBox.classList.remove("hidden");


    document.getElementById("password").value="";


});
