
<script setup>
import { ref, onMounted } from "vue";
import axios from "../../axios";
import { getDate } from "../composables/date";

const galleries = ref([]);
const index1 = ref(null); // Changed to null initially
const currentImageIndex = ref(0);

const viewGallery = (index) => {
  index1.value = index;
  currentImageIndex.value = 0;
};

const closeGallery = () => {
  index1.value = null;
};

const page = ref(1);
const limit = ref(10);

const parseImages = (images) => {
  return JSON.parse(images);
};

const refreshData = async () => {
  try {
    const response = await axios.get(`/gallery/public-images`, {
      params: { page: page.value, limit: limit.value },
    });

    if (response.status === 200) {
      galleries.value = response.data.gallery;
      console.log(galleries.value);
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
    }
  }
};

const showNextImage = () => {
  const gallery = galleries.value[index1.value];
  if (currentImageIndex.value < parseImages(gallery.images).length - 1) {
    currentImageIndex.value++;
  }
};

const showPrevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

onMounted(() => {
  refreshData;
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="py-3 px-4 lg:px-[50px] xl:px-32 mt-24">
    <div class="border-b mb-5 flex justify-between text-sm">
      <div
        class="text-[#D98757] flex items-center pb-2 pr-2 border-b-2 border-[#D98757] uppercase"
      >
        <i class="fas fa-images text-lg mr-2"></i>
        <a class="font-semibold inline-block">Church Gallery</a>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
      <div
        class="relative group flex items-center justify-center"
        v-for="(gallery, index) in galleries"
        :key="gallery.id"
        @click="viewGallery(index)"
      >
        <img
          class="h-auto w-full max-h-[200px] rounded-lg object-cover border border-gray-50"
          :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${
            parseImages(gallery.images)[0]
          }`"
          alt="Gallery image"
          loading="lazy"
        />
        <div
          class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white text-center rounded-lg"
        >
          <p>{{ getDate(gallery.posted_at) }}</p>
          <p>{{ parseImages(gallery.images).length }} pictures</p>
        </div>
      </div>
    </div>

    <!-- Modal for Image Viewer -->
    <div
      v-if="index1 !== null"
      class="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-75"
    >
      <section
        class="bg-white h-[650px] overflow-y-auto border w-[650px] p-4 relative flex items-center justify-center"
      >
        <button
          @click="closeGallery"
          class="absolute top-4 right-4 bg-white text-black border p-2 rounded-lg h-10 w-10"
        >
          <i class="fas fa-times"></i>
        </button>
        <div class="my-3">
          <img
            class="w-auto max-h-[600px]"
            :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${
              parseImages(galleries[index1].images)[currentImageIndex]
            }`"
            alt="Gallery image"
            loading="lazy"
          />
          <button
            v-if="currentImageIndex > 0"
            @click="showPrevImage"
            class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white h-10 w-10 rounded-full bg-black bg-opacity-50"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <button
            v-if="
              currentImageIndex <
              parseImages(galleries[index1].images).length - 1
            "
            @click="showNextImage"
            class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 rounded-full h-10 w-10 bg-black bg-opacity-50"
          >
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>
    </div>
    <div
      v-if="galleries.length > 3"
      class="hidden md:flex lg:flex xl:flex py-5 mt-5 m-auto text-gray-800 text-sm flex-col items-center border-t max-w-screen-xl"
    >
      <p>© Copyright 2023. All Rights Reserved.</p>
    </div>
  </div>
</template>

