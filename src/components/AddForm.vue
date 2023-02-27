<script setup>
import { ref, defineProps, onMounted } from "vue";
const { showForm, data } = defineProps(["showForm", "data"]);
const name = ref("");
const city = ref("");
const date = ref("");
const dataDetails = ref(data);

onMounted(() => {
  const storedStudents = localStorage.getItem("dataDetails");
  if (storedStudents) {
    dataDetails.value = JSON.parse(storedStudents);
  }
});
function saveStudentsToStorage(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

const newStudent = dataDetails.value.length + 2;

const addDetails = async () => {
  const newObj = {
    id: newStudent,
    name: name.value,
    date: date.value,
    city: city.value,
  };

  dataDetails.value.push(newObj);
  saveStudentsToStorage(dataDetails.value);
  name.value = "";
  city.value = "";
  date.value = "";
  showForm();
};
</script>
<template>
  <div class="custom-container container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h5 class="card-title mb-4">Add Person</h5>
            <form>
              <div class="mb-3">
                <label for="nameInput" class="form-label">Name</label>
                <input
                  v-model="name"
                  type="text"
                  class="form-control"
                  id="nameInput"
                  placeholder="Enter name"
                />
              </div>
              <div class="mb-3">
                <label for="dobInput" class="form-label">Date of Birth</label>
                <input
                  type="date"
                  v-model="date"
                  class="form-control"
                  id="dobInput"
                />
              </div>
              <div class="mb-3">
                <label for="cityInput" class="form-label">City</label>
                <input
                  v-model="city"
                  type="text"
                  class="form-control"
                  id="cityInput"
                  placeholder="Enter city"
                />
              </div>
              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-primary me-2"
                  @click="addDetails"
                >
                  Add
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="showForm()"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.custom-container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  align-items: center;
  justify-content: center;
}
</style>
