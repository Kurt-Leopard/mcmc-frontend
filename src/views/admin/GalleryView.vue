<script setup>
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import { ref, onMounted, watch, computed } from "vue";
import axios from "../../../axios";
import Close from "@/assets/icons/close.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

const pictures = ref([]); // List of pictures for the gallery
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchBy = ref("");
const hasMoreData = ref(true);
const isModalOpen = ref(false); // Modal visibility state
const selectedPicture = ref(null); // Currently selected picture for editing

// Fetch gallery picture data
const refreshData = async () => {
  try {
    const response = await axios.get(
      `/gallery?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}`
    );

    pictures.value = response.data.gallery;
    hasMoreData.value = response.data.gallery.length === itemsPerPage.value;
  } catch (error) {
    console.error("Error fetching picture data:", error);
  }
};

const formatDate = (date) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,  // You can set this to false if you prefer 24-hour format
  });

  return `${formattedDate} at ${formattedTime}`;
}

const nextPage = () => {
  if (hasMoreData.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const parsedImages = computed(() => {
  console.log(JSON.parse(selectedPicture.value.images));
  return selectedPicture.value.images ? JSON.parse(selectedPicture.value.images) : [];
});

// Open and close modal for picture editing
const openModal = (picture) => {
  selectedPicture.value = picture;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPicture.value = null;
};

onMounted(() => {
  refreshData();
});

// Watch for changes in currentPage or searchBy and refresh data
watch([currentPage, searchBy], refreshData);
</script>

<template>
  <main>
    <HeaderComponent />

    <div class="pb-3 px-4">
      <h1 class="text-2xl font-semibold mb-4">Gallery</h1>

      <!-- Search Input -->
      <div class="mb-4">
        <input v-model="searchBy" type="text" placeholder="Search by title"
          class="border border-gray-300 p-2 rounded w-full" />
      </div>

      <!-- Gallery Table -->
      <table class="w-full divide-y divide-gray-200 max-h-[360px] overflow-y-auto element-with-horizontal-scroll">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(picture, index) in pictures" :key="index"
            class="hover:bg-gray-100 hover:cursor-pointer" @click="openModal(picture)">
            <td class="px-6 py-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              <div class="ellipsis text-gray-900">{{ picture.heading }}</div>
            </td>
            <td class="px-6 py-4 max-w-full overflow-hidden ellipsis whitespace-nowrap">{{ picture.caption }}</td>
            <td class="px-6 py-4 whitespace-nowrap flex gap-2">
              <span class="px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                :class="!picture.galleryStatus ? 'inline-flex' : 'hidden'">
                Block
              </span>
              <span
                class="px-2 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 flex items-center justify-center"
                :class="picture.galleryStatus ? 'inline-flex' : 'hidden'">
                Blocked
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="mt-4 flex justify-center items-center border-t pt-4">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded">
          Prev
        </button>

        <span class="text-sm text-gray-500">Page {{ currentPage }}</span>

        <button @click="nextPage" :disabled="!hasMoreData"
          class="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded">
          Next
        </button>
      </div>

      <!-- Modal for editing picture -->
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <span class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" @click="closeModal"></span>
        <div class="bg-white p-6 rounded shadow-lg z-10">
          <div class="w-full flex justify-between items-center gap-2">
            <h2 class="text-xl">Details</h2>
            <div>
              <Close @click="closeModal" />
            </div>
          </div>
          <div class="py-4">
            <div class="w-full flex items-center">
              <div class="w-full flex gap-2 items-center my-2">
                <div class="bg-gray-200 rounded-full mx-2">
                  <img :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${selectedPicture.profile}`"
                    alt="Profile Picture" class="w-12 h-12 rounded-full object-contain">
                </div>
                <div>
                  {{ selectedPicture.fullname }}
                </div>
              </div>
              <div class="w-full flex justify-end text-sm">{{ formatDate(selectedPicture.posted_at) }}</div>
            </div>
            <div class="w-[500px] h-[200px]">
              <swiper :slides-per-view="1" :navigation="true" :pagination="true">
                <swiper-slide v-for="(item, index) in parsedImages" :key="index">
                  <div v-if="parsedImages.length > 0">
                    <img :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${item}`"
                      class="w-[500px] h-[200px]" />
                  </div>
                </swiper-slide>
              </swiper>
              <div class="flex justify-center h-full items-center" v-if="parsedImages.length === 0">
                <p>No Images can be found</p>
              </div>
            </div>
            <div class="w-full p-4">
              <p class="font-semibold">{{ selectedPicture.heading }}</p>
              <p class="text-sm ml-12 flex w-full">{{ selectedPicture.caption }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.ellipsis {
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.swiper-container {
  width: 100%;
  height: 500px;
}
</style>