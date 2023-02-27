<script setup>
import { ref, computed, watch, onMounted } from "vue";
import data from "../data.json";
import Header from "./Header.vue";
import Navbar from "./Navbar.vue";
const currentPage = ref(1);
const itemsPerPage = ref(5);
const sortDirection = ref(1);
const sortKey = ref("id");
const archive = ref([]);
const students = ref(data);

const getFromLocalStorage = () => {
  const restoreStudent = JSON.parse(localStorage.getItem("archive")) || [];
  archive.value = restoreStudent;
};

onMounted(() => {
  getFromLocalStorage();
});

//Sortable
const sortTable = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value * -1;
  } else {
    sortKey.value = key;
    sortDirection.value = 1;
  }
};
//Pagination and Sortable
const displayedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return archive.value.slice(startIndex, endIndex).sort((a, b) => {
    let modifier = 1;
    if (sortDirection.value === -1) modifier = -1;
    if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
    if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
  });
});
const totalPages = computed(() => {
  return Math.ceil(archive.value.length / itemsPerPage.value);
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

//Search bar

const search = ref("");
watch(search, () => {
  archive.value = archiveData.filter((student) =>
    student.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

//Restore

const studentId = ref(-1);
function deleteItem(id) {
  // Remove item from archive in UI
  archive.value = archive.value.filter((student) => student.id !== id);

  // Remove item from archive in localStorage
  const archiveFromStorage = JSON.parse(localStorage.getItem("archive")) ?? [];
  const updatedArchive = archiveFromStorage.filter(
    (student) => student.id !== id
  );
  localStorage.setItem("archive", JSON.stringify(updatedArchive));

  // Find item with matching id in archive
  const student = archiveFromStorage.find((student) => student.id === id);

  if (student) {
    // Add item to students
    students.value.push(student);

    // Update localStorage for students
    const studentsFromStorage =
      JSON.parse(localStorage.getItem("students")) ?? [];
    localStorage.setItem(
      "students",
      JSON.stringify([...studentsFromStorage, student])
    );
  }
}

// function deleteItem(id) {
//   // Remove item from archive
//   archive.value = archive.value.filter((student) => student.id !== id);

//   // Find item with matching id in archive
//   const student = archive.value.find((student) => student.id === id);

//   if (student) {
//     // Add item to students
//     students.value.push(student);

//     // Update localStorage
//     const studentsFromStorage =
//       JSON.parse(localStorage.getItem("students")) ?? [];
//     localStorage.setItem(
//       "students",
//       JSON.stringify([...studentsFromStorage, student])
//     );
//   }
// }
const handleClick = (id) => {
  studentId.value = id;
  deleteItem(id);
};
</script>

<template>
  <Header />
  <Navbar />
  <div class="container vh-100">
    <div class="form-inline">
      <input
        v-model.trim="search"
        class="form-control mr-sm-2 search-custom-css"
        type="search"
        placeholder="Search Students..."
        aria-label="Search"
      />
    </div>
    <table class="table table-bordered">
      <thead class="table-light">
        <tr>
          <th scope="col">
            Index
            <img
              src="../assets/arrow-down-up.svg"
              alt="SortDown"
              @click="sortTable('id')"
            />
          </th>
          <th scope="col">
            Name
            <img
              src="../assets/arrow-down-up.svg"
              alt="SortDown"
              @click="sortTable('name')"
            />
          </th>
          <th scope="col">
            Date of Birth
            <img
              src="../assets/arrow-down-up.svg"
              alt="SortDown"
              @click="sortTable('date')"
            />
          </th>
          <th scope="col">
            City
            <img
              src="../assets/arrow-down-up.svg"
              alt="SortDown"
              @click="sortTable('city')"
            />
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
              class="btn btn-outline-primary"
              @click="handleClick(students.id, index)"
            >
              Restore
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

td,
th {
  text-align: center;
}
.active {
  background-color: blueviolet;
  border: none;
  color: blue;
}
.form-inline {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
