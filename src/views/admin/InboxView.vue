<template>
  <main>
    <HeaderComponent />
    <div class="p-6">
      <h2 class="text-3xl mb-6 text-gray-800">Received Emails Inbox</h2>
      <div class="mb-4 grid grid-cols-2 gap-2">
        <input
          v-model="searchBy"
          @input="refreshData"
          type="text"
          placeholder="Search by particular or amount"
          class="border border-gray-300 p-2 rounded w-full"
        />
        <input
          v-model="searchByDate"
          @change="refreshData"
          type="month"
          placeholder="Search by month and year"
          class="border border-gray-300 p-2 rounded w-1/3"
        />
      </div>

      <!-- Responsive grid for emails list and detail view -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Email List -->
        <div class="overflow-auto max-h-[400px]">
          <table class="min-w-full bg-white shadow-md rounded-lg">
            <thead class="bg-gray-200 text-gray-700 font-normal text-sm">
              <tr>
                <th class="p-2 text-left border-b border-gray-300">From</th>
               
                <th class="p-2 text-left border-b border-gray-300">Date Received</th>
                <th class="p-2 text-left border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="email in emails"
                :key="email.id"
                class="hover:bg-gray-100 transition duration-200 cursor-pointer text-sm"
              >
                <td class="p-2 border-b border-gray-300">{{ email.email }}</td>
            
                <td class="p-2 border-b border-gray-300">{{ formatDate(email.created_at) }}</td>
                <td class="p-2 border-b border-gray-300">
                  <button
                    @click="selectEmail(email)"
                    class="text-gray-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Email Detail and Reply Section -->
        <div class="email-detail border bg-white p-4 shadow-md rounded-lg">
          <h3 class="text-xl mb-2 font-normal text-gray-700">{{ selectedEmail.subject || 'No email selected' }}</h3>
          <p class="mb-2 text-gray-700">{{ selectedEmail.body || 'Please select an email to view its content.' }}</p>
          <p v-if="selectedEmail.from" class="text-gray-600">From: {{ selectedEmail.from }}</p>
          <p v-if="selectedEmail.date" class="text-gray-500">{{ formatDate(selectedEmail.date) }}</p>
          
          <h4 class="font-normal mt-4 mb-2 text-gray-700">Reply</h4>
          <textarea
            v-model="reply"
            rows="3"
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Type your reply here..."
          ></textarea>
          
          <button
            @click="sendReply"
            class="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition duration-200"
          >
            Send Reply
          </button>
        </div>
      </section>

      <!-- Pagination Controls -->
      <div class="mt-4 flex justify-between">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {{ currentPage }}</span>
        <button
          @click="currentPage++"
          :disabled="emails.length < itemsPerPage"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
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

// Emails state
const emails = ref([]);
const selectedEmail = ref({ from: '', subject: '', body: '', date: '' });
const reply = ref('');
const searchBy = ref('');
const searchByDate = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Method to select an email
const selectEmail = (email) => {
  console.log('Selected Email:', email); // Log the selected email
  selectedEmail.value = {
    from: email.email,
    subject: email.subject || 'No subject', // Assuming email.subject exists
    body: email.message,
    date: email.created_at,
  };
};

// Method to format the date
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

// Method to send reply
const sendReply = () => {
  console.log(`Replying to ${selectedEmail.value.from} with: ${reply.value}`);
  reply.value = ''; // Clear the reply field after sending
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
