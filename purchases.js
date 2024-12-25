

let purchases = [];


const addPurchaseForm = document.getElementById("addPurchaseForm");
const purchaseList = document.getElementById("purchaseList");
const filterSection = document.getElementById("filterSection");
const summarySection = document.getElementById("summarySection");
const searchFarmerId = document.getElementById("searchFarmerId");
const filterStartDate = document.getElementById("filterStartDate");
const filterEndDate = document.getElementById("filterEndDate");
const sortDateButton = document.getElementById("sortDateButton");
const sortAmountButton = document.getElementById("sortAmountButton");
const sortFarmerButton = document.getElementById("sortFarmerButton");
const clearFiltersButton = document.getElementById("clearFiltersButton");
const generateSummaryButton = document.getElementById("generateSummaryButton");
const summaryOutput = document.getElementById("summaryOutput");
const viewPurchasesButton = document.getElementById("viewPurchasesButton");


function loadPurchases() {
  const savedPurchases = localStorage.getItem("purchases");
  if (savedPurchases) {
    purchases = JSON.parse(savedPurchases);
  } else {
    purchases = [];
    savePurchases();
  }
}


function savePurchases() {
  localStorage.setItem("purchases", JSON.stringify(purchases));
}


function displayPurchases(filteredPurchases = null) {
  const list = filteredPurchases || purchases;
  purchaseList.innerHTML = "";

  if (list.length === 0) {
    purchaseList.innerHTML = "<p>No purchases available.</p>";
    return;
  }

  list.forEach((purchase) => {
    purchaseList.innerHTML += `
      <div class="purchase-item">
        <h3>Purchase ID: ${purchase.id}</h3>
        <p>Farmer ID: ${purchase.farmerId}</p>
        <p>Date: ${purchase.date}</p>
        <p>Quantity: ${purchase.quantity || 0} kg</p>
        <p>Price per kg: $${purchase.pricePerKg?.toFixed(2) || 0}</p>
        <p>Total Cost: $${purchase.totalCost?.toFixed(2) || 0}</p>
        <button onclick="deletePurchase(${purchase.id})">Delete</button>
        <button onclick="updatePurchase(${purchase.id})">Update</button>
      </div>
    `;
  });
}


addPurchaseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = parseInt(document.getElementById("purchaseId").value.trim());
  const farmerId = parseInt(document.getElementById("farmerId").value.trim());
  const date = document.getElementById("purchaseDate").value;
  const quantity = parseInt(document.getElementById("quantity").value.trim());
  const pricePerKg = parseFloat(document.getElementById("pricePerKg").value.trim());
  const category = document.getElementById("category").value.trim();

  if (!id || !farmerId || !date || !quantity || quantity <= 0 || !pricePerKg || pricePerKg <= 0 || !category) {
    alert("All fields are required and must have valid values!");
    return;
  }

  if (purchases.some((purchase) => purchase.id === id)) {
    alert("Purchase ID must be unique.");
    return;
  }

  const totalCost = quantity * pricePerKg;

  const newPurchase = { id, farmerId, date, quantity, pricePerKg, totalCost, category };
  purchases.push(newPurchase);
  addStock(category, quantity); 
  savePurchases();
  displayPurchases();
  displayInventory();

  addPurchaseForm.reset();
});


function deletePurchase(id) {
  const purchaseIndex = purchases.findIndex((purchase) => purchase.id === id);
  if (purchaseIndex !== -1) {
    const deletedPurchase = purchases.splice(purchaseIndex, 1)[0];
    savePurchases();
    displayPurchases();
    alert(`Purchase ID: ${deletedPurchase.id} has been deleted.`);
  }
}


function updatePurchase(id) {
  const purchase = purchases.find((purchase) => purchase.id === id);
  if (!purchase) {
    alert("Purchase not found!");
    return;
  }

  const newFarmerId = prompt("Enter new Farmer ID:", purchase.farmerId);
  const newDate = prompt("Enter new Date (YYYY-MM-DD):", purchase.date);
  const newQuantity = prompt("Enter new Quantity (kg):", purchase.quantity);
  const newPricePerKg = prompt("Enter new Price per kg ($):", purchase.pricePerKg);
  const newCategory = prompt("Enter new Category:", purchase.category);

  if (newFarmerId && newDate && newQuantity && newPricePerKg && newCategory) {
    purchase.farmerId = parseInt(newFarmerId);
    purchase.date = newDate;
    purchase.quantity = parseInt(newQuantity);
    purchase.pricePerKg = parseFloat(newPricePerKg);
    purchase.totalCost = purchase.quantity * purchase.pricePerKg;
    purchase.category = newCategory;

    addStock(newCategory, parseInt(newQuantity) - purchase.quantity); 
    savePurchases();
    displayPurchases();
    displayInventory(); 
    alert(`Purchase ID: ${id} has been updated.`);
  } else {
    alert("Update canceled. All fields are required.");
  }
}


sortDateButton.addEventListener("click", () => {
  purchases.sort((a, b) => new Date(a.date) - new Date(b.date));
  displayPurchases();
});


sortAmountButton.addEventListener("click", () => {
  purchases.sort((a, b) => b.totalCost - a.totalCost);
  displayPurchases();
});


sortFarmerButton.addEventListener("click", () => {
  purchases.sort((a, b) => a.farmerId - b.farmerId);
  displayPurchases();
});

function filterPurchases() {
  const farmerFilter = searchFarmerId.value.trim();
  const startDate = filterStartDate.value;
  const endDate = filterEndDate.value;

  const filtered = purchases.filter((purchase) => {
    const matchesFarmer = farmerFilter ? purchase.farmerId === parseInt(farmerFilter) : true;
    const matchesStartDate = startDate ? new Date(purchase.date) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(purchase.date) <= new Date(endDate) : true;
    return matchesFarmer && matchesStartDate && matchesEndDate;
  });

  displayPurchases(filtered);
}

searchFarmerId.addEventListener("input", filterPurchases);
filterStartDate.addEventListener("change", filterPurchases);
filterEndDate.addEventListener("change", filterPurchases);

clearFiltersButton.addEventListener("click", () => {
  searchFarmerId.value = "";
  filterStartDate.value = "";
  filterEndDate.value = "";
  displayPurchases();
});


generateSummaryButton.addEventListener("click", () => {
  const totalPurchases = purchases.length;
  const totalQuantity = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);

  summaryOutput.innerHTML = `
    <p>Total Purchases: ${totalPurchases}</p>
    <p>Total Quantity: ${totalQuantity} kg</p>
    <p>Total Revenue: $${totalRevenue.toFixed(2)}</p>
  `;
});


viewPurchasesButton.addEventListener("click", () => {
  const isHidden = purchaseList.style.display === "none";
  purchaseList.style.display = isHidden ? "block" : "none";
  filterSection.style.display = isHidden ? "block" : "none";
  summarySection.style.display = isHidden ? "block" : "none";
  viewPurchasesButton.textContent = isHidden ? "Hide Purchases" : "View Purchases";
  if (isHidden) displayPurchases();
});


loadPurchases();
displayPurchases();
