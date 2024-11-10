<script setup>
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import { ref, onMounted, watch, computed } from "vue";
import axios from "../../../axios";
import Close from "@/assets/icons/close.vue";

const verses = ref([]); // List of Bible verses for display
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchBy = ref("");
const hasMoreData = ref(true);
const isModalOpen = ref(false); // Modal visibility state
const selectedVerse = ref(null); // Currently selected verse for viewing details
const referenceVerse = ref([]);
const showConfirmationModal = ref(false); // Confirmation modal visibility state

// Fetch Bible verses data
const refreshData = async () => {
    try {
        const response = await axios.get(
            `/devotional?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}`
        );

        verses.value = response.data.devotional || [];
        if (verses.value.length > 0) {
            referenceVerse.value = JSON.parse(verses.value[0].verses || "[]");
        }
        hasMoreData.value = verses.value.length === itemsPerPage.value;
    } catch (error) {
        console.error("Error fetching verses data:", error);
    }
};

const confirmBlock = async (id) => {
    try {
        const res = await axios.put(`/block/devotional/${id}`);
        return res;
    } catch (error) {
        console.error("Error blocking verse:", error);
    }
};

const combinedData = computed(() =>
    referenceVerse.value.map((item, index) => ({
        ...item,
        ...(verses.value[index] || {}) // Use empty object if index is out of bounds
    }))
);

const formatDate = (date) => {
    if (!date) return ''; // Prevent errors if date is not available
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const formattedTime = new Date(date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });

    return `${formattedDate} at ${formattedTime}`;
};

const nextPage = () => {
    if (hasMoreData.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// Open and close modal for verse details
const openModal = (verse) => {
    selectedVerse.value = verse;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedVerse.value = null;
};

// Open the confirmation modal
const openConfirmModal = (id) => {
    selectedVerse.value = verses.value.find(verse => verse.id === id);
    showConfirmationModal.value = true;
};

// Close the confirmation modal
const closeConfirmModal = () => {
    showConfirmationModal.value = false;
};

onMounted(() => {
    refreshData();
});

// Watch for changes in currentPage or searchBy and refresh data
watch([currentPage, searchBy], refreshData);
</script>

<template>
    <main>
        <HeaderComponent />

        <div class="pb-3 px-4">
            <h1 class="text-2xl font-semibold mb-4">Devotional / Bible Verses</h1>

            <!-- Search Input -->
            <div class="mb-4">
                <input v-model="searchBy" type="text" placeholder="Search by reference"
                    class="border border-gray-300 p-2 rounded w-full" />
            </div>

            <!-- Bible Verses Table -->
            <table class="w-full divide-gray-200 max-h-[360px] overflow-y-auto element-with-horizontal-scroll">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reference
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verse
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody class="bg-white divide-gray-200">
                    <tr v-for="(item, index) in combinedData" :key="index"
                        class="hover:bg-gray-100 hover:cursor-pointer" @click="openModal(item)">
                        <td class="ellipsis">
                            {{ item.reference }}
                        </td>
                        <td class="ellipsis">
                            {{ item.text }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap flex gap-2 justify-center"
                            @click.stop="openConfirmModal(item.id)">
                            <span class="px-2 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                                :class="!item.status ? 'inline-flex' : 'hidden'">
                                Block
                            </span>
                            <span
                                class="px-2 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 flex items-center justify-center"
                                :class="item.status ? 'inline-flex' : 'hidden'">
                                Blocked
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="mt-4 flex justify-center items-center border-t pt-4">
                <button @click="prevPage" :disabled="currentPage.value === 1"
                    class="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded">
                    Prev
                </button>

                <span class="text-sm text-gray-500">Page {{ currentPage.value }}</span>

                <button @click="nextPage" :disabled="!hasMoreData.value"
                    class="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded">
                    Next
                </button>
            </div>

            <!-- Modal for viewing verse details -->
            <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span class="fixed bg-black opacity-50 top-0 left-0 w-full h-full" @click="closeModal"></span>
                <div class="bg-white p-6 rounded shadow-lg z-10">
                    <div class="w-full flex justify-between items-center gap-2">
                        <h2 class="text-xl">Verse Details</h2>
                        <Close @click="closeModal" class="cursor-pointer" />
                    </div>
                    <div class="py-4">
                        <div class="w-full flex justify-between items-center my-2">
                            <div class="font-semibold text-lg">{{ selectedVerse.reference }}</div>
                            <div class="text-sm">{{ formatDate(selectedVerse.posted_at) }}</div>
                        </div>
                        <div class="p-4">
                            <p class="font-semibold">Verse:</p>
                            <p class="text-sm">{{ selectedVerse.text }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Confirmation Modal -->
            <div v-if="showConfirmationModal" id="confirmationModal" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div class="bg-white p-4 rounded-lg">
                    <h1 class="p-2 font-semibold">Are you sure?</h1>
                    <div class="flex gap-2 justify-center">
                        <div class="button-green" @click="confirmBlock(selectedVerse.id)">YES</div>
                        <div class="button-red" @click="closeConfirmModal">NO</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.ellipsis {
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
