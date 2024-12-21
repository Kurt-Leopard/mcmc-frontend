
<script setup>
import axios from "../../axios";
import { ref, onMounted } from "vue";
import { arrowRightButton } from "../assets/svg/button";
import { useAuthStore } from "../stores/store";
import { decodeJWT } from "../stores/token";
import { accessControl } from "../composables/user";
import CreateEditComponent from "../components/modal/CreateEditComponent.vue";
import ChatEventComponent from "../components/modal/ChatEventComponent.vue";
import DeleteComponent from "../components/modal/DeleteComponent.vue";
import { relativeTime } from "../composables/relativeTime";
import FooterComponent from "../components/FooterComponent.vue";
import CardLoader from "../components/loader/CardLoader.vue";

const store = useAuthStore();
const access_control = ref();
const tokenId = ref();
if (store.token) {
  tokenId.value = decodeJWT(store.token);
}

const isFetchLoader = ref(false);

const user_id = ref();
const events = ref([]);
const currentPage = ref(1);
const limit = 10;
const isModalShow = ref(false);
const method = ref("");
const sendBy = ref("");
const setDefault = ref();
const isEventModalShow = ref([]);
const isDeleteModalShow = ref(false);
const showModalComment = ref([]);
let id;

if (store.token) {
  const user = decodeJWT(store.token);
  user_id.value = user.id;
}
const refreshData = async () => {
  const response = await axios.get(
    `/events?page=${currentPage.value}&limit=${limit}`
  );

  try {
    if (response.data.success) {
      events.value = response.data.events;
      isFetchLoader.value = true;
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.log(response.data.message);
  }
};

const nextPage = () => {
  if (events.value.length > 1) {
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

const buttonShowEventModal = (methodEvent, sendByEvent, event, eventID) => {
  if (methodEvent === "post") {
    isModalShow.value = true;
    method.value = methodEvent;
    sendBy.value = sendByEvent;
    setDefault.value = {};
  } else if (methodEvent === "put") {
    isModalShow.value = true;
    method.value = methodEvent;
    sendBy.value = sendByEvent;
    setDefault.value = event;
    id = eventID;
  }
};

const buttonHideModal = () => {
  isModalShow.value = false;
};

// wiew event modal
const directToShowModalComment = ref(0);
const viewMoreEventAndChat = (index) => {
  isEventModalShow.value[index] = true;
  showModalComment.value[index] = !showModalComment.value[index];
  directToShowModalComment.value = 2;
};
const viewMoreEvent = (index) => {
  isEventModalShow.value[index] = true;
  directToShowModalComment.value = 1;
};

const hideEventModalShow = (index) => {
  isEventModalShow.value[index] = false;
  setDefault.value = {};
};

// delete

const buttonShowDeleteModal = (sendByEventDelete, eventIdDelete) => {
  isDeleteModalShow.value = true;
  sendBy.value = sendByEventDelete;
  id = eventIdDelete;
};
const cancelButtonShowDeleteModal = () => {
  isDeleteModalShow.value = false;
  const index = isEventModalShow.value.length;
  isEventModalShow.value[index - 1] = false;
};

const buttonShowModalComment = (index) => {
  showModalComment.value[index] = !showModalComment.value[index];
};
const buttonHideshowModalComment = (index) => {
  showModalComment.value[index] = !showModalComment.value[index];
  if (directToShowModalComment.value == "2") {
    isEventModalShow.value[index] = false;
  }
};
onMounted(async () => {
  await accessControl();
  access_control.value = store.getAccessControl().access_control;
  refreshData();
});
</script>
<template>
  <CardLoader v-if="!isFetchLoader" />
  <div v-else class="py-3 px-4 lg:px-[50px] xl:px-32 my-24">
    <div class="border-b mb-5 flex justify-between text-sm">
      <div
        class="text-[#D98757] flex items-center pb-2 pr-2 border-b-2 border-[#D98757] uppercase"
      >
        <i class="fas fa-calendar-alt text-lg mr-2"></i>
        <a class="font-semibold inline-block">CHURCH EVENTS</a>
      </div>
      <div
        class="text-gray-600 flex items-center pb-2 uppercase"
        v-if="access_control === 'Event Coordinator'"
      >
        <a
          @click="buttonShowEventModal('post', 'event')"
          class="text-gray-600 hover:text-gray-800 font-bold flex items-center ursor-pointer"
          ><i class="fas fa-plus p-2 bg-gray-100 text-lg rounded-lg"></i
        ></a>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      <!-- CARD 1 -->
      <div
        class="rounded overflow-hidden shadow-lg flex flex-col"
        v-for="(event, index) in events"
        :key="event.id"
      >
        <a></a>
        <div class="relative w-full pb-[70%] overflow-hidden">
          <a>
            <img
              class="absolute top-0 left-0 w-full h-full object-cover"
              :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${event.image}`"
              alt="Sunset in the mountains"
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
          <p class="text-gray-500 text-sm truncate">
            {{ event.description }}
          </p>
          <small
            @click="viewMoreEvent(index)"
            class="cursor-pointer hover:text-[#D98757]"
            >View more</small
          >
          <!-- show view event -->
          <div
            v-if="isEventModalShow[index]"
            class="fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-white sm:bg-black sm:bg-opacity-50 md:bg-black md:bg-opacity-50 lg:bg-black lg:bg-opacity-50 xl:bg-black xl:bg-opacity-50 z-30"
          >
            <div
              class="bg-white rounded-sm w-full md:w-[600px] lg:w-[600px] xl:w-[600px] flex flex-col h-full py-3 overflow-y-auto overflow-x-hidden element-with-horizontal-scroll"
            >
              <!-- back button -->
              <div class="flex justify-between items-center px-4">
                <a
                  v-html="arrowRightButton()"
                  @click="hideEventModalShow(index)"
                  class="w-0"
                ></a>
                <div class="flex justify-between items-center">
                  <svg
                    @click="buttonShowModalComment(index)"
                    class="h-6 w-6 mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    ></path>
                  </svg>
                  <i
                    v-if="access_control === 'events'"
                    class="fas fa-edit text-lg px-2"
                    @click="
                      buttonShowEventModal('put', 'event', event, event.id)
                    "
                  ></i>
                  <i
                    v-if="access_control === 'events'"
                    class="fas fa-trash text-lg px-2"
                    @click="buttonShowDeleteModal('event', event.id)"
                  ></i>
                </div>
              </div>

              <div
                class="relative w-ful md:w-[600px] lg:w-[600px] xl:w-[600px] mt-2"
              >
                <a>
                  <img
                    class="w-full h-full"
                    :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${event.image}`"
                    alt="Sunset in the mountains"
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
              <div class="px-4 py-4 mb-auto">
                <a
                  class="font-medium text-lg inline-block hover:text-[#D98757] transition duration-500 ease-in-out inline-block mb-2"
                  >{{ event.heading }}</a
                >
                <p class="text-gray-500 text-sm">
                  {{ event.description }}
                </p>
              </div>
              <ChatEvent-Component
                :tokenId="tokenId.id"
                :showIndex="showModalComment[index]"
                :index="index"
                @buttonHideshowModalComment="buttonHideshowModalComment"
                :id="event.id"
                :userID="user_id"
              />
            </div>
          </div>
        </div>
        <!-- end view modal  -->
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
              xmlns="http://www.w3.org/2000/svg"
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

          <span
            @click="viewMoreEventAndChat(index)"
            class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center cursor-pointer"
          >
            <svg
              class="h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              ></path>
            </svg>
            <span class="ml-1">Comments</span>
          </span>
        </div>
      </div>
    </div>
    <div
      class="flex justify-center items-center text-gray-500 space-x-4 my-4 mb-24"
    >
      <small @click="prevPage" class="hover:text-gray-800 cursor-pointer">
        Prev
      </small>
      <small>Page {{ currentPage }}</small>
      <small @click="nextPage" class="hover:text-gray-800 cursor-pointer">
        Next
      </small>
    </div>

    <footer>
      <Footer-Component v-if="events.length > 3" />
    </footer>
    <Delete-Component
      :isDeleteModalShow="isDeleteModalShow"
      :sendBy="sendBy"
      :id="id"
      @refreshData="refreshData"
      @cancelButtonShowDeleteModal="cancelButtonShowDeleteModal"
    />
    <CreateEditComponent
      :isModalShow="isModalShow"
      :method="method"
      :sendBy="sendBy"
      :setDefault="setDefault"
      :id="id"
      @refreshData="refreshData"
      @buttonHideModal="buttonHideModal"
    />
  </div>
</template>
