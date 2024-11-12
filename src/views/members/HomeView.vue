<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "../../../axios";
import DeleteComponent from "../../components/modal/DeleteComponent.vue";
import CreateEditComponent from "../../components/modal/CreateEditComponent.vue";
import { getDate } from "../../composables/date";
import { useAuthStore } from "../../stores/store";
import { decodeJWT } from "../../stores/token";

// slot
import LeftSidebar from "../../components/slot/LeftSidebar.vue";
import RightSidebar from "../../components/slot/RightSidebar.vue";
import SubHeader from "../../components/slot/SubHeader.vue";
import PostContent from "../../components/slot/PostContent.vue";
import PostPaginate from "../../components/slot/PostPaginate.vue";
import DevotionalContent from "../../components/slot/DevotionalContent.vue";
import DevotionalPaginate from "../../components/slot/DevotionalPaginate.vue";
import { fetchUser } from "../../composables/user";

const store = useAuthStore();
const storeID = ref();
if (store.token) {
  storeID.value = decodeJWT(store.token);
}
const galleries = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const devotional = ref([]);
const devoCurrentPage = ref(1);
const devoItemsPerPage = 10;

const showAllpost = ref(true);
const Allposts = ref(true);

const isOptionShow = ref([]);
const isOptionShowDevo = ref([]);

const isDeleteModalShow = ref(false);
const isModalShow = ref(false);
const sendBy = ref("");
const method = ref("");
const setDefault = ref();
const searchBy = ref("");

const showFullCaption = ref([]);
const animate = ref();

const supported_translation = ref([
  "CEB",
  "ESV",
  "KJV",
  "LEB",
  "MSG",
  "NIV",
  "NKJV",
  "NLT",
]);
const description_translation = ref([
  "Common English Bible (CEB)",
  "English Standard Version (ESV)",
  "King James Version (KJV)",
  "Lexham English Bible (LEB)",
  "The Message (MSG)",
  "New International Version (NIV)",
  "New King James Version (NKJV)",
  "New Living Translation (NLT)",
]);
let id;

watch(searchBy, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    refreshData();
      isLoading.value = false;
    setTimeout(() => {
      isLoading.value = true;
    }, 2000);
  }
});
// fetch
const refreshData = async () => {
  const response = await axios.get(
    `/gallery?page=${currentPage.value}&limit=${itemsPerPage}&searchBy=${searchBy.value}`
  );
  if (response.data.success) {
    galleries.value = response.data.gallery;
  } else {
    console.log(response.data.message);
  }
};

const refreshDataDevotional = async () => {
  const responseDevitional = await axios.get(
    `/devotional?page=${devoCurrentPage.value}&limit=${devoItemsPerPage}`
  );
  if (responseDevitional.data.success) {
    devotional.value = responseDevitional.data.devotional;
  } else {
    console.log(response.data.message);
  }
};

const toggleCaption = (index) => {
  showFullCaption.value[index] = !showFullCaption.value[index];
};
// images to parse
const parseImages = (images) => {
  const image = JSON.parse(images);

  return image.reverse();
};

const parseText = (verse) => {
  return JSON.parse(verse);
};

const currentImageIndex = ref([0]);
const indexParent = ref([0]);

const showNextImage = (index) => {
  if (index !== indexParent.value[index]) {
    currentImageIndex.value[index] = 0;
  }

  const image = galleries.value[index];
  if (currentImageIndex.value[index] < parseImages(image.images).length - 1) {
    indexParent.value[index] = index;
    currentImageIndex.value[index]++;
    console.log("current: " + currentImageIndex.value[index]);
  }
};

const showPrevImage = (index) => {
  currentImageIndex.value[index]--;
};

const getTranslation = (translation) => {
  const index = supported_translation.value.indexOf(translation);
  return index !== -1 ? description_translation.value[index] : undefined;
};

// Open modal from the child component
const buttonShowModal = (methodType, sentBy, data, modal_id) => {
  if (methodType === "post") {
    isModalShow.value = true;
    sendBy.value = sentBy;
    method.value = methodType;
    setDefault.value = {};
  } else if (methodType === "put") {
    isModalShow.value = true;
    sendBy.value = sentBy;
    method.value = methodType;
    setDefault.value = data;
    id = modal_id;
  }
};

// option
const optionButtonShow = (index) => {
  isOptionShow.value[index] = true;
};

// option devotional
const optionButtonShowDevo = (index) => {
  isOptionShowDevo.value[index] = true;
};
// open modal from the child component
const toggleDailyDevotion = () => {
  showAllpost.value = false;
  Allposts.value = false;
};

// close modal from the child component
const toggleAllposts = () => {
  showAllpost.value = true;
  Allposts.value = true;
};

const optionButtonHide = (index) => {
  isOptionShow.value[index] = false;
};

const optionButtonHideDevo = (index) => {
  isOptionShowDevo.value[index] = false;
};

// close modal from the child component
const buttonHideModal = (is_true) => {
  animate.value = is_true;
  setTimeout(() => {
    animate.value = "";
  }, 300);
  // clear setdefualt from all edit
  setDefault.value = {};
  isModalShow.value = false;

  // close the option modal
  const index = isOptionShow.value.length;
  isOptionShow.value[index - 1] = false;

  const indexDevo = isOptionShowDevo.value.length;
  isOptionShowDevo.value[indexDevo - 1] = false;
};
const deleteIndex = ref();
// open modal from the child component
const buttonShowDeleteModal = (sendTo, deleteid, indexDelete) => {
  deleteIndex.value = indexDelete;
  setTimeout(() => {
    deleteIndex.value = "";
  }, 3000);
  isDeleteModalShow.value = true;
  sendBy.value = sendTo;
  id = deleteid;
};
// close modal from the child component
const cancelButtonShowDeleteModal = (is_true) => {
  animate.value = is_true;
  console.log(is_true);
  setTimeout(() => {
    animate.value = "";
  }, 300);
  isDeleteModalShow.value = false;

  // close the option modal
  const index = isOptionShow.value.length;
  isOptionShow.value[index - 1] = false;

  const indexDevo = isOptionShowDevo.value.length;
  isOptionShowDevo.value[indexDevo - 1] = false;
};

// paginate
const nextPage = () => {
  if (galleries.value.length - 2 > currentPage.value) {
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

const devoPrevPage = () => {
  if (devoCurrentPage.value > 1) {
    devoCurrentPage.value--;
    refreshDataDevotional();
  }
};

const devoNextPage = () => {
  if (devotional.value.length - 2 > devoCurrentPage.value) {
    devoCurrentPage.value++;
    refreshDataDevotional();
  } else {
    refreshDataDevotional();
  }
};
const handleRefreshData = () => {
  refreshData();
  refreshDataDevotional();
};
const isLoading = ref(true);

onMounted(async () => {
  refreshData();
  refreshDataDevotional();
  await fetchUser();
});
</script>


<template>
  <!-- container -->
  <div class="py-3 px-4 lg:px-[50px] xl:px-32 mt-[60px] lg:mt-24 xl:mt-24">
    <!-- main wrap -> contain L&R sidebar -->
    <main class="flex w-full mb-24">
      <Left-Sidebar>
        <Sub-Header>
          <div class="flex items-center gap-2 pt-2 pb-0 lg:pb-3 xl:pb-3">
            <img
              :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${store.user.profile}`"
              alt="User profile"
              class="w-[45px] h-[45px] rounded-full"
              loading="lazy"
            />
            <textarea
              v-model="searchBy"
              rows="1"
              class="w-full h-12 resize-none truncate border border-gray-300 rounded-full p-[12px] text-left xs:text-sm sm:text-lg   "
              placeholder="Search the post"
            ></textarea>
            <div class="text-gray-600 flex items-center">
              <a
                class="relative flex text-gray-600 hover:text-gray-800  font-bold flex items-center cursor-pointer"
                ><div class="relative group">
                  <i
                    class="fas fa-plus p-2 bg-gray-100 text-lg rounded-lg group-hover:block cursor-pointer"
                  ></i>
                  <!--Contains buttons to add a post and a devotional post, which open a child component modal.-->
                  <div
                    class="absolute top-full right-0 bg-white border w-[200px] p-3 rounded-lg hidden group-hover:block"
                  >
                    <!-- Add post -->
                    <nav
                      @click="buttonShowModal('post', 'gallery')"
                      class="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 "
                    >
                      <i class="fas fa-images text-blue-400 p-2 rounded-lg"></i>
                      <h3
                        class="text-sm font-semibold text-gray-600 "
                      >
                        Create post
                      </h3>
                    </nav>
                    <!-- Add devotional -->
                    <nav
                      @click="buttonShowModal('post', 'devotional')"
                      class="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 "
                    >
                      <i class="fas fa-book text-red-500 p-2 rounded-lg"></i>
                      <h3
                        class="text-sm font-semibold xs:truncate text-gray-600 "
                      >
                        Create devotional
                      </h3>
                    </nav>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <!-- Contains a button for navigation to view either all posts or all devotionals. (applied mobile view) -->
          <div class="flex lg:hidden xl:hidden sm:px-4 mt-2 justify-between">
            <div
              @click="toggleAllposts"
              :class="Allposts ? 'border-b-2 border-blue-400' : ''"
              class="flex xl:hidden lg:hidden cursor-pointer items-center text-sm font-semibold text-gray-600 "
            >
              <a href="#">
                <i class="fas fa-image text-blue-400 mr-2"></i>
                All Posts
              </a>
            </div>

            <div
              @click="toggleDailyDevotion"
              :class="!Allposts ? 'border-b-2 border-blue-400' : ''"
              class="flex items-center gap-2 sm:p-2 xs:p-1 cursor-pointer"
            >
              <a href="#" class="flex items-center justify-center">
                <i class="fas fa-book text-red-500 mr-2"></i>
                <h3
                  class="text-sm font-semibold xs:truncate text-gray-600 "
                >
                  Daily Devotions
                </h3>
              </a>
            </div>

            <div
              class="flex items-center gap-2 p-2 rounded-sm cursor-pointer hover:bg-gray-100 "
            >
              <i class="fas fa-sort-amount-down text-yellow-700"></i>

              <h3
                class="text-sm font-semibold text-gray-600 "
              >
                Sort By
              </h3>
            </div>
          </div>
        </Sub-Header>
        <Post-Content :showAllpost="showAllpost" v-if="galleries.length !== 0">
          <tr
            v-for="(gallery, index) in galleries"
            :key="gallery.id"
            v-show="!gallery.is_deleted"
            class="shadow-b-sm lg:px-4 xl:px-4 block bg-white"
            :class="{
              'toast-top-bottom-animation-in': animate === 'GalleryPost',
              'toast-top-bottom-animation-out':
                animate === 'GalleryDelete' && index == deleteIndex,
            }"
          >
            <!--The table data-1 contains columns for profile, heading, caption, and date.-->
            <td class="block">
              <section
                class="flex items-center justify-between pt-5 lg:py-5 xl:py-5"
              >
                <div class="flex items-center mb-4">
                  <img
                    :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${gallery.profile}`"
                    class="rounded-full w-[45px] h-[45px] mr-4"
                    loading="lazy"
                  />
                  <div>
                    <div class="font-semibold">{{ gallery.fullname }}</div>
                  </div>
                </div>

                <div class="relative flex items-center mb-4 text-gray-600">
                  <!-- option btn -->
                  <i
                    v-if="storeID.id === gallery.user_id"
                    @click="optionButtonShow(index)"
                    class="fa fa-ellipsis mr-1 hover:bg-gray-100 p-3 rounded-full"
                  >
                  </i>

                  <!-- option  modal-->
                  <div
                    v-if="isOptionShow[index]"
                    class="bg-white rounded-lg shadow-lg w-[250px] absolute top-full right-0 z-[10] border"
                  >
                    <!-- header -> text & close btn -->
                    <div class="p-4 border-b">
                      <button
                        @click="optionButtonHide(index)"
                        id="closeModalBtn"
                        class="float-right text-gray-600 hover:text-gray-800"
                      >
                        &times;
                      </button>
                      <h3 class="text-lg font-semibold">Options</h3>
                    </div>
                    <!-- Contains delete and edit button-->
                    <div class="p-4">
                      <ul>
                        <li
                          @click="
                            buttonShowDeleteModal('gallery', gallery.id, index)
                          "
                          class="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center justify-start"
                        >
                          <i class="fas fa-trash mr-3"></i
                          ><span> Delete post </span>
                        </li>
                        <li
                          @click="
                            buttonShowModal(
                              'put',
                              'gallery',
                              gallery,
                              gallery.id
                            )
                          "
                          class="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center justify-start"
                        >
                          <i class="fas fa-edit mr-3"></i
                          ><span> Edit post</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <!--heading-->
              <section>
                <h4 class="text-lg mb-3 font-semibold">
                  {{ gallery.heading }}
                </h4>
              </section>

              <!--caption -->
              <section>
                <p class="mb-2 text-sm text-gray-600">
                  <span
                    :class="
                      showFullCaption[index]
                        ? 'flex'
                        : 'hidden sm:flex md:flex lg:flex xl:flex'
                    "
                  >
                    {{ gallery.caption }}
                  </span>
                  <span
                    :class="
                      !showFullCaption[index]
                        ? 'flex sm:hidden md:hidden lg:hidden xl:hidden'
                        : 'hidden'
                    "
                  >
                    {{ gallery.caption.substring(0, 100) }}
                  </span>
                </p>
                <small
                  @click="toggleCaption(index)"
                  class="text-gray-500 hover:text-gray-700 cursor-pointer flex sm:hidden md:hidden lg:hidden xl:hidden"
                >
                  {{ showFullCaption[index] ? "Show less" : "See more" }}
                </small>
              </section>

              <!--date -->
              <section class="text-sm text-gray-600">
                Posted on {{ getDate(gallery.posted_at) }}
              </section>
            </td>

            <!--The table data-2 contains an image slider-->
            <td
              v-if="parseImages(galleries[index].images).length !== 0"
              class="block w-full relative "
            >
              <div
                class="flex items-center justify-start w-full h-full gap-6 py-4 overflow-auto lg:gap-8 element-with-horizontal-scroll"
              >
                <div class="relative flex flex-shrink-0 w-full max-h-auto">
                  <img
                    class="rounded-xl w-full"
                    :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${
                      index === indexParent[index]
                        ? parseImages(galleries[index].images)[
                            currentImageIndex[index]
                          ]
                        : parseImages(galleries[index].images)[0]
                    }`"
                    alt="Image 1"
                    loading="lazy"
                  />
                </div>
                <button
                  v-if="currentImageIndex[index] > 0"
                  @click="showPrevImage(index)"
                  class="absolute top-1/2 left-1 md:left-4 lg:left-4 xl:left-4 transform -translate-y-1/2 text-white h-10 w-10 rounded-full bg-black bg-opacity-50"
                >
                  <i class="fas fa-arrow-left"></i>
                </button>
                <button
                  :class="[
                    parseImages(galleries[index].images).length - 1 !== 0
                      ? 'block'
                      : 'hidden',
                    parseImages(galleries[index].images).length - 1 ==
                    currentImageIndex[index]
                      ? 'hidden'
                      : 'block',
                  ]"
                  @click="showNextImage(index)"
                  class="absolute top-1/2 right-1 md:right-4 lg:right-4 xl:right-4 transform -translate-y-1/2 text-white p-2 rounded-full h-10 w-10 bg-black bg-opacity-50"
                >
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </td>
          </tr>
        </Post-Content>
        <!-- skeleton loader -->
        <section v-else v-show="!isLoading" class="w-full h-full">
          <div class="py-4 rounded animate-pulse w-full">
            <div class="flex p-4 space-x-4 sm:px-8">
              <div
                class="flex-shrink-0 w-16 h-16 rounded-full bg-gray-300"
              ></div>
              <div class="flex-1 py-2 space-y-4">
                <div class="w-full h-3 rounded bg-gray-300"></div>
                <div class="w-5/6 h-3 rounded bg-gray-300"></div>
              </div>
            </div>
            <div class="p-4 space-y-4 sm:px-8">
              <div class="w-1/2 h-4 rounded bg-gray-300"></div>
              <div class="w-2/3 h-4 rounded bg-gray-300"></div>
              <div class="w-full h-[200px] rounded bg-gray-300"></div>
            </div>
          </div>
        </section>
        <Post-Paginate
          v-if="showAllpost"
          :galleries="[galleries.length, showAllpost, currentPage]"
          @prevPage="prevPage"
          @nextPage="nextPage"
        />
        <DevotionalContent>
          <tr :class="!showAllpost ? 'block lg:hidden xl:hidden' : 'hidden'">
            <td
              v-for="(devotion, index) in devotional"
              :key="devotion.id"
              v-show="!devotion.is_deleted"
              class="block shadow-b-sm border-b pb-2"
              :class="{
                'toast-top-bottom-animation-in': animate === 'DevotionalPost',
                'toast-top-bottom-animation-out':
                  animate === 'DevotionalDelete',
              }"
            >
              <!-- section 1 details-->
              <section>
                <!-- box 1 profile-->
                <div class="flex items-center justify-between pt-5">
                  <div class="flex items-center mb-4">
                    <img
                      :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${devotion.profile}`"
                      class="rounded-full w-[45px] h-[45px] mr-4"
                      loading="lazy"
                    />
                    <div>
                      <div class="font-semibold">{{ devotion.fullname }}</div>
                    </div>
                  </div>
                  <div class="relative flex items-center mb-4 text-gray-600">
                    <i
                      v-if="storeID.id === devotion.user_id"
                      @click="optionButtonShowDevo(index)"
                      class="fa fa-ellipsis mr-1 hover:bg-gray-100 p-3 rounded-full"
                    ></i>
                    <!-- options -->
                    <div
                      v-if="isOptionShowDevo[index]"
                      class="bg-white rounded-lg shadow-lg w-[250px] absolute top-full right-0 z-[10] border"
                    >
                      <div class="p-4 border-b">
                        <button
                          @click="optionButtonHideDevo(index)"
                          id="closeModalBtn"
                          class="float-right text-gray-600 hover:text-gray-800"
                        >
                          &times;
                        </button>
                        <h3 class="text-lg font-semibold">Options</h3>
                      </div>
                      <div class="p-4">
                        <ul>
                          <li
                            @click="
                              buttonShowDeleteModal(
                                'devotional',
                                devotion.id,
                                index
                              )
                            "
                            class="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center justify-start"
                          >
                            <i class="fas fa-trash mr-3"></i
                            ><span> Delete post </span>
                          </li>
                          <li
                            @click="
                              buttonShowModal(
                                'put',
                                'devotional',
                                devotion,
                                devotion.id
                              )
                            "
                            class="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center justify-start"
                          >
                            <i class="fas fa-edit mr-3"></i
                            ><span> Edit post</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- box 2  heading-->
                <h4 class="text-md mb-3 font-semibold">
                  {{ getTranslation(devotion.translation) }}
                </h4>
                <div>
                  <h4
                    v-for="(verse, index) in parseText(devotion.verses)"
                    :key="index"
                    class="text-sm mb-3"
                  >
                    <span class="font-semibold mr-2">{{
                      verse.reference
                    }}</span>
                    <span>{{ verse.text }}</span>
                  </h4>
                </div>
                <!-- box 3 caption -->
                <div>
                  <h1 class="font-semibold text-md">Reflection:</h1>
                  <p class="mb-2 text-sm text-gray-600">
                    <span
                      :class="
                        showFullCaption[index]
                          ? 'flex'
                          : 'hidden sm:flex md:flex lg:flex xl:flex'
                      "
                    >
                      {{ devotion.reflection }}
                    </span>
                    <span
                      :class="
                        !showFullCaption[index]
                          ? 'flex sm:hidden md:hidden lg:hidden xl:hidden'
                          : 'hidden'
                      "
                    >
                      {{ devotion.reflection.substring(0, 100) }}
                    </span>
                  </p>
                  <small
                    @click="toggleCaption(index)"
                    class="text-gray-500 hover:text-gray-700 cursor-pointer flex sm:hidden md:hidden lg:hidden xl:hidden"
                  >
                    {{ showFullCaption[index] ? "Show less" : "See more" }}
                  </small>
                </div>
                <small class="text-gray-600"
                  >Posted on {{ getDate(devotion.posted_at) }}</small
                >
              </section>
            </td>
            <Devotional-Paginate
              :devotional="[devotional.length, devoCurrentPage]"
              @devoPrevPage="devoPrevPage"
              @devoNextPage="devoNextPage"
            />
          </tr>
        </DevotionalContent>
      </Left-Sidebar>

      <Right-Sidebar>
        <div
          v-for="(devotion, index) in devotional"
          :key="devotion.id"
          v-show="!devotion.is_deleted"
          class="shadow-b-sm border-b mx-4 pb-2"
          :class="{
            'toast-top-bottom-animation-in': animate === 'DevotionalPost',
            'toast-top-bottom-animation-out': animate === 'DevotionalDelete',
          }"
        >
          <!-- section 1 details-->
          <section>
            <!-- box 1 profile-->
            <div class="flex items-center justify-between lg:py-5 xl:py-5">
              <div class="flex items-center mb-4">
                <img
                  :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${devotion.profile}`"
                  class="rounded-full h-12 w-12 mr-4"
                  loading="lazy"
                />
                <div>
                  <div class="font-semibold">{{ devotion.fullname }}</div>
                  <small class="text-gray-600"
                    >Posted on {{ getDate(devotion.posted_at) }}</small
                  >
                </div>
              </div>
              <div class="relative flex items-center mb-4 text-gray-600">
                <i
                  v-if="storeID.id === devotion.user_id"
                  @click="optionButtonShowDevo(index)"
                  class="fa fa-ellipsis mr-1 hover:bg-gray-100 p-3 rounded-full"
                ></i>
                <!-- options -->
                <div
                  v-if="isOptionShowDevo[index]"
                  class="bg-white rounded-lg shadow-lg w-[250px] absolute top-full right-0 z-[10] border"
                >
                  <div class="p-4 border-b">
                    <button
                      @click="optionButtonHideDevo(index)"
                      id="closeModalBtn"
                      class="float-right text-gray-600 hover:text-gray-800"
                    >
                      &times;
                    </button>
                    <h3 class="text-lg font-semibold">Options</h3>
                  </div>
                  <div class="p-4">
                    <ul>
                      <li
                        @click="
                          buttonShowDeleteModal(
                            'devotional',
                            devotion.id,
                            index
                          )
                        "
                        class="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center justify-start"
                      >
                        <i class="fas fa-trash mr-3"></i
                        ><span> Delete post</span>
                      </li>
                      <li
                        @click="
                          buttonShowModal(
                            'put',
                            'devotional',
                            devotion,
                            devotion.id
                          )
                        "
                        class="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center justify-start"
                      >
                        <i class="fas fa-edit mr-3"></i><span> Edit post</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- box 2  heading-->
            <div>
              <h4 class="text-md mb-3 font-semibold">
                {{ getTranslation(devotion.translation) }}
              </h4>
              <h4
                v-for="(verse, index) in parseText(devotion.verses)"
                :key="index"
                class="text-sm mb-3"
              >
                <span class="font-semibold mr-2">{{ verse.reference }}</span>
                <span>{{ verse.text }}</span>
              </h4>
            </div>
            <!-- box 3 caption -->
            <div>
              <h1 class="font-semibold text-md">Reflection:</h1>
              <p class="mb-2 text-sm text-gray-600">
                <span
                  :class="
                    showFullCaption[index]
                      ? 'flex'
                      : 'hidden sm:flex md:flex lg:flex xl:flex'
                  "
                >
                  {{ devotion.reflection }}
                </span>
                <span
                  :class="
                    !showFullCaption[index]
                      ? 'flex sm:hidden md:hidden lg:hidden xl:hidden'
                      : 'hidden'
                  "
                >
                  {{ devotion.reflection.substring(0, 100) }}...
                </span>
              </p>
              <small
                @click="toggleCaption(index)"
                class="text-gray-500 hover:text-gray-700 cursor-pointer flex sm:hidden md:hidden lg:hidden xl:hidden"
              >
                {{ showFullCaption[index] ? "Show less" : "See more" }}
              </small>
            </div>
          </section>
        </div>
        <Devotional-Paginate
          :devotional="[devotional.length, devoCurrentPage]"
          @devoPrevPage="devoPrevPage"
          @devoNextPage="devoNextPage"
        />
      </Right-Sidebar>
    </main>
    <footer>
      <div
        class="hidden md:flex lg:flex xl:flex py-5 mt-5 m-auto text-gray-800 text-sm flex-col items-center border-t max-w-screen-xl"
      >
        <p>© Copyright 2023. All Rights Reserved.</p>
      </div>
    </footer>

    <Delete-Component
      :isDeleteModalShow="isDeleteModalShow"
      :sendBy="sendBy"
      :id="id"
      @refreshData="handleRefreshData"
      @cancelButtonShowDeleteModal="cancelButtonShowDeleteModal"
    />
    <CreateEdit-Component
      :isModalShow="isModalShow"
      :method="method"
      :sendBy="sendBy"
      :setDefault="setDefault"
      :id="id"
      @refreshData="handleRefreshData"
      @buttonHideModal="buttonHideModal"
    />
  </div>
</template>

