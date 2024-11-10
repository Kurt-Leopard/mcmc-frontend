<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from "../../../axios";
import HeaderComponent from '../../components/admin/HeaderComponent.vue';

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
        console.error("Error fetching user count:", error);
    }
};


const inbox = ref([]);
const inboxCount = ref([])
const totalInbox = ref([])
const refreshInbox = async () => {
    try {
        const response = await axios.get(`/api/contacts`);
        inbox.value = response.data.result;
        inboxCount.value = inbox.value.length;
        totalInbox.value = inboxCount.value.toLocaleString();
    } catch (error) {
        console.error("Error fetching user count:", error);
    }
};

const totalAmount = ref(0);
const formattedTotal = ref([])

const refreshOperational = async () => {
    try {
        const response = await axios.get(`/api/getOperational`);
        const amount = ref(response.data.results);
        totalAmount.value = 0;
        amount?.value?.forEach((item) => {
            totalAmount.value += item.amount;
        });

        formattedTotal.value = totalAmount.value.toLocaleString();
    } catch (error) {
        console.error("Error fetching operational data:", error);
    }
};

onMounted(() => {
    refreshInbox();
    refreshOperational();
    refreshData();
});
</script>

<template>
    <main>
        <HeaderComponent />
        <div class="grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-4 sm:px-8">
            <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                <div class="p-4 bg-green-400">
                    <svg  class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                        </path>
                    </svg>
                </div>
                <div class="px-4 text-gray-700">
                    <h3 class="text-sm tracking-wider">Total Users</h3>
                    <p class="text-3xl">{{ totalUsers }}</p>
                </div>
            </div>
            <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                <div class="p-4 bg-blue-400">
                    <svg class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                        <path fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="px-4 text-gray-700">
                    <h3 class="text-sm tracking-wider">Current Income</h3>
                    <p class="text-3xl">{{ formattedTotal }}</p>
                </div>
            </div>
            <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                <div class="p-4 bg-indigo-400">
                    <svg  class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z">
                        </path>
                    </svg>
                </div>
                <div class="px-4 text-gray-700">
                    <h3 class="text-sm tracking-wider">Total Messages</h3>
                    <p class="text-3xl">{{totalInbox}}</p>
                </div>
            </div>
            <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                <div class="p-4 bg-red-400">
                    <svg  class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
                        </path>
                    </svg>
                </div>
                <div class="px-4 text-gray-700">
                    <h3 class="text-sm tracking-wider">Server Load</h3>
                    <p class="text-3xl">34.12%</p>
                </div>
            </div>
        </div>
    </main>
</template>
