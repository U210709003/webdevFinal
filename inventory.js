
const inventory = [
    { category: "Small", quantity: 0, minStock: 100 },
    { category: "Medium", quantity: 0, minStock: 50 },
    { category: "Large", quantity: 0, minStock: 30 },
    { category: "Extra Large", quantity: 0, minStock: 20 },
    { category: "Family Pack", quantity: 0, minStock: 10 },
    { category: "Bulk Pack", quantity: 0, minStock: 5 },
    { category: "Premium", quantity: 0, minStock: 10 },
  ];


  function addStock(category, quantity) {
    const item = inventory.find((item) => item.category === category);
    if (item) {
      item.quantity += quantity; 
      checkStockLevels(item);   
    }
  }

  
  function removeStock(category, quantity) {
    const item = inventory.find((item) => item.category === category);
    if (item) {
      if (item.quantity >= quantity) {
        item.quantity -= quantity; 
        checkStockLevels(item);   
      } else {
        alert(`Not enough stock for ${category}`); 
      }
    }
  }

 
  function checkStockLevels(item) {
    if (item.quantity < item.minStock) {
      alert(`Low stock alert: ${item.category}`);
    }
  }

  
  function displayInventory() {
    const inventoryBody = document.getElementById("inventoryBody");
    const totalInventoryElement = document.getElementById("totalInventory");

    inventoryBody.innerHTML = ""; 

    let totalQuantity = 0;

    inventory.forEach((item) => {
      totalQuantity += item.quantity;
      inventoryBody.innerHTML += `
        <tr>
          <td>${item.category}</td>
          <td>${item.quantity}</td>
          <td>${item.minStock}</td>
        </tr>
      `;
    });

    totalInventoryElement.textContent = `Total Blueberries: ${totalQuantity} kg`;
  }


  displayInventory();
