
<script setup>
import { ref, onMounted } from "vue";
import axios from "../../axios";
import { useAuthStore } from "../stores/store";
import DangerComponent from "../components/toast/DangerComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";

const store = useAuthStore();
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
onMounted(()=>{
  window.scrollTo(0, 0);
})
</script>


<template>
  <section class="py-3 px-4 lg:px-[50px] xl:px-32 mt-24">
    <div>
      <section>
        <div>
          <div>
            <div class="border-b mb-5 flex justify-between text-sm">
              <div
                class="text-[#D98757] flex items-center pb-2 pr-2 border-b-2 border-[#D98757] uppercase"
              >
                <i class="fas fa-envelope text-lg mr-2"></i>
                <a class="font-semibold inline-block">CONTACT US</a>
              </div>
            </div>
          </div>
          <section
            class="lg:flex xl:flex items-center justify-center lg:bg-gray-50 xl:bg-gray-50 lg:px-8 xl:px-8 rounded-lg"
          >
            <div class="w-full">
              <h1
                class="my-6 text-2xl font-semibold text-gray-800 md:text-3xl "
              >
                We’d love to hear from you!
              </h1>
              <h1>
                Whether you have questions, need prayer, or just want to say
                hello, feel free to reach out to us. We’re here to connect and
                support you.
              </h1>
              <div class="my-6">
                <i class="fab fa-facebook p-3 bg-gray-50 rounded-full mr-3"></i>
                <i
                  class="fab fa-instagram p-3 bg-gray-50 rounded-full mr-3"
                ></i>
                <i class="fab fa-tiktok p-3 bg-gray-50 rounded-full mr-3"></i>
              </div>
            </div>
            <div class="w-full flex items-center justify-center">
              <nav>
                <div
                  class="px-4 md:px-8 lg:px-8 xl:px-8 py-2 bg-gray-50 rounded-xl my-6"
                >
                  <form @submit.prevent="submitForm" class="text-center">
                    <input
                      type="text"
                      v-model="formData.fullname"
                      class="p-3 border w-full my-1 border rounded-lg"
                      placeholder="Enter your fullname"
                    />
                    <input
                      type="email"
                      v-model="formData.email"
                      class="p-3 border w-full my-1 border rounded-lg"
                      placeholder="Enter your email"
                    />
                    <textarea
                      v-model="formData.message"
                      rows=""
                      cols=""
                      class="p-3 border w-full my-1 border rounded-lg"
                      placeholder="Type something"
                    ></textarea>
                    <button
                      type="submit"
                      class="inline-block rounded bg-[#D98757] px-12 py-3 text-sm font-medium text-white transition hover:bg-[#D98757] focus:outline-none focus:ring focus:ring-orange-200"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </nav>
            </div>
          </section>

          <div
            class="grid grid-cols-1 gap-12 mt-10 lg:grid-cols-3 sm:grid-cols-2"
          >
            <div
              class="p-4 rounded-lg bg-white md:p-6  border shadow-xl"
            >
              <span
                class="inline-block p-3 text-white rounded-lg bg-[#D98757] "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </span>

              <h2
                class="mt-4 text-base font-medium text-gray-800 "
              >
                Email us
              </h2>
              <p class="mt-2 text-sm text-gray-500 ">
                Reach out to our church.
              </p>
              <p class="mt-2 text-sm text-gray-500 ">
                mcmc.com
              </p>
            </div>

            <div
              class="p-4 rounded-lg bg-white md:p-6  border shadow-xl"
            >
              <span
                class="inline-block p-3 text-white rounded-lg bg-[#D98757] "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </span>

              <h2
                class="mt-4 text-base font-medium text-gray-800 "
              >
                Visit us
              </h2>
              <p class="mt-2 text-sm text-gray-500 ">
                Visit our church
              </p>
              <p class="mt-2 text-sm text-gray-500 ">
                100 Smith Street Collingwood VIC 3066 AU
              </p>
            </div>

            <div
              class="p-4 rounded-lg bg-white md:p-6  border shadow-xl"
            >
              <span
                class="inline-block p-3 text-white rounded-lg bg-[#D98757] "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </span>

              <h2
                class="mt-4 text-base font-medium text-gray-800 "
              >
                Call us
              </h2>
              <p class="mt-2 text-sm text-gray-500 ">
                Mon-Fri from 8am to 5pm.
              </p>
              <p class="mt-2 text-sm text-gray-500 ">
                +1 (555) 000-0000
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="mb-24">
        <div class="w-full lg:flex xl:flex my-12">
          <div class="w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d206.72138946947607!2d123.94860051579363!3d10.252803332193096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99b00444675c9%3A0xcd074734b969c93b!2sHMAC%20MOTORS!5e1!3m2!1sen!2sph!4v1718985097110!5m2!1sen!2sph"
              height="400"
              width="100%"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="rounded-lg w-full border-0"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
   <footer>
      <Footer-Component/>
    </footer>
    <Danger-Component
      :errors="[responseStatus, responseMessage]"
      @closeToast="closeToast"
    />
  </section>
</template>
