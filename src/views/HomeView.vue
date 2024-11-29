<script setup>
import { ref, onMounted } from "vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import axios from "../../axios";
import { useAuthStore } from "../stores/store";
import DangerComponent from "../components/toast/DangerComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";

const mission = ref(false);
const vision = ref(false);
const goal = ref(false);

const buttonMission = () => {
  mission.value = true;
};
const buttonVision = () => {
  vision.value = true;
};
const buttonGoal = () => {
  goal.value = true;
};

const closeMission = () => {
  mission.value = false;
};
const closeVision = () => {
  vision.value = false;
};
const closeGoal = () => {
  goal.value = false;
};
const store = useAuthStore();
const slideAnimation = ref(false);
// login
const loginVisible = ref(false);

const gotoLogin = () => {
  slideAnimation.value = false;
  loginVisible.value = true;
};
const openLogin = (status) => {
  loginVisible.value = status;
  registerVisible.value = false;
};
const hideLogin = () => {
  slideAnimation.value = true;
};

// register
const registerVisible = ref(false);
const openRegister = (status) => {
  loginVisible.value = false;
  registerVisible.value = status;
};
const hideRegister = (status) => {
  slideAnimation.value = true;
  loginVisible.value = true;
  registerVisible.value = status;
};

// Autoplay
const autoplay = ref(true);

const startAutoplay = () => {
  setInterval(() => {
    autoplay.value = !autoplay.value;
  }, 8000);
};

// scroll back

onMounted(() => {
  startAutoplay();
  window.scrollTo(0, 0);
});

// image view fullscreen
const showImages = ref([false, false, false, false]);
const hideImages = ref([false, false, false, false]);

const btnimg = (index) => {
  hideImages.value[index - 1] = false;
  showImages.value[index - 1] = true;
};

const hideImg = (index) => {
  hideImages.value[index] = true;
  setTimeout(() => {
    showImages.value[index] = false;
  }, 300);
};
const images = import.meta.glob('../assets/gallery*.png', { eager: true });
const imageUrls = Object.values(images);
// contact

// Form data
const formData = ref({
  fullname: "",
  email: "",
  message: "",
});
const responseStatus = ref(null);
const responseMessage = ref("");

const closeToast = () => {
  responseStatus.value = null;
  responseMessage.value = "";
};
// Method to handle form submission
const submitForm = async () => {
  try {
    const response = await axios.post("/api/contact/", formData.value);
    if (response.status === 200) {
      const data = {
        responseStatus: response.status,
        responseMessage: response.data.message,
      };
      store.setToastSuccess(data);
      formData.value = { fullname: "", email: "", message: "" };
    }
  } catch (error) {
    if (error.response) {
      responseStatus.value = error.response.status;
      responseMessage.value = error.response.data.message;
    }
  }
};
</script>


<template>
  <main class="py-3 px-4 lg:px-[50px] xl:px-32 mt-24">
    <RegisterView
      @hide="hideRegister"
      @openLogin="openLogin"
      v-show="registerVisible"
      class="fixed w-full top-0 left-0 animate-slide-in-login"
      :class="slideAnimation ? 'animate-slide-out-login' : ''"
      style="z-index: 101"
    />

    <LoginView
      v-show="loginVisible"
      @hide="hideLogin"
      @openRegister="openRegister"
      class="fixed w-full top-0 left-0 animate-slide-in-login"
      :class="slideAnimation ? 'animate-slide-out-login' : ''"
      style="z-index: 101"
    />
    <section class="flex items-center">
      <div class="flex w-full lg:w-1/2 xl:w-1/2">
        <ul>
          <li class="text-2xl lg:text-3xl xl:text-3xl font-bold text-[#D98757]">
            Welcome,
          </li>
          <li
            class="text-lg lg:text-2xl xl:text-2xl font-semibold subtext text-gray-600"
          >
            we're so glad you're here!
          </li>
        </ul>
      </div>
    </section>
    <section class="w-full flex items-center text-center mt-2">
      <h1
        v-if="autoplay"
        :key="1"
        class="hidden lg:block xl:block fade-in absolute left-[0%] z-10 w-full text-2xl px-4 lg:text-3xl xl:text-4xl font-semibold subtext text-white"
        style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
      >
        Elevate Your Day with Unforgettable Moments.
        <!-- ELEVATE YOUR DAY WITH UNFORGATTABLE MOMENTS. -->
      </h1>
      <h1
        v-else
        :key="2"
        class="hidden lg:block xl:block fade-in absolute left-[0%] z-10 px-4 w-full text-2xl lg:text-3xl xl:text-4xl font-semibold subtext text-white"
        style="text-shadow: 2px 2px 4px rgba(0, 0, 1, 0.9)"
      >
        Join us for worship Sundays 9:30 am to 11:30 am
      </h1>
      <h1 class="hidden lg:block xl:block absolute left-[0%] mt-40 w-full z-10">
        <button
          @click="gotoLogin"
          class="inline-block bg-[#F4D4B7] p-2 lg:py-2 xl:py-2 rounded-full text-lg w-[120px] lg:w-[130px] xl:w-[150px] border-[2px] border-white text-[#602E17] font-semibold"
        >
          Sign In
        </button>
      </h1>
      <div
        v-if="autoplay"
        :key="1"
        class="relative w-full flex justify-center items-end"
      >
        <ul class="absolute flex justify-center items-center bottom-5 z-10">
          <li
            class="bg-white px-4 rounded-full py-1 mt-4 mx-1"
            :style="{ background: autoplay ? 'white' : 'gray' }"
          ></li>
          <li
            class="bg-white px-4 rounded-full py-1 mt-4 mx-1"
            :style="{ background: !autoplay ? 'white' : 'gray' }"
          ></li>
        </ul>
        <img
          src="../assets/lgbg.png"
          class="hidden w-full fade-in sm:block lg:block xl:block"
        />
        <img
          src="../assets/smbg.png"
          class="w-full h-[30vh] fade-in sm:hidden md:hidden lg:hidden xl:hidden"
        />
        <div class="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
      </div>
      <div
        v-else
        :key="2"
        class="relative w-full flex justify-center items-end"
      >
        <ul class="absolute flex justify-center items-center bottom-5 z-10">
          <li
            class="bg-white px-4 rounded-full py-1 mt-4 mx-1"
            :style="{ background: autoplay ? 'white' : 'gray' }"
          ></li>
          <li
            class="bg-white px-4 rounded-full py-1 mt-4 mx-1"
            :style="{ background: !autoplay ? 'white' : 'gray' }"
          ></li>
        </ul>
        <img
          src="../assets/lgbg1.png"
          class="hidden w-full fade-in sm:block lg:block xl:block rounded-lg"
          loading="lazy"
        />
        <img
          src="../assets/lgbg1.png"
          class="w-full h-[30vh] fade-in sm:hidden md:hidden rounded-lg lg:hidden xl:hidden"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
      </div>
    </section>
    <!-- login sm -->
    <section
      class="lg:flex xl:flex mt-[20px] gap-12 text-center justify-center"
    >
      <div
        @click="buttonMission"
        class="flex flex-col items-center p-4 bg-white my-8 rounded-lg shadow-lg border lg:border-0 lg:shadow-none xl:border-0 xl:shadow-none cursor-pointer"
      >
        <i class="text-[#D98757] bg-orange-50 p-5 my-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
            />
          </svg>
        </i>
        <h3 class="text-xl font-semibold subtext text-gray-600 mb-2">
          Our Mission
        </h3>
        <p class="text-gray-600 lg:hidden xl:hidden">
          Our mission is to serve our community with unwavering dedication,
          guided by the principles of love and respect.
        </p>
      </div>
      <div
        v-if="mission"
        class="modal hidden fixed w-full h-full top-0 left-0 flex items-center justify-center z-30 lg:flex xl:flex cursor-pointer"
      >
        <!-- hoverlay  -->
        <div
          class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        ></div>

        <div
          class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
        >
          <!-- Add modal content here -->
          <div class="modal-content py-4 text-left px-6">
            <div class="flex justify-between items-center pb-3">
              <p class="text-2xl font-bold">Our Mission</p>
              <div class="modal-close cursor-pointer z-50">
                <svg
                  class="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M1.39 1.393l15.318 15.314m-15.318 0L16.706 1.393" />
                </svg>
              </div>
            </div>
            <p>
              Our mission is to serve our community with unwavering dedication,
              guided by the principles of love and respect.
            </p>

            <div class="mt-4 flex justify-end">
              <button
                @click="closeMission"
                class="modal-close px-4 bg-gray-100 p-3 rounded-lg text-black hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- vission -->
      <div
        @click="buttonVision"
        class="flex flex-col items-center p-4 my-8 bg-white rounded-lg shadow-lg border lg:border-0 lg:shadow-none xl:border-0 xl:shadow-none cursor-pointer"
      >
        <i
          class="fas fa-eye text-[#D98757] bg-orange-50 p-6 my-3 rounded-full"
        ></i>

        <h3 class="text-xl font-semibold subtext text-gray-600 mb-2">
          Our Vision
        </h3>
        <p class="text-gray-600 lg:hidden xl:hidden">
          We envision a world where every individual is uplifted and empowered
          through spiritual growth and communal support.
        </p>
      </div>

      <div
        v-if="vision"
        class="modal hidden fixed w-full h-full top-0 left-0 flex items-center justify-center z-30 lg:flex xl:flex cursor-pointer"
      >
        <!-- hoverlay  -->
        <div
          class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        ></div>

        <div
          class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
        >
          <!-- Add modal content here -->
          <div class="modal-content py-4 text-left px-6">
            <div class="flex justify-between items-center pb-3">
              <p class="text-2xl font-bold">Our Vision</p>
              <div class="modal-close cursor-pointer z-50">
                <svg
                  class="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M1.39 1.393l15.318 15.314m-15.318 0L16.706 1.393" />
                </svg>
              </div>
            </div>
            <p>
              We envision a world where every individual is uplifted and
              empowered through spiritual growth and communal support.
            </p>

            <div class="mt-4 flex justify-end">
              <button
                @click="closeVision"
                class="modal-close px-4 bg-gray-100 p-3 rounded-lg text-black hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Goal -->
      <div
        @click="buttonGoal"
        class="flex flex-col items-center p-4 my-8 bg-white rounded-lg shadow-lg border lg:border-0 lg:shadow-none xl:border-0 xl:shadow-none cursor-pointer"
      >
        <i
          class="fas fa-flag text-[#D98757] bg-orange-50 p-6 my-3 rounded-full"
        ></i>

        <h3 class="text-xl font-semibold subtext text-gray-600 mb-2">
          Our Goal
        </h3>
        <p class="text-gray-600 lg:hidden xl:hidden">
          Our goals include fostering a supportive environment, expanding our
          outreach efforts, and continually enriching the lives of those we
          serve.
        </p>
      </div>

      <div
        v-if="goal"
        class="modal hidden fixed w-full h-full top-0 left-0 flex items-center justify-center z-30 lg:flex xl:flex cursor-pointer"
      >
        <!-- hoverlay  -->
        <div
          class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        ></div>

        <div
          class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
        >
          <!-- Add modal content here -->
          <div class="modal-content py-4 text-left px-6">
            <div class="flex justify-between items-center pb-3">
              <p class="text-2xl font-bold">Our Goal</p>
              <div class="modal-close cursor-pointer z-50">
                <svg
                  class="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M1.39 1.393l15.318 15.314m-15.318 0L16.706 1.393" />
                </svg>
              </div>
            </div>
            <p>
              Our goals include fostering a supportive environment, expanding
              our outreach efforts, and continually enriching the lives of those
              we serve.
            </p>

            <div class="mt-4 flex justify-end">
              <button
                @click="closeGoal"
                class="modal-close px-4 bg-gray-100 p-3 rounded-lg text-black hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="lg:flex xl:flex md:flex justify-between items-center my-6">
        <h1 class="text-2xl lg:text-3xl xl:text-3xl font-bold text-[#D98757]">
          Gallery
        </h1>
        <p class="hidden max-w-screen-sm text-gray-500 md:block">
          This section highlights key moments from the Christian Mission
          Church’s ministry. See images of our outreach, service events, and
          worship activities, reflecting our dedication to faith and community.
        </p>
        <RouterLink
          to="/gallery"
          class="lg:border xl:border md:border py-3 md:p-3 lg:p-3 xl:p-3 rounded-lg"
        >
          <i class="fas fa-images mr-2"></i> View more
        </RouterLink>
      </div>
      <section class="bg-white bg-white">
        <div class="py-4 sm:py-4">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-full"
          >
            <div
              class="col-span-2 sm:col-span-1 md:col-span-2 bg-gray-50 h-auto md:h-full flex flex-col"
            >
              <a
                @click="btnimg(1)"
                class="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow cursor-pointer"
              >
                <img
                  src="../assets/gallery1.png"
                  alt=""
                  class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"
                ></div>
              </a>
            </div>

            <div class="col-span-2 sm:col-span-1 md:col-span-2 bg-stone-50">
              <a
                @click="btnimg(2)"
                class="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mb-4 cursor-pointer"
              >
                <img
                  src="../assets/gallery2.png"
                  alt=""
                  class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  loading="lazy"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"
                ></div>
              </a>
              <div class="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
                <a
                  @click="btnimg(3)"
                  class="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 cursor-pointer"
                >
                  <img
                    src="../assets/gallery3.png"
                    alt=""
                    class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"
                  ></div>
                </a>
                <a
                  @click="btnimg(4)"
                  class="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 cursor-pointer"
                >
                  <img
                    src="../assets/gallery4.png"
                    alt=""
                    class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"
                  ></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

       <div
      v-for="(show, index) in showImages"
      :key="index"
      v-show="show"
      :class="hideImages[index] ? 'animate-slide-out-view-screen' : ''"
      class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black animate-slide-view-screen"
      style="z-index: 102"
    >
      <div class="p-4">
        <p class="flex justify-end">
          <svg
            @click="hideImg(index)"
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 my-4 text-white hover:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </p>
        <img
          :src="imageUrls[index]"
          :alt="'gallery' + (index + 1)"
          class="px-1 w-[800px] h-[300px] lg:h-[500px] xl:h-[500px] object-cover"
          loading="lazy"
        />
      </div>
    </div>
    </section>

    <section>
      <hr class="my-12 text-slate-900" />
      <div class="w-full lg:flex xl:flex">
        <div class="w-full lg:w-1/2 xl:w-1/2 my-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d206.72138946947607!2d123.94860051579363!3d10.252803332193096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99b00444675c9%3A0xcd074734b969c93b!2sHMAC%20MOTORS!5e1!3m2!1sen!2sph!4v1718985097110!5m2!1sen!2sph"
            height="100%"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="rounded-lg w-full border-0"
          ></iframe>
        </div>
        <div
          class="w-full lg:w-1/2 xl:w-1/2 lg:px-8 xl:px-8 flex items-center justify-center my-12"
        >
          <nav>
            <h1 class="font-bold text-3xl lg:px-8 xl:px-8 text-[#D98757]">
              Get in touch with us
            </h1>
            <h1 class="text-lg lg:px-8 xl:px-8 font-semibold">
              Send a message.
            </h1>
            <div
              class="px-4 md:px-8 lg:px-8 xl:px-8 py-2 bg-gray-50 rounded-xl my-6"
            >
              <form @submit.prevent="submitForm" class="text-center">
                <input
                  type="text"
                  v-model="formData.fullname"
                  class="p-3 border w-full my-3 border rounded-lg"
                  placeholder="Enter your fullname"
                />
                <input
                  type="email"
                  v-model="formData.email"
                  class="p-3 border w-full my-3 border rounded-lg"
                  placeholder="Enter your email"
                />
                <textarea
                  rows=""
                  cols=""
                  v-model="formData.message"
                  class="p-3 border w-full my-3 border rounded-lg"
                  placeholder="Type something"
                ></textarea>
                <button
                  type="submit"
                  class="p-3 bg-[#D98757] w-32 rounded-lg font-semibold text-white my-3"
                >
                  Submit
                </button>
              </form>
            </div>
          </nav>
        </div>
      </div>
    </section>
    <Footer-Component />
    <Danger-Component
      :errors="[responseStatus, responseMessage]"
      @closeToast="closeToast"
    />
  </main>
</template>
<style scoped>
@keyframes slide-in-login {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.animate-slide-in-login {
  animation: slide-in-login 0.5s forwards;
}

@keyframes slide-out-login {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}

.animate-slide-out-login {
  animation: slide-out-login 0.5s forwards;
}

@keyframes slide-view-screen {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
.animate-slide-view-screen {
  animation: slide-view-screen 0.5s forwards;
}

@keyframes slide-out-view-screen {
  from {
    transform: translateY(0%);
  }

  to {
    transform: translateY(100%);
  }
}
.animate-slide-out-view-screen {
  animation: slide-out-view-screen 0.5s forwards;
}
</style>
