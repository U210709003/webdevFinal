
const initialSuppliers = [
  { id: 1, name: "John Doe", contact: "123456789", location: "New York" },
  { id: 2, name: "Jane Smith", contact: "987654321", location: "Los Angeles" },
  { id: 3, name: "Michael Johnson", contact: "112233445", location: "Chicago" },
];


let suppliers = [];


const supplierList = document.getElementById("supplierList");
const addSupplierForm = document.getElementById("addSupplierForm");
const resetButton = document.getElementById("resetButton");
const viewSuppliersButton = document.getElementById("viewSuppliersButton");
const searchName = document.getElementById("searchName");
const searchLocation = document.getElementById("searchLocation");
const filterButton = document.getElementById("filterButton");
const clearFilterButton = document.getElementById("clearFilterButton");


function loadSuppliers() {
  const savedSuppliers = localStorage.getItem("suppliers");
  if (savedSuppliers) {
    suppliers = JSON.parse(savedSuppliers);
  } else {
    suppliers = [...initialSuppliers];
    saveSuppliers();
  }
}


function saveSuppliers() {
  localStorage.setItem("suppliers", JSON.stringify(suppliers));
}


function displaySuppliers(filteredSuppliers = null) {
  const list = filteredSuppliers || suppliers;
  supplierList.innerHTML = "";

  if (list.length === 0) {
    supplierList.innerHTML = "<p>No suppliers available.</p>";
    return;
  }

  list.forEach((supplier) => {
    supplierList.innerHTML += `
      <div class="supplier-item">
        <h3>ID: ${supplier.id} - ${supplier.name}</h3>
        <p>Contact: ${supplier.contact}</p>
        <p>Location: ${supplier.location}</p>
        <button onclick="deleteSupplier(${supplier.id}, '${supplier.name}')">Delete</button>
        <button onclick="updateSupplier(${supplier.id})">Update</button>
      </div>
    `;
  });
}


addSupplierForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const location = document.getElementById("location").value.trim();


  if (!/^\d+$/.test(id) || parseInt(id) <= 0) {
    alert("ID must be a positive number.");
    return;
  }
  if (!/^\d+$/.test(contact)) {
    alert("Contact Number must contain only numbers.");
    return;
  }
  if (!/^[A-Za-z\s]+$/.test(name)) {
    alert("Name must contain only letters.");
    return;
  }
  if (!/^[A-Za-z\s]+$/.test(location)) {
    alert("Location must contain only letters.");
    return;
  }


  const newSupplier = { id: parseInt(id), name, contact, location };


  if (suppliers.some((supplier) => supplier.id === newSupplier.id)) {
    alert("A supplier with this ID already exists. Please choose a unique ID.");
    return;
  }

  suppliers.push(newSupplier);
  saveSuppliers();
  displaySuppliers();
  addSupplierForm.reset();
});


function deleteSupplier(id, name) {
  suppliers = suppliers.filter((supplier) => supplier.id !== id);
  saveSuppliers();
  displaySuppliers();
  alert(`Supplier "${name}" has been deleted.`);
}


function updateSupplier(id) {
  const supplier = suppliers.find((supplier) => supplier.id === id);
  if (!supplier) {
    alert("Supplier not found.");
    return;
  }

  const newName = prompt("Enter new name:", supplier.name);
  const newContact = prompt("Enter new contact number:", supplier.contact);
  const newLocation = prompt("Enter new location:", supplier.location);

  if (newName && /^[A-Za-z\s]+$/.test(newName)) supplier.name = newName;
  if (newContact && /^\d+$/.test(newContact)) supplier.contact = newContact;
  if (newLocation && /^[A-Za-z\s]+$/.test(newLocation)) supplier.location = newLocation;

  saveSuppliers();
  displaySuppliers();
  alert(`Supplier "${supplier.name}" has been updated.`);
}


function filterSuppliers() {
  const nameFilter = searchName.value.trim().toLowerCase();
  const locationFilter = searchLocation.value.trim().toLowerCase();

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesName = nameFilter ? supplier.name.toLowerCase().includes(nameFilter) : true;
    const matchesLocation = locationFilter ? supplier.location.toLowerCase().includes(locationFilter) : true;
    return matchesName && matchesLocation;
  });

  displaySuppliers(filteredSuppliers);
}


function clearFilters() {
  searchName.value = "";
  searchLocation.value = "";
  displaySuppliers();
}


filterButton.addEventListener("click", filterSuppliers);


clearFilterButton.addEventListener("click", clearFilters);


resetButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all suppliers to default?")) {
    suppliers = [...initialSuppliers];
    saveSuppliers();
    displaySuppliers();
  }
});


viewSuppliersButton.addEventListener("click", () => {
  const isHidden = supplierList.style.display === "none";
  supplierList.style.display = isHidden ? "block" : "none";
  viewSuppliersButton.textContent = isHidden ? "Hide Suppliers" : "View Suppliers";
  if (isHidden) displaySuppliers();
});


loadSuppliers();
displaySuppliers();
