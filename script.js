// script.js

// --- Global Variables ---
let currentPage = 1;
let rowsPerPage = 20; // Default rows per page
let currentSearchTerm = "";
let currentData = [...userData]; // A mutable copy of the original data for filtering

// --- DOM Element References ---
const tableBody = document.getElementById("employeeTableBody");
const searchInput = document.getElementById("employeeSearchInput");
const searchButton = document.getElementById("searchEmployeeBtn");
const resultsDropdown = document.getElementById("rowsPerPageSelect");
const paginationInfo = document.getElementById("paginationInfo");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");

// --- Modal Elements ---
const addNewEmployeeBtn = document.getElementById("addNewEmployeeBtn");
const addEmployeeModal = document.getElementById("addEmployeeModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelAddBtn = document.getElementById("cancelAddBtn");
const addEmployeeForm = document.getElementById("addEmployeeForm");
const employeeNameInput = document.getElementById("employeeName");
const employeeEmailInput = document.getElementById("employeeEmail");
const employeeAddressInput = document.getElementById("employeeAddress");
const employeePhoneInput = document.getElementById("employeePhone");

// --- Core Table Rendering Function ---
function renderTable(dataToRender) {
  tableBody.innerHTML = ""; // Clear existing rows

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = dataToRender.slice(start, end);

  if (paginatedData.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; padding: 20px;">Không có dữ liệu phù hợp.</td></tr>';
    updatePaginationInfo(0, 0, 0);
    return;
  }

  paginatedData.forEach((person) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <input type="checkbox" data-id="${person.id}">
                <button class="btn-action edit" data-id="${
                  person.id
                }"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn-action delete" data-id="${
                  person.id
                }"><i class="fas fa-trash-alt"></i></button>
                <button class="btn-action view" data-id="${
                  person.id
                }"><i class="bi bi-eye"></i></button>
            </td>
            <td>${person.id}</td>
            <td>${person.ten}</td>
            <td>${person.hoDem}</td>
            <td>${person.diaChi}</td>
            <td>
                <i class="${
                  person.hoatDong
                    ? "fas fa-check-circle active-icon"
                    : "fas fa-times-circle inactive-icon"
                }"
                   data-id="${person.id}" data-status="${person.hoatDong}"></i>
            </td>
        `;
    tableBody.appendChild(row);
  });
  updatePaginationInfo(
    start + 1,
    paginatedData.length > 0 ? start + paginatedData.length : 0,
    dataToRender.length
  );
}

// --- Pagination Info Update ---
function updatePaginationInfo(start, end, total) {
  if (total === 0) {
    paginationInfo.textContent = "Không có kết quả";
  } else {
    paginationInfo.textContent = `Kết quả ${start} đến ${end} trên ${total}`;
  }
}

// --- Search Functionality ---
function handleSearch() {
  currentSearchTerm = searchInput.value.toLowerCase().trim();
  currentPage = 1; // Reset to first page on new search

  currentData = userData.filter(
    (person) =>
      person.ten.toLowerCase().includes(currentSearchTerm) ||
      person.hoDem.toLowerCase().includes(currentSearchTerm) ||
      person.diaChi.toLowerCase().includes(currentSearchTerm) ||
      (person.email &&
        person.email.toLowerCase().includes(currentSearchTerm)) || // Search email if available
      (person.phone && person.phone.toLowerCase().includes(currentSearchTerm)) // Search phone if available
  );
  renderTable(currentData);
}

// --- Modal Functions ---
function showModal() {
  addEmployeeModal.classList.add("active");
}

function hideModal() {
  addEmployeeModal.classList.remove("active");
  addEmployeeForm.reset(); // Clear form fields when closing
}

// --- Event Listeners ---

// Table actions (edit, delete, view, status toggle)
tableBody.addEventListener("click", (event) => {
  const target = event.target;
  const button = target.closest(".btn-action");
  const statusIcon = target.closest("i[data-status]");

  if (button) {
    const id = parseInt(button.dataset.id); // Ensure ID is integer
    if (button.classList.contains("edit")) {
      alert(`Chức năng chỉnh sửa cho ID: ${id}.`);
      // Implement edit modal/form here
    } else if (button.classList.contains("delete")) {
      if (confirm(`Bạn có chắc muốn xóa người có ID: ${id} không?`)) {
        // Remove from original userData array
        const index = userData.findIndex((p) => p.id === id);
        if (index !== -1) {
          userData.splice(index, 1);
        }
        // Re-apply search/filter and re-render
        handleSearch();
      }
    } else if (button.classList.contains("view")) {
      alert(`Chức năng xem chi tiết cho ID: ${id}.`);
      // Implement view detail modal/page here
    }
  } else if (statusIcon) {
    const id = parseInt(statusIcon.dataset.id);
    const currentStatus = statusIcon.dataset.status === "true"; // Convert string to boolean

    // Find the person in userData and toggle their status
    const person = userData.find((p) => p.id === id);
    if (person) {
      person.hoatDong = !currentStatus; // Toggle status
      // Update the icon class directly
      statusIcon.classList.toggle("active-icon", person.hoatDong);
      statusIcon.classList.toggle("inactive-icon", !person.hoatDong);
      statusIcon.classList.toggle("fa-check-circle", person.hoatDong);
      statusIcon.classList.toggle("fa-times-circle", !person.hoatDong);
      statusIcon.dataset.status = person.hoatDong; // Update data attribute
    }
  }
});

// Search input keypress (Enter)
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// Search button click
searchButton.addEventListener("click", handleSearch);

// Rows per page dropdown change
resultsDropdown.addEventListener("change", (event) => {
  rowsPerPage = parseInt(event.target.value);
  currentPage = 1; // Reset to first page
  renderTable(currentData);
});

// Pagination buttons
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(currentData);
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(currentData.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable(currentData);
  }
});

// --- Modal Event Listeners ---
addNewEmployeeBtn.addEventListener("click", showModal); // Show modal on "THÊM MỚI" click
closeModalBtn.addEventListener("click", hideModal); // Close modal on 'X' click
cancelAddBtn.addEventListener("click", hideModal); // Close modal on 'Cancel' click

// Close modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
  if (event.target === addEmployeeModal) {
    hideModal();
  }
});

// Handle Add Employee form submission
addEmployeeForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default browser form submission

  const newName = employeeNameInput.value.trim();
  const newEmail = employeeEmailInput.value.trim();
  const newAddress = employeeAddressInput.value.trim();
  const newPhone = employeePhoneInput.value.trim();

  if (!newName || !newEmail || !newAddress || !newPhone) {
    alert("Vui lòng điền đầy đủ tất cả các trường.");
    return;
  }

  // Generate a simple new ID. In a real application, this would come from a backend.
  const newId =
    userData.length > 0 ? Math.max(...userData.map((p) => p.id)) + 1 : 1;

  // Basic logic to split name into 'Tên' and 'Họ đệm'.
  // This is a simplification and might need more robust logic for complex names.
  const nameParts = newName.split(" ").filter((part) => part !== ""); // Remove empty strings
  let ten = "";
  let hoDem = "";

  if (nameParts.length > 0) {
    ten = nameParts[nameParts.length - 1]; // Last part is 'Tên'
    hoDem = nameParts.slice(0, nameParts.length - 1).join(" "); // Remaining parts are 'Họ đệm'
  }

  const newPerson = {
    id: newId,
    ten: ten,
    hoDem: hoDem,
    diaChi: newAddress,
    hoatDong: true, // New employees are active by default
    email: newEmail,
    phone: newPhone,
  };

  userData.push(newPerson); // Add the new person to our main data array
  handleSearch(); // Re-filter and re-render the table with the new data
  hideModal(); // Close the modal
  alert("Thêm nhân viên mới thành công!");
});

// --- Initial Render on Page Load ---
document.addEventListener("DOMContentLoaded", () => {
  renderTable(currentData);
});
