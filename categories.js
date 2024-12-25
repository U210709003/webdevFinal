// product datas
let products = [];
let totalWeight = 0; // total weight in g

// references for dom elements
const addProductForm = document.getElementById("addProductForm");
const productNameInput = document.getElementById("productName");
const productWeightInput = document.getElementById("productWeight");
const premiumOptions = document.getElementById("premiumOptions");
const premiumWeightInput = document.getElementById("premiumWeight");
const productList = document.getElementById("productList");
const logisticsReportButton = document.getElementById("generateLogisticsReport");
const logisticsReportOutput = document.getElementById("logisticsReportOutput");
const totalWeightElement = document.getElementById("totalWeight");

// load total weight from purchases
function loadTotalWeightFromPurchases() {
    const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
    totalWeight = purchases.reduce((sum, purchase) => sum + purchase.quantity * 1000, 0); // convert kg to g
    updateTotalWeight();
}

// updates the total weight displayed
function updateTotalWeight() {
    totalWeightElement.textContent = (totalWeight / 1000).toFixed(2); // convert to kg and display
}

// load products from localstorage
function loadProducts() {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    products = savedProducts;
    displayProducts();
    updateCategoryCounts();
}

// save products to localstorage
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

// add new product package
addProductForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = productNameInput.value.trim();
    const weight = parseFloat(productWeightInput.value.trim());

    // validate product name and weight
    if (!name || isNaN(weight) || weight <= 0) {
        alert("please enter valid product name and positive weight bigger than zero.");
        return;
    }

    // check for premium category
    let category;
    if (weight === 100) {
        category = "Small";
    } else if (weight === 250) {
        category = "Medium";
    } else if (weight === 500) {
        category = "Large";
    } else if (weight === 1000) {
        category = "Extra Large";
    } else if (weight === 2000) {
        category = "Family Pack";
    } else if (weight === 5000) {
        category = "Bulk Pack";
    } else {
        category = "Premium";
        const customWeight = parseFloat(premiumWeightInput.value.trim());
        if (!customWeight || customWeight <= 0 || customWeight > 10000) {
            alert("please enter valid custom weight for premium (1g - 10kg)");
            return;
        }
        weight = customWeight;
    }

    // check if enough stock is availible
    if (weight > totalWeight) {
        alert("not enuf blueberries available for this package.");
        return;
    }

    // create new product and update stock
    const newProduct = { name, weight, category };
    products.push(newProduct);
    totalWeight -= weight; // reduce stock
    updateCategoryCounts();
    displayProducts();
    updateTotalWeight();
    saveProducts(); // save updated products
    addProductForm.reset();
});

// count items in each category
function updateCategoryCounts() {
    const counts = {
        Small: 0,
        Medium: 0,
        Large: 0,
        "Extra Large": 0,
        "Family Pack": 0,
        "Bulk Pack": 0,
        Premium: 0,
    };

    products.forEach((product) => {
        counts[product.category]++;
    });

    smallCount.textContent = counts.Small;
    mediumCount.textContent = counts.Medium;
    largeCount.textContent = counts.Large;
    extraLargeCount.textContent = counts["Extra Large"];
    familyPackCount.textContent = counts["Family Pack"];
    bulkPackCount.textContent = counts["Bulk Pack"];
    premiumCount.textContent = counts.Premium;
}

// show/hide premium weight input field
productWeightInput.addEventListener("input", () => {
    const weight = parseFloat(productWeightInput.value.trim());
    if (!isNaN(weight) && weight !== 100 && weight !== 250 && weight !== 500 && weight !== 1000 && weight !== 2000 && weight !== 5000) {
        premiumOptions.style.display = "block";
    } else {
        premiumOptions.style.display = "none";
        premiumWeightInput.value = ""; // clear field
    }
});

// display all products in the list
function displayProducts() {
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = "<p>no products availible</p>";
        return;
    }

    products.forEach((product) => {
        productList.innerHTML += `
            <div class="product-item">
                <h4>${product.name}</h4>
                <p>weight: ${product.weight}g</p>
                <p>category: ${product.category}</p>
            </div>
        `;
    });
}


loadTotalWeightFromPurchases();
loadProducts();
updateTotalWeight();
