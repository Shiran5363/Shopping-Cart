let totalPrice = 0;
const baseShippingCost = 0;
let shippingCost = baseShippingCost;

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://fakestoreapi.com/products") 
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
            loadSavedData();
        })
        .catch(error => console.error("Error fetching products:", error));
});

function displayProducts(products) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = ""; // Clear existing products
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product", "col-md-4");

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>Price: $${product.price}</p>
            <div class="quantity">
                <input type="number" min="0" value="0" class="quantity-input" onchange="updateTotal()">
                <button class="remove-button" onclick="removeProduct(this, ${product.price})">Remove Product</button>
            </div>
        `;

        productsContainer.appendChild(productDiv);
    });
    updateSummary();
}

function updateTotal() {
    totalPrice = 0;
    let productCount = 0;
    const products = document.querySelectorAll(".product");
    products.forEach(product => {
        const quantityInput = product.querySelector(".quantity-input");
        const price = parseFloat(product.querySelector("p").innerText.split('$')[1]);
        const quantity = parseInt(quantityInput.value);
        totalPrice += price * quantity;
        productCount += quantity;
    });
    
    if (productCount >= 4) {
        shippingCost = 15;
    } else if (productCount >= 1) {
        shippingCost = 10;
    } else {
        shippingCost = 0;
    }
    
    updateSummary();
    saveData();
}

function removeProduct(button, price) {
    const productDiv = button.closest('.product');
    productDiv.remove();
    updateTotal();
}

function updateSummary() {
    const totalPriceElement = document.getElementById("total-price");
    const finalTotalElement = document.getElementById("final-total");
    const shippingCostElement = document.getElementById("shipping-cost");

    totalPriceElement.innerText = totalPrice.toFixed(2);
    shippingCostElement.innerText = shippingCost.toFixed(2);
    finalTotalElement.innerText = (totalPrice + shippingCost).toFixed(2);
}

function saveData() {
    const products = document.querySelectorAll(".product");
    const quantities = Array.from(products).map(product => {
        const quantityInput = product.querySelector(".quantity-input");
        return parseInt(quantityInput.value);
    });
    localStorage.setItem("quantities", JSON.stringify(quantities));
}

function loadSavedData() {
    const quantities = JSON.parse(localStorage.getItem("quantities"));
    if (quantities) {
        const products = document.querySelectorAll(".product");
        products.forEach((product, index) => {
            const quantityInput = product.querySelector(".quantity-input");
            quantityInput.value = quantities[index] || 0; // Default to 0 if not found
        });
        updateTotal();
    }
}
