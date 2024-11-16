<script setup>
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import { ref, onMounted, watch, computed } from "vue";
import axios from "../../../axios";
import Close from "@/assets/icons/close.vue";

const devotionals = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchBy = ref("");
const hasMoreData = ref(true);
const isModalOpen = ref(false);
const selectedUserVerses = ref(null);
const showConfirmationModal = ref(false);
const dataToDelete = ref(null);
const reflection = ref("");
const refreshData = async () => {
  try {
    const response = await axios.get(
      `/devotional?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}`
    );
    devotionals.value = response.data.devotional || [];
    hasMoreData.value = devotionals.value.length === itemsPerPage.value;
  } catch (error) {
    console.error("Error fetching devotional data:", error);
  }
};

const deleteHandler = async () => {
  try {
    const response = await axios.put(
      `/devotional/${dataToDelete.value.id}/delete`
    );
    if (response) console.log("Delete successful");
    refreshData();
    closeConfirmModal();
  } catch (error) {
    console.error("Error deleting devotional:", error);
  }
};

const openModalDelete = (item) => {
  dataToDelete.value = item;
  showConfirmationModal.value = true;
};

const openModal = (userVerses, text) => {
  
  reflection.value = text;
  selectedUserVerses.value = userVerses;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedUserVerses.value = null;
};

const closeConfirmModal = () => {
  showConfirmationModal.value = false;
};

const groupedDevotionals = computed(() => {
  const grouped = {};
  devotionals.value.forEach((item) => {
    if (!grouped[item.fullname]) {
      grouped[item.fullname] = {
        fullname: item.fullname,
        profile: item.profile,
        userId: item.user_id,
        entries: [],
      };
    }
    grouped[item.fullname].entries.push({
      id: item.id,
      verses: JSON.parse(item.verses || "[]"),
      reflection: item.reflection,
      posted_at: item.posted_at,
    });
  });
  return Object.values(grouped);
});

onMounted(refreshData);
watch([currentPage, searchBy], refreshData);
</script>

<template>
  <main>
    <HeaderComponent />

    <div class="pb-3 px-4">
      <h1 class="text-2xl font-semibold mb-4">Devotional / Bible Verses</h1>

      <div class="mb-4">
        <input
          v-model="searchBy"
          type="text"
          placeholder="Search by reference"
          class="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      <div v-for="user in groupedDevotionals" :key="user.userId" class="mb-6">
        <table class="w-full divide-gray-200 mt-4">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
            

              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Posted At
              </th>
                <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Verses
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-gray-200">
            <tr v-for="entry in user.entries" :key="entry.id">
              <td class="px-6 py-4">{{ user.fullname }}</td>
            

              <td class="px-6 py-4">
                {{ new Date(entry.posted_at).toLocaleString() }}
              </td>
                <td class="px-6 py-4">
                <button
                  @click="openModal(entry.verses, entry.reflection)"
                  class="text-blue-600 hover:underline"
                >
                  View
                </button>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="openModalDelete(entry)"
                  class="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-lg"
                >
                block
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-center items-center border-t pt-4">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 text-sm"
        >
          Prev
        </button>
        <span class="px-4 py-2 text-sm">Page {{ currentPage }}</span>
        <button
          @click="currentPage++"
          :disabled="!hasMoreData"
          class="px-4 py-2 text-sm"
        >
          Next
        </button>
      </div>

      <!-- Modal for Viewing Verses -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded shadow-lg z-10">
          <div class="flex justify-between items-center">
            <h2 class="text-xl">Verses</h2>
            <Close @click="closeModal" class="cursor-pointer" />
          </div>
          <div class="mt-4">
            <ul>
              <li
                v-for="verse in selectedUserVerses"
                :key="verse.reference"
                class="mb-2 border-b pb-2"
              >
        
                <p class="font-semibold">{{ verse.reference }}</p>
                <p class="text-sm">{{ verse.text }}</p>
              </li>
              <li class="mb-2 border-b pb-2">
               <p class="font-semibold">Reflection</p>
               <p class="text-sm">{{ reflection }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div
        v-if="showConfirmationModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-4 rounded shadow-lg">
          <h2 class="text-lg">Confirm Deletion</h2>
          <p>Are you sure you want to delete this entry?</p>
          <div class="mt-4 flex justify-end gap-2">
            <button
              @click="deleteHandler"
              class="px-4 py-2 bg-red-500 text-white rounded"
            >
              Yes
            </button>
            <button
              @click="closeConfirmModal"
              class="px-4 py-2 bg-gray-300 rounded"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
