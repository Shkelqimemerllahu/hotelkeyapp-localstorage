<script setup>
import data from "../data.json";
import EditForm from "./EditForm.vue";
import AddForm from "./AddForm.vue";
import { ref, watch, computed, reactive, onMounted } from "vue";
import DeleteCarton from "./DeleteCarton.vue";
import Header from "./Header.vue";
import Navbar from "./Navbar.vue";
const showCarton = ref(false);
const students = ref(data);
const showAddForm = ref(false);
const sortKey = ref("id");
const sortDirection = ref(1);

// Get Students
const getFromLocalStorage = () => {
  const pushStudent = JSON.parse(localStorage.getItem("students")) || [];
  students.value = pushStudent;
};

onMounted(() => {
  getFromLocalStorage();
});
// Show && Hide DeleteForm
const showCartonFunction = () => {
  showCarton.value = !showCarton.value;
};

//Show && Hide Add Form
const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
};

//When we click Delete Function remove the id and remove Popup
function deleteClick(id) {
  showCartonFunction();
  studentId.value = id;
}
// DeleteItem Function
const archivePush = ref([]);
const studentId = ref(-1);
function deleteItem(obj) {
  students.value = students.value.filter((student) => student.id !== obj.id);

  //Remove from localstorage
  const archiveFromStorage = JSON.parse(localStorage.getItem("students")) ?? [];
  const updatedArchive = archiveFromStorage.filter(
    (student) => student.id !== studentId.value
  );
  localStorage.setItem("students", JSON.stringify(updatedArchive));
  showCartonFunction();
  archivePush.value.push(obj);
  JSON.parse(localStorage.getItem("archive")) || [];
  localStorage.setItem("archive", JSON.stringify(archivePush.value));
}

// Search bar
const search = ref("");
watch(search, () => {
  students.value = data.filter((student) =>
    student.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Pagination and Sort Item at DisplayedItems() function
// Storted Items
const sortTable = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value * -1;
  } else {
    sortKey.value = key;
    sortDirection.value = 1;
  }
};
const currentPage = ref(1);
const itemsPerPage = ref(5);

const displayedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return students.value.slice(startIndex, endIndex).sort((a, b) => {
    let modifier = 1;
    if (sortDirection.value === -1) modifier = -1;
    if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
    if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
  });
});
const totalPages = computed(() => {
  return Math.ceil(students.value.length / itemsPerPage.value);
});
const pages = computed(() => {
  const pagesArray = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
});

function changePage(page) {
  currentPage.value = page;
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// Editable

if (!localStorage.getItem("students") || !localStorage.getItem("archive")) {
  localStorage.setItem("students", JSON.stringify(students.value));
  localStorage.setItem("archive", JSON.stringify(archivePush.value));
}
const editForm = ref(false);
const editValue = reactive({
  editValueUser: null,
  editValueofIndex: -1,
  items: displayedItems,
  toggleAddEdit: () => {
    editForm.value = !editForm.value;
  },
  updateUser: () => {
    const updatedItem = { ...editValue.editValueUser };
    const index = editValue.editValueofIndex;
    const itemId = editValue.items[index].id;
    const storedItems = JSON.parse(localStorage.getItem("students")) || [];
    const updatedItems = storedItems.map((item) =>
      item.id === itemId ? updatedItem : item
    );
    localStorage.setItem("students", JSON.stringify(updatedItems));
    editValue.items[index] = updatedItem;
    editValue.toggleAddEdit();
  },
  editUser: (id) => {
    editValue.editValueUser = { ...editValue.items[id] };
    editValue.editValueofIndex = id;
    editValue.toggleAddEdit();
  },
});
</script>

<template>
  <Header />
  <Navbar />
  <EditForm
    v-if="editForm"
    :showForm="editValue.toggleAddEdit"
    :data="students"
    :editValue="editValue"
  />
  <AddForm v-if="showAddForm" :data="students" :showForm="toggleAddForm" />
  <DeleteCarton
    v-if="showCarton"
    :showCartonFunction="showCartonFunction"
    :data="students"
    :deleteItem="deleteItem"
    :studentId="studentId"
  />
  <div class="container vh-100">
    <h1>Students</h1>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="form-inline">
        <input
          v-model.trim="search"
          class="form-control mr-sm-2 search-custom-css"
          type="search"
          placeholder="Search Students..."
          aria-label="Search"
        />
      </div>
      <button class="btn btn-primary" @click="toggleAddForm()">
        Add Students
      </button>
    </div>
    <table class="table table-bordered">
      <thead class="table-light">
        <tr>
          <th scope="col" @click="sortTable('id')">
            Index <img src="../assets/arrow-down-up.svg" alt="SortDown" />
          </th>
          <th scope="col" @click="sortTable('name')">
            Name <img src="../assets/arrow-down-up.svg" alt="SortDown" />
          </th>
          <th scope="col" @click="sortTable('date')">
            Date of Birth
            <img src="../assets/arrow-down-up.svg" alt="SortDown" />
          </th>
          <th scope="col" @click="sortTable('city')">
            City <img src="../assets/arrow-down-up.svg" alt="SortDown" />
          </th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(students, index) in displayedItems"
          :key="students.id"
          :class="index % 2 === 0 ? 'table-light' : 'table-secondary'"
        >
          <td>{{ students.id }}</td>
          <td>{{ students.name }}</td>
          <td>{{ students.date }}</td>
          <td>{{ students.city }}</td>
          <td>
            <button
              type="button"
              class="btn btn-primary btn-custom-edit"
              @click="editValue.editUser(index)"
            >
              Edit
            </button>
            <button
              type="button"
              class="btn btn-danger btn-custom-delete"
              @click="deleteClick(students.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
        class="page-link"
        :disabled="currentPage === 1"
        @click="previousPage"
      >
        Previous
      </button>
      <button
        v-for="page in pages"
        :key="page"
        class="page-link"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button
        class="page-link"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.table-bordered {
  border: 3px solid #dee2e6;
}

.table-light th {
  background-color: #f8f9fa;
}

.table-light th,
.table-light td {
  border: none;
}

.search-custom-css {
  width: 250px;
}

.btn-custom-delete {
  margin-left: 7px;
}
td,
th {
  text-align: center;
}
.active {
  background-color: blueviolet;
  border: none;
  color: blue;
}
</style>
