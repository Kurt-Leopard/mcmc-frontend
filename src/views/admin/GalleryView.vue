<script setup>
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import { ref, onMounted, watch, computed } from "vue";
import axios from "../../../axios";
import Close from "@/assets/icons/close.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

const pictures = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchBy = ref("");
const hasMoreData = ref(true);
const isModalOpen = ref(false);
const selectedPicture = ref(null);
const confirmationModal = ref(false);
const dataToDelete = ref([]);
const swiperInstance = ref(null);

const refreshData = async () => {
  try {
    const response = await axios.get(`/gallery?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}`);
    pictures.value = response.data.gallery;
    hasMoreData.value = response.data.gallery.length === itemsPerPage.value;
  } catch (error) {
    console.error("Error fetching picture data:", error);
  }
};

const deleteData = async (data) => {
  try {
    const response = await axios.put(`/gallery/${data.id}/delete`);
    if(response) console.log("done");
    refreshData();
    confirmationModal.value = false;
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

const formatDate = (date) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTime = new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
  return `${formattedDate} at ${formattedTime}`;
};

const parsedImages = computed(() => selectedPicture.value?.images ? JSON.parse(selectedPicture.value.images) : []);

const openModal = (picture) => {
  selectedPicture.value = picture;
  isModalOpen.value = true;
};

const openDeleteModal = (picture) => {
  dataToDelete.value = picture;
}

const closeModal = () => {
  isModalOpen.value = false;
  selectedPicture.value = null;
};

const nextImage = () => {
  if (swiperInstance.value) swiperInstance.value.swiper.slideNext();
};

const prevImage = () => {
  if (swiperInstance.value) swiperInstance.value.swiper.slidePrev();
};

onMounted(refreshData);
watch([currentPage, searchBy], refreshData);
</script>
<template>
  <main>
    <HeaderComponent />
    <div class="pb-3 px-4">
      <h1 class="text-2xl font-semibold mb-4">Gallery</h1>

      <div class="mb-4">
        <input v-model="searchBy" type="text" placeholder="Search by title" class="border border-gray-300 p-2 rounded w-full" />
      </div>

      <table class="w-full divide-y divide-gray-200 max-h-[360px] overflow-y-auto element-with-horizontal-scroll">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(picture, index) in pictures" :key="index" class="hover:bg-gray-100">
              <td class="px-6 py-4 max-w-full overflow-hidden ellipsis whitespace-nowrap">{{ picture.fullname }}</td>
            <td class="px-6 py-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              <div class="ellipsis text-gray-900">{{ picture.heading }}</div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap flex gap-2">
              <span class="text-sm text-blue-700 hover:underline font-medium cursor-pointer" @click="openModal(picture)">View</span>
              <span 
                class="px-2 text-xs font-semibold rounded-full cursor-pointer hover:bg-green-200 flex items-center justify-center"
                :class="picture.galleryStatus ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                  @click="!picture.galleryStatus && (confirmationModal = true) && openDeleteModal(picture)">
                
                {{ picture.galleryStatus ? 'Blocked' : 'Block' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 flex justify-center items-center border-t pt-4">
        <button @click="prevImage" class="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded">
          Prev
        </button>
        <span class="text-sm text-gray-500">Page {{ currentPage }}</span>
        <button @click="nextImage" :disabled="!parsedImages.length" class="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded">
          Next
        </button>
      </div>

      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" @click="closeModal">
        <div class="bg-white p-6 rounded shadow-lg z-10 h-[100vh] overflow-y-auto" @click.stop>
          <div class="w-full flex justify-between items-center gap-2">
            <h2 class="text-xl">Details</h2>
            <Close @click="closeModal" />
          </div>
          <div class="py-4">
            <div class="w-full flex items-center ">
              <div class="w-full flex gap-2 items-center my-2">
                <img :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${selectedPicture.profile}`" alt="Profile Picture" class="w-[45px] h-[45px] rounded-full object-contain">
                <div>{{ selectedPicture.fullname }}</div>
              </div>
              <div class="w-full flex justify-end text-sm">{{ formatDate(selectedPicture.posted_at) }}</div>
            </div>
            <div class="w-[500px] h-[50vh] ">
              <Swiper ref="swiperInstance" :slides-per-view="1" :navigation="false" :pagination="true" >
                <SwiperSlide v-for="(item, index) in parsedImages" :key="index">
                  <img :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${item}`" class="w-[500px] h-[450px] object-cover rounded-lg" />
                </SwiperSlide>
              </Swiper>
              <div v-if="!parsedImages.length" class="flex justify-center items-center h-full">
                <p>No Images found</p>
              </div>
               <div class="w-full py-2">
              <p class="font-semibold">{{ selectedPicture.heading }}</p>
              <p class="text-sm">{{ selectedPicture.caption }}</p>
            </div>
            </div>
          
          </div>
        </div>
      </div>

      <div v-if="confirmationModal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" @click="confirmationModal.value = false">
        <div class="bg-white p-4 rounded-lg z-20">
          <h1 class="p-2 font-medium py-4">Are you sure you want to block this post?</h1>
          <div class="flex gap-2 justify-center">
            <button class="button-green text-white" @click="deleteData(dataToDelete)">YES</button>
            <button class="button-red text-white" @click="confirmationModal = false">NO</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
