function showList() {
  const tbody = document.getElementById("empBody");
  tbody.innerHTML = "";
  empList.forEach((emp) => {
    tbody.innerHTML += `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.address}</td>
        <td>${emp.phone}</td>
        <td>
          <span style="color:gold;">✏️</span>
          <span style="color:red;">🗑️</span>
        </td>
      </tr>
    `;
  });
  document.getElementById(
    "countText"
  ).innerText = `Showing ${empList.length} out of 25 entries`;
}

function openForm() {
  document.getElementById("popupForm").style.display = "flex";
}

function closeForm() {
  document.getElementById("popupForm").style.display = "none";
}

function validatePhone(p) {
  return /^0\d{9}$/.test(p);
}

document.getElementById("addForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const msg = document.getElementById("phoneMsg");

  msg.innerText = "";

  if (!name || !email || !address || !phone) {
    alert("Please fill all fields.");
    return;
  }

  if (!validatePhone(phone)) {
    msg.innerText = "Phone must start with 0 and have 10 digits.";
    return;
  }

  empList.push({ name, email, address, phone });
  showList();
  document.getElementById("addForm").reset();
  closeForm();
});

function searchEmp() {
  const val = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#empBody tr");
  rows.forEach((row) => {
    row.style.display = row.innerText.toLowerCase().includes(val) ? "" : "none";
  });
}

window.onload = showList;
