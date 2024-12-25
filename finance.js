// Function to fetch data from localStorage
function getPurchases() {
    return JSON.parse(localStorage.getItem("purchases")) || [];
  }
  
  function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
  }
  
  // Function to calculate financials
  function calculateFinancials(taxRate) {
    const purchases = getPurchases();
    const orders = getOrders();
  
    const totalIncome = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalExpense = purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
    const taxAmount = totalIncome * (taxRate / 100);
    const netProfit = totalIncome - totalExpense - taxAmount;
  
    return { totalIncome, totalExpense, taxAmount, netProfit };
  }
  
  // DOM references
  const taxRateInput = document.getElementById("taxRate");
  const analyzeButton = document.getElementById("analyzeButton");
  const totalIncomeElement = document.getElementById("totalIncome");
  const totalExpenseElement = document.getElementById("totalExpense");
  const taxAmountElement = document.getElementById("taxAmount");
  const netProfitElement = document.getElementById("netProfit");
  
  // Analyze button click event
  analyzeButton.addEventListener("click", () => {
    const taxRate = parseFloat(taxRateInput.value) || 0;
    const financials = calculateFinancials(taxRate);
  
    totalIncomeElement.textContent = `$${financials.totalIncome.toFixed(2)}`;
    totalExpenseElement.textContent = `$${financials.totalExpense.toFixed(2)}`;
    taxAmountElement.textContent = `$${financials.taxAmount.toFixed(2)}`;
    netProfitElement.textContent = `$${financials.netProfit.toFixed(2)}`;
  });
  