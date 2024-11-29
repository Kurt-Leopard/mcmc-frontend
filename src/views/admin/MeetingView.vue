<template>
  <main>
    <HeaderComponent />
    <div class="p-3">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold mb-4 w-full">Meetings List</h2>  <div class="w-full flex justify-end py-4 px-2">
          <i @click="meetingToggler" class="fas fa-plus p-3 bg-gray-50 rounded-md hover:bg-gray-100 mb-2 group-hover:block cursor-pointer"></i>
        </div>
      </div>
      
        <div v-if="toggleMeeting" class="fixed top-0 left-0 flex items-center justify-center w-full h-screen">
          <span class="fixed top-0 left-0 bg-gray-500 opacity-[.3] w-full h-screen" @click="toggleMeeting=false"></span>
          <div
            class="border bg-white p-4 shadow-md rounded-lg  w-[calc(100%-5%)] lg:w-1/2 z-10"
          >
            <h3 class="py-2 font-semibold text-gray-700 border-b">
              Meeting Schedule
            </h3>
            <input
              v-model="date"
              type="date"
              name="date"
              id="date"
              class="bg-gray-50 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 my-1"
              required
            />
            <input
              v-model="time"
              type="time"
              name="time"
              id="time"
              class="bg-gray-50 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 my-1"
              required
            />
            <input
              v-model="location"
              type="text"
              name="text"
              id="text"
              class="bg-gray-50 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 my-1"
              required
              placeholder="Location"
            />
            <h4 class="font-normal mt-4 mb-2 text-gray-700 border-b"></h4>
            <textarea
              v-model="description"
              rows="3"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Description"
            ></textarea
            ><button
              @click="saveMeeting"
              class="text-white w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Save
            </button>
          </div>
        </div>
      <section class="w-full">
        <!-- Meeting List -->
      

        <div class="overflow-auto max-h-[400px]">
          <table
            class="w-full divide-y divide-gray-200 inline-block max-h-[360px] overflow-y-auto element-with-horizontal-scroll"
          >
            <thead class="bg-gray-50 w-full inline-block">
              <tr class="w-full inline-block grid grid-cols-3">
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>

                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white divide-y divide-gray-200 w-full inline-block"
            >
              <tr
                v-for="(meeting, index) in meetings"
                :key="index"
                class="w-full inline-block grid grid-cols-3 text-gray-500 text-sm"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ meeting.dates[0] + " , " + meeting.time }}
                </td>
                <td
                  class="px-6 py-4"
                  style="white-space: normal; overflow-wrap: break-word"
                >
                  {{ meeting.description }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="selectModalMeeting(meeting)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="fixed w-full h-full top-0 left-0 flex justify-center items-center"
          v-if="openModal"
        >
          <span
            class="fixed top-0 left-0 bg-black w-full h-full opacity-[.3] flex"
            @click="openModal = false"
          ></span>
          <div
            class="meeting-detail border bg-white p-4 shadow-md rounded-lg fixed w-[calc(100%-5%)] lg:w-1/2"
          >
            <h3 class="py-2 font-semibold text-gray-700 border-b">
              {{ selectedMeeting.title || "No meeting selected" }}
            </h3>
            <p class="mb-2 text-gray-700 py-2">
              {{
                selectedMeeting.description ||
                "Please select a meeting to view its details."
              }}
            </p>
            <p v-if="selectedMeeting.organizer" class="text-gray-600 text-sm">
              Location: {{ selectedMeeting.location }}
            </p>
            <p v-if="selectedMeeting.date" class="text-gray-500 text-sm">
              {{ formatDate(selectedMeeting.date) }}
            </p>
            <h4 class="font-normal mt-4 mb-2 text-gray-700 border-b"></h4>
          </div>
        </div>
      </section>

      <!-- Pagination Controls -->
      <div
        class="flex justify-center items-center text-gray-500 space-x-4 my-4 w-full border-t pt-4"
        v-if="!openModal"
      >
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="hover:text-gray-800 cursor-pointer text-sm"
        >
          Prev
        </button>
        <small>Page {{ currentPage }}</small>
        <button
          @click="currentPage++"
          :disabled="meetings.length < itemsPerPage"
          class="hover:text-gray-800 cursor-pointer text-sm"
        >
          Next
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "../../../axios";
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores/store";
import { decodeJWT } from "../../stores/token";
const toast = useToast();

const store = useAuthStore();

const user = ref("");
if (store) {
  user.value = decodeJWT(store.token);
}

const openModal = ref(false);
const meetings = ref([]);
const selectedMeeting = ref({
  title: "",
  description: "",
  date: "",
  organizer: "",
  location: "",
});
const reply = ref("");
const searchBy = ref("");
const searchByDate = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const toggleMeeting = ref(false);

const selectModalMeeting = (meeting) => {
  openModal.value = true;
  selectedMeeting.value = {
    title: meeting.title || "Meeting Schedule",
    description: meeting.description || "No description",
    date: meeting.date,
    organizer: meeting.organizer || "Unknown",
    location: meeting.popover.label,
  };
};

const meetingToggler = () => {
  toggleMeeting.value = !toggleMeeting.value;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

const fetchMeetings = async () => {
  try {
    const response = await axios.get(`/api/get-meeting`);
    meetings.value = response.data.results;
    console.log(meetings.value[0].popover.label);
  } catch (error) {
    console.error("Error fetching meetings:", error);
  }
};
const date = ref(null);
const time = ref(null);
const location = ref(null);
const description = ref(null);
const convertTo12HourFormat = (time24) => {
  const [hours, minutes] = time24.split(":");
  let hoursInt = parseInt(hours, 10);
  const period = hoursInt >= 12 ? "PM" : "AM";
  hoursInt = hoursInt % 12 || 12;
  return `${hoursInt}:${minutes} ${period}`;
};
const saveMeeting = async () => {
  const formattedTime = convertTo12HourFormat(time.value);
  const data = {
    userid: user.value.id,
    date: date.value,
    time: formattedTime,
    location: location.value,
    description: description.value,
  };
  try {
    const response = await axios.post(`/api/save-meeting`, data);
    if (response.status === 200) {
      fetchMeetings();
      toast.success(response.data.message);
      toggleMeeting.value = false;
    }
  } catch (error) {
    console.error("Error fetching meetings:", error);
  }
};

const refreshData = () => {
  currentPage.value = 1;
  fetchMeetings();
};

watch([searchBy, searchByDate, currentPage], fetchMeetings);

onMounted(fetchMeetings);
</script>
