<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "../../../axios";
import HeaderComponent from "../../components/admin/HeaderComponent.vue";

const users = ref([]);
const usersCount = ref(0);
const totalUsers = ref(0);
const refreshData = async () => {
  try {
    const response = await axios.get(`/users/count`);
    users.value = response.data.result;
    usersCount.value = users.value.length;
    totalUsers.value = usersCount.value.toLocaleString();
  } catch (error) {
    console.log("Error fetching user count:", error);
  }
};

const inbox = ref([]);
const inboxCount = ref([]);
const totalInbox = ref([]);
const refreshInbox = async () => {
  try {
    const response = await axios.get(`/api/contacts`);
    inbox.value = response.data.result;
    inboxCount.value = inbox.value.length;
    totalInbox.value = inboxCount.value.toLocaleString();
  } catch (error) {
    console.log("Error fetching user count:", error);
  }
};

const income = ref(null);
const totalRestrictedFunds = ref(null);
const totalTithesOfTithes = ref(null);


const refreshSavings = async () => {
  try {
   
    const incomeResponse = await axios.get(
      `/api/saving-income`
    );
    income.value = incomeResponse.data.result[0]?.amount || 0;

    const savingsResponse = await axios.get(
      `/api/savings`
    );
    totalRestrictedFunds.value =
      savingsResponse.data.result[0]?.total_restricted_funds || 0;
    totalTithesOfTithes.value =
      savingsResponse.data.result[0]?.total_tithes_of_tithes || 0;
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};

onMounted(() => {
  refreshInbox();
  refreshSavings();
  refreshData();
});
</script>

<template>
  <main>
    <HeaderComponent />
    <div class="grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-3 sm:px-8">
      <div
        class="flex items-center bg-white border rounded-sm overflow-hidden shadow"
      >
        <div class="p-4 bg-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
        </div>
        <div class="px-4 text-gray-700">
          <h3 class="text-sm tracking-wider">Total Users</h3>
          <p class="text-3xl">{{ totalUsers }}</p>
        </div>
      </div>
     
      <div
        class="flex items-center bg-white border rounded-sm overflow-hidden shadow"
      >
        <div class="p-4 bg-orange-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            ></path>
          </svg>
        </div>
        <div class="px-4 text-gray-700">
          <h3 class="text-sm tracking-wider">Total Inbox</h3>
          <p class="text-3xl">{{ inboxCount }}</p>
        </div>
      </div>
     <div
        class="flex items-center bg-white border rounded-sm overflow-hidden shadow"
      >
        <div class="p-4 bg-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-12 h-12 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        </div>
        <div class="px-4 text-gray-700">
          <h3 class="text-sm tracking-wider">Operational Income</h3>
          <p class="text-3xl">
            {{
              (income ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </p>
        </div>
      </div>
       <div
        class="flex items-center bg-white border rounded-sm overflow-hidden shadow"
      >
        <div class="p-4 bg-indigo-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-12 h-12 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        </div>
        <div class="px-4 text-gray-700">
          <h3 class="text-sm tracking-wider">Restricted Funds</h3>
          <p class="text-3xl">
            {{
              (totalRestrictedFunds ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </p>
        </div>
      </div>
 <div
        class="flex items-center bg-white border rounded-sm overflow-hidden shadow"
      >
        <div class="p-4 bg-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-12 h-12 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        </div>
        <div class="px-4 text-gray-700">
          <h3 class="text-sm tracking-wider">Thites of thites</h3>
          <p class="text-3xl">
            {{
              (    totalTithesOfTithes  ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </p>
        </div>
      </div>

    </div>
    
  </main>
</template>