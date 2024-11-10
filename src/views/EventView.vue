<script setup>
import axios from "../../axios";
import { ref, onMounted } from "vue";
import { arrowRightButton } from "../assets/svg/button";
import { relativeTime } from "../composables/relativeTime";
import FooterComponent from "../components/FooterComponent.vue";

const events = ref([]);
const currentPage = ref(1);
const limit = 10;
const isEventModalShow = ref([]);
const showModalComment = ref([]);

const refreshData = async () => {
  try {
    const response = await axios.get(
      `/public-events?page=${currentPage.value}&limit=${limit}`
    );
    if (response.data.success) {
      events.value = response.data.events;
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
  }
};

const nextPage = () => {
  if (events.value.length) {
    currentPage.value++;
    refreshData();
  } else {
    refreshData();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    refreshData();
  }
};

const viewMoreEvent = (index) => {
  isEventModalShow.value[index] = true;
};

const hideEventModalShow = (index) => {
  isEventModalShow.value[index] = false;
};

onMounted(async () => {
  refreshData();
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="py-3 px-4 lg:px-[50px] xl:px-32 mt-24">
    <div class="border-b mb-5 flex justify-between text-sm">
      <div
        class="text-[#D98757] flex items-center pb-2 pr-2 border-b-2 border-[#D98757] uppercase"
      >
        <i class="fas fa-calendar-alt text-lg mr-2"></i>
        <a class="font-semibold inline-block">CHURCH EVENTS</a>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      <div
        class="rounded overflow-hidden shadow-lg flex flex-col"
        v-for="(event, index) in events"
        :key="event.id"
      >
        <div class="relative w-full pb-[70%] overflow-hidden">
          <a>
            <img
              class="absolute top-0 left-0 w-full h-full object-cover"
              :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${event.image}`"
              alt="Event Image"
              loading="lazy"
            />
            <div
              class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"
            ></div>
          </a>
          <a href="#!">
            <div
              class="text-xs absolute top-0 right-0 bg-[#D98757] px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-[#D98757] transition duration-500 ease-in-out"
            >
              MCMC
            </div>
          </a>
        </div>
        <div class="px-6 py-4 mb-auto">
          <a
            class="font-medium text-lg inline-block hover:text-[#D98757] transition duration-500 ease-in-out inline-block mb-2"
            >{{ event.heading }}</a
          >
          <p class="text-gray-500 text-sm truncate">{{ event.description }}</p>
          <small
            @click="viewMoreEvent(index)"
            class="cursor-pointer hover:text-[#D98757]"
            >View more</small
          >
          <div
            v-if="isEventModalShow[index]"
            class="fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-white sm:bg-black sm:bg-opacity-50 z-30"
          >
            <div
              class="bg-white rounded-sm w-full md:w-[600px] flex flex-col h-full py-3 overflow-y-auto"
            >
              <div class="flex justify-between items-center px-4">
                <a
                  v-html="arrowRightButton()"
                  @click="hideEventModalShow(index)"
                  class="w-0"
                ></a>
              </div>
              <div class="relative w-full mt-2">
                <a>
                  <img
                    class="w-full h-full"
                    :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${event.image}`"
                    alt="Event Image"
                    loading="lazy"
                  />
                  <div
                    class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"
                  ></div>
                </a>
              </div>
              <div class="px-4 py-4 mb-auto">
                <a
                  class="font-medium text-lg inline-block hover:text-[#D98757] transition duration-500 ease-in-out inline-block mb-2"
                  >{{ event.heading }}</a
                >
                <p class="text-gray-500 text-sm">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="px-4 py-3 flex flex-row items-center justify-between bg-gray-100"
        >
          <span
            class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center"
          >
            <svg
              height="13px"
              width="13px"
              version="1.1"
              id="Layer_1"
              
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
              style="enable-background: new 0 0 512 512"
              xml:space="preserve"
            >
              <g>
                <g>
                  <path
                    d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z"
                  ></path>
                </g>
              </g>
            </svg>
            <span class="ml-1">{{ relativeTime(event.posted_at) }}</span>
          </span>

          <RouterLink
            to="/contact"
            class="py-3 rounded-lg text-xs text-black font-regular mr-1 px-6 flex flex-row items-center cursor-pointer bg-gray-50 border"
          >
            <span class="ml-1">Get involed</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <div
      class="flex justify-center items-center text-gray-500 space-x-4 my-4 mb-24"
    >
      <small @click="prevPage" class="hover:text-gray-800 cursor-pointer"
        >Prev</small
      >
      <small>Page {{ currentPage }}</small>
      <small @click="nextPage" class="hover:text-gray-800 cursor-pointer"
        >Next</small
      >
    </div>

       <FooterComponent/>
  </div>
</template>
