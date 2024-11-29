<template>
  <main>
    <HeaderComponent />
    <div class="p-3">
      <h2 class="text-2xl font-semibold mb-4">Received Emails Inbox</h2>
      <div class="mb-4 flex justify-between items-center gap-3">
        <input v-model="searchBy" @input="refreshData" type="text" placeholder="Search by particular or amount"
          class="border border-gray-300 p-2 rounded w-full" />
        <input v-model="searchByDate" @change="refreshData" type="month" placeholder="Search by month and year"
          class="border border-gray-300 p-2 rounded w-1/3" />
      </div>

      <!-- Responsive grid for emails list and detail view -->
      <section class="w-full">
        <!-- Email List -->
        <div class="overflow-auto max-h-[400px]">
          <table class="w-full divide-y divide-gray-200 inline-block  max-h-[360px] overflow-y-auto element-with-horizontal-scroll">
            <thead class="bg-gray-50 w-full inline-block ">
              <tr class="w-full inline-block grid grid-cols-3">
                <th    scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>

                <th    scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th    scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 w-full inline-block ">
              <tr v-for="email in emails" :key="email.id"
               class="w-full inline-block grid grid-cols-3 text-gray-500 text-sm">
                     <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(email.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ email.email }}</td>

          

                <td class="px-6 py-4 whitespace-nowrap">
                  <button @click="selectModalEmail(email)" class="text-indigo-600 hover:text-indigo-900">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Email Detail and Reply Section
        <div class="email-detail border bg-white p-4 shadow-md rounded-lg hidden  xl:block">
          <h3 class="text-xl mb-2 font-normal text-gray-700">{{ selectedEmail.subject || 'No email selected' }}</h3>
          <small class="mb-2 text-gray-700 inline-block w-full">{{ selectedEmail.body || 'Please select an email to view its content.' }}</small>
          <small v-if="selectedEmail.from" class="text-gray-600 inline-block w-full">From: {{ selectedEmail.from }}</small>
          <small v-if="selectedEmail.date" class="text-gray-500 inline-block w-full">{{ formatDate(selectedEmail.date) }}</small>

          <h4 class="font-normal mt-4 mb-2 text-gray-700">Reply</h4>
          <textarea v-model="reply" rows="3"
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Type your reply here..."></textarea>

          <button @click="sendReply(selectedEmail.from, reply)"
            class="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition duration-200">
            Send Reply
          </button>
        </div> -->

        <div class="fixed w-full h-full top-0 left-0 flex justify-center items-center  " v-if="openModal">
          <span class="fixed top-0 left-0 bg-black w-full h-full opacity-[.3] flex  " @click="openModal = false"></span>
          <div class="email-detail border bg-white p-4 shadow-md rounded-lg fixed w-[calc(100%-5%)] lg:w-1/2">
            <h3 class="text-xl py-2 font-normal text-gray-700 border-b">{{ selectedEmail.subject || 'No email selected' }}</h3>
            <p class="mb-2 text-gray-700 py-2">{{ selectedEmail.body || 'Please select an email to view its content.' }}</p>
            <p v-if="selectedEmail.from" class="text-gray-600 text-sm">From: {{ selectedEmail.from }}</p>
            <p v-if="selectedEmail.date" class="text-gray-500 text-sm">{{ formatDate(selectedEmail.date) }}</p>

            <h4 class="font-normal mt-4 mb-2 text-gray-700 border-b"></h4>
            <textarea v-model="reply" rows="3"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Type your reply here..."></textarea>

            <button @click="sendReply(selectedEmail.from, reply)"
              class="text-white w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 text-sm text-gray-700 rounded-lg hover:bg-gray-200">
              Send
            </button>
          </div>
        </div>
      
      </section>

      <!-- Pagination Controls -->
      <div  class="flex justify-center items-center text-gray-500 space-x-4 my-4 w-full border-t pt-4" v-if="!openModal">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="hover:text-gray-800 cursor-pointer text-sm">
          Prev
        </button>
        <small>Page {{ currentPage }}</small>
        <button @click="currentPage++" :disabled="emails.length < itemsPerPage"
           class="hover:text-gray-800 cursor-pointer text-sm">
          Next
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from '../../../axios';
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import { useToast } from "vue-toastification";
const toast = useToast();


// Emails state
const openModal = ref(false);
const emails = ref([]);
const selectedEmail = ref({ from: '', subject: '', body: '', date: '' });
const reply = ref('');
const searchBy = ref('');
const searchByDate = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);


const selectModalEmail = (email) => {
  openModal.value = true;
  selectedEmail.value = {
    from: email.email,
    subject: email.subject || 'No subject', // Assuming email.subject exists
    body: email.message,
    date: email.created_at,
  };
}
// Method to format the date
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

// Method to send reply
const sendReply = async () => {
  try {
   const response= await axios.post("/api/reply", {
      email: selectedEmail.value.from,
      message: reply.value
    })
    if(response.status===200){
      toast.success(response.data.message);
      openModal.value = false;
    }
  } catch (error) {
    toast.error('Error sending email:', error);
  }

  reply.value = '';
};

// Method to fetch emails from the API
const fetchEmails = async () => {
  try {
    const response = await axios.get(`/api/contact?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}&searchByDate=${searchByDate.value}`);
    emails.value = response.data.result; // Set the fetched emails
  } catch (error) {
    console.error('Error fetching emails:', error);
  }
};

// Refresh data when the search criteria or current page changes
const refreshData = () => {
  currentPage.value = 1; // Reset to first page on search
  fetchEmails();
};

// Watch for changes in the search inputs and current page
watch([searchBy, searchByDate, currentPage], fetchEmails);

// Lifecycle hook to fetch emails when the component is mounted
onMounted(fetchEmails);
</script>

<style scoped>
/* Add any additional styles you need here */
</style>
