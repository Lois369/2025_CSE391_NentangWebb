// main.js
import { transactions } from "./data.js";

const transactionTableBody = document.getElementById("transactionTableBody");
const addTransactionBtn = document.getElementById("addTransactionBtn");
const addTransactionModal = document.getElementById("addTransactionModal");
const closeModalBtn = addTransactionModal.querySelector(".close-button");
const cancelBtn = document.getElementById("cancelBtn");
const transactionForm = document.getElementById("transactionForm");

const customerNameInput = document.getElementById("customerName");
const employeeNameInput = document.getElementById("employeeName");
const amountInput = document.getElementById("amount");

const customerNameError = document.getElementById("customerNameError");
const employeeNameError = document.getElementById("employeeNameError");
const amountError = document.getElementById("amountError");

let currentTransactions = [...transactions]; // Make a copy to modify
const itemsPerPage = 5;
let currentPage = 1;

function displayTransactions(page = 1) {
  transactionTableBody.innerHTML = "";
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = currentTransactions.slice(start, end);

  paginatedItems.forEach((transaction) => {
    const row = transactionTableBody.insertRow();
    row.innerHTML = `
            <td><input type="checkbox" data-id="${transaction.id}"></td>
            <td class="action-buttons">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn" data-id="${
                  transaction.id
                }">🗑️</button>
            </td>
            <td>${transaction.id}</td>
            <td>${transaction.customer}</td>
            <td>${transaction.employee}</td>
            <td>${transaction.amount.toLocaleString("vi-VN")} VNĐ</td>
            <td>${transaction.purchaseDate}</td>
        `;
  });
  updatePagination();
  updateResultInfo();
}

function updatePagination() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(currentTransactions.length / itemsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("page-button");
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i;
      displayTransactions(currentPage);
    });
    paginationContainer.appendChild(button);
  }
}

function updateResultInfo() {
  const totalResultsSpan = document.getElementById("totalResults");
  const currentResultSpan = document.getElementById("currentResult");
  totalResultsSpan.textContent = Math.ceil(
    currentTransactions.length / itemsPerPage
  );
  currentResultSpan.textContent = currentPage;
}

// --- Modal and Form Handling ---
addTransactionBtn.addEventListener("click", () => {
  addTransactionModal.style.display = "flex"; // Use flex to center the modal content
  resetFormAndErrors();
});

closeModalBtn.addEventListener("click", () => {
  addTransactionModal.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  addTransactionModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === addTransactionModal) {
    addTransactionModal.style.display = "none";
  }
});

function resetFormAndErrors() {
  transactionForm.reset();
  customerNameError.style.display = "none";
  employeeNameError.style.display = "none";
  amountError.style.display = "none";
}

function validateForm() {
  let isValid = true;

  // Clear previous errors
  customerNameError.style.display = "none";
  employeeNameError.style.display = "none";
  amountError.style.display = "none";

  // Validate Customer Name
  if (customerNameInput.value.trim() === "") {
    customerNameError.textContent = "Tên khách hàng không được để trống.";
    customerNameError.style.display = "block";
    isValid = false;
  } else if (customerNameInput.value.length > 30) {
    customerNameError.textContent = "Tên khách hàng không được quá 30 ký tự.";
    customerNameError.style.display = "block";
    isValid = false;
  }

  // Validate Employee Name
  if (employeeNameInput.value.trim() === "") {
    employeeNameError.textContent = "Tên nhân viên không được để trống.";
    employeeNameError.style.display = "block";
    isValid = false;
  } else if (employeeNameInput.value.length > 30) {
    employeeNameError.textContent = "Tên nhân viên không được quá 30 ký tự.";
    employeeNameError.style.display = "block";
    isValid = false;
  }

  // Validate Amount
  if (amountInput.value.trim() === "") {
    amountError.textContent = "Số tiền không được để trống.";
    amountError.style.display = "block";
    isValid = false;
  } else if (isNaN(amountInput.value) || parseFloat(amountInput.value) <= 0) {
    amountError.textContent = "Số tiền phải là một số dương.";
    amountError.style.display = "block";
    isValid = false;
  }

  return isValid;
}

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  if (validateForm()) {
    const newTransaction = {
      id: Math.max(...currentTransactions.map((t) => t.id)) + 1, // Simple ID generation
      customer: customerNameInput.value.trim(),
      employee: employeeNameInput.value.trim(),
      amount: parseFloat(amountInput.value),
      purchaseDate: new Date().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    currentTransactions.push(newTransaction);
    displayTransactions(currentPage); // Re-render the table
    addTransactionModal.style.display = "none"; // Close modal
    resetFormAndErrors(); // Reset form
  }
});

// --- Delete functionality ---
transactionTableBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const transactionIdToDelete = parseInt(event.target.dataset.id);
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa giao dịch ID ${transactionIdToDelete} này không?`
      )
    ) {
      currentTransactions = currentTransactions.filter(
        (t) => t.id !== transactionIdToDelete
      );
      displayTransactions(currentPage);
    }
  }
});

const deleteSelectedBtn = document.querySelector(".delete-selected-btn");
const selectAllCheckbox = document.getElementById("selectAll");

selectAllCheckbox.addEventListener("change", (event) => {
  const checkboxes = transactionTableBody.querySelectorAll(
    'input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = event.target.checked;
  });
});

deleteSelectedBtn.addEventListener("click", () => {
  const selectedIds = [];
  const checkboxes = transactionTableBody.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  checkboxes.forEach((checkbox) => {
    if (checkbox.dataset.id) {
      // Ensure it's a data row checkbox, not selectAll
      selectedIds.push(parseInt(checkbox.dataset.id));
    }
  });

  if (selectedIds.length === 0) {
    alert("Vui lòng chọn ít nhất một bản ghi để xóa.");
    return;
  }

  if (
    confirm(
      `Bạn có chắc chắn muốn xóa ${selectedIds.length} giao dịch đã chọn không?`
    )
  ) {
    currentTransactions = currentTransactions.filter(
      (t) => !selectedIds.includes(t.id)
    );
    displayTransactions(currentPage);
    selectAllCheckbox.checked = false; // Uncheck select all after deletion
  }
});

// Initial display of transactions
displayTransactions(currentPage);
