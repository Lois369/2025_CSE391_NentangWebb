const form = document.getElementById("student-form");
const tableBody = document.querySelector("#student-table tbody");

let students = [];
let editIndex = null;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const major = document.getElementById("major").value.trim();

  if (editIndex === null) {
    students.push({ name, age, major });
  } else {
    students[editIndex] = { name, age, major };
    editIndex = null;
  }

  form.reset();
  renderTable();
});

function renderTable() {
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.major}</td>
      <td>
        <button class="edit" onclick="editStudent(${index})">Sửa</button>
        <button class="delete" onclick="deleteStudent(${index})">Xóa</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function editStudent(index) {
  const student = students[index];
  document.getElementById("name").value = student.name;
  document.getElementById("age").value = student.age;
  document.getElementById("major").value = student.major;
  editIndex = index;
}

function deleteStudent(index) {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    students.splice(index, 1);
    renderTable();
  }
}
