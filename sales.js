
let orders = [];


const addOrderForm = document.getElementById("addOrderForm");
const productCategoryInput = document.getElementById("productCategory");
const quantityOrderedInput = document.getElementById("quantityOrdered");
const premiumWeightInput = document.getElementById("premiumWeight");
const orderList = document.getElementById("orderList");
const totalWeightElement = document.getElementById("totalWeight");
const customerNameInput = document.getElementById("customerName");
const customerContactInput = document.getElementById("customerContact");
const shippingAddressInput = document.getElementById("shippingAddress");


productCategoryInput.addEventListener("change", () => {
    if (productCategoryInput.value === "Premium") {
        premiumWeightInput.style.display = "block";
        premiumWeightInput.required = true;
    } else {
        premiumWeightInput.style.display = "none";
        premiumWeightInput.required = false;
        premiumWeightInput.value = ""; 
    }
});


addOrderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const category = productCategoryInput.value;
    const quantity = parseInt(quantityOrderedInput.value.trim());
    const customerName = customerNameInput.value.trim();
    const customerContact = customerContactInput.value.trim();
    const shippingAddress = shippingAddressInput.value.trim();

    let weightPerPackage = 0;
    if (category === "Small") {
        weightPerPackage = 100;
    } else if (category === "Medium") {
        weightPerPackage = 250;
    } else if (category === "Large") {
        weightPerPackage = 500;
    } else if (category === "Extra Large") {
        weightPerPackage = 1000;
    } else if (category === "Family Pack") {
        weightPerPackage = 2000;
    } else if (category === "Bulk Pack") {
        weightPerPackage = 5000;
    } else if (category === "Premium") {
        weightPerPackage = parseInt(premiumWeightInput.value.trim());
        if (isNaN(weightPerPackage) || weightPerPackage <= 0) {
            alert("Please enter a valid weight for Premium packages.");
            return;
        }
    }

    if (isNaN(quantity) || quantity <= 0 || !customerName || !customerContact || !shippingAddress) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const totalWeightNeeded = quantity * weightPerPackage;


    const item = inventory.find((item) => item.category === category);
    if (!item || item.quantity < totalWeightNeeded) {
        alert(`Not enough stock for ${category}. Available: ${item ? item.quantity : 0} g.`);
        return;
    }

   
    removeStock(category, totalWeightNeeded);

   
    const newOrder = {
        id: orders.length + 1,
        category,
        quantity,
        weightPerPackage,
        totalWeight: totalWeightNeeded,
        customerName,
        customerContact,
        shippingAddress,
        status: "Pending",
        date: new Date().toISOString(),
    };
    orders.push(newOrder);

 
    displayOrders();
    saveOrders();
});


function displayOrders() {
    orderList.innerHTML = "";

    if (orders.length === 0) {
        orderList.innerHTML = "<p>No orders available.</p>";
        return;
    }

    orders.forEach((order) => {
        orderList.innerHTML += `
            <div class="order-item">
                <h4>Order ID: ${order.id}</h4>
                <p>Customer: ${order.customerName} (${order.customerContact})</p>
                <p>Shipping Address: ${order.shippingAddress}</p>
                <p>Category: ${order.category}</p>
                <p>Quantity: ${order.quantity} packages</p>
                <p>Weight per Package: ${order.weightPerPackage} g</p>
                <p>Total Weight: ${order.totalWeight} g</p>
                <p>Status: ${order.status}</p>
                <p>Date: ${new Date(order.date).toLocaleString()}</p>
                <button onclick="updateOrderStatus(${order.id})">Update Status</button>
            </div>
        `;
    });
}


function updateOrderStatus(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
        alert("Order not found.");
        return;
    }

    const newStatus = prompt("Enter new status (Pending, Processed, Shipped, Delivered):", order.status);
    if (newStatus && ["Pending", "Processed", "Shipped", "Delivered"].includes(newStatus)) {
        order.status = newStatus;
        saveOrders();
        displayOrders();
    } else {
        alert("Invalid status entered.");
    }
}


function initializeSales() {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    orders = savedOrders;
    displayOrders();
}


function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}


initializeSales();
