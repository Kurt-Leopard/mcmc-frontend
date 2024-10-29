<template>
  <main class="flex">
    <!-- Sidebar -->
    <div
      v-if="isSidebarVisible"
      :class="[
        'w-[350px] h-screen bg-white border-r border-gray-200  pb-10 overflow-y-auto transform transition-transform duration-300 dark:bg-neutral-800 dark:border-neutral-700',
        isSidebarVisible ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
      ]"
    >
      <div class="flex items-center py-3 px-4">
        <img
          src="../../assets/logo.png"
          alt="Company Logo"
          loading="lazy"
          class="block w-14 h-14"
        />
        <div class="pl-2">
          <h1 class="font-semibold text-sm text-slate-900 tracking-[7px]">
            MCM-CHURCH
          </h1>
          <h3 class="text-xs text-slate-800">Glorify-Nurture-Equip-Expand</h3>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="p-6 space-y-1.5">
        <!-- Dashboard Link -->
        <RouterLink
          to="/view/page/manage/home"
          class="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-700 dark:text-white"
        >
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Dashboard
        </RouterLink>

        <!-- Users Accordion -->
        <div class="space-y-1.5">
          <button
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            @click="toggleUsersMenu"
          >
            <div class="flex items-center gap-x-3.5">
              <svg
                class="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              Users
            </div>
            <svg
              v-if="isUsersMenuOpen"
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <div v-show="isUsersMenuOpen" class="pl-6">
            <RouterLink
              to="/view/page/manage/member"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >Member</RouterLink
            >
            <RouterLink
              to="/view/page/manage/leader"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >Leader</RouterLink
            >
          </div>
        </div>
        <!-- Casflow Accordion -->
        <div class="space-y-1.5">
          <button
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            @click="toggleCashflowMenu"
          >
            <div class="flex items-center gap-x-3.5">
              <svg
                class="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              Cashflow
            </div>
            <svg
              v-if="isCashflowMenuOpen"
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <div v-show="isCashflowMenuOpen" class="pl-6">
            <RouterLink
              to="/view/page/manage/inflow"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >Inflow</RouterLink
            >
            <RouterLink
              to="/view/page/manage/expense"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >Expenses</RouterLink
            >
          </div>
        </div>

        <!-- Account Accordion -->
        <div class="space-y-1.5">
          <button
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            @click="toggleAccountMenu"
          >
            <div class="flex items-center gap-x-3.5">
              <svg
                class="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="18" cy="15" r="3" />
                <circle cx="9" cy="7" r="4" />
                <path d="M10 15H6a4 4 0 0 0-4 4v2" />
              </svg>
              Account
            </div>
            <svg
              v-if="isAccountMenuOpen"
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <div v-show="isAccountMenuOpen" class="pl-6">
            <a
              href="#"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >Profile</a
            >
            <a
              href="#"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >Settings</a
            >
          </div>
        </div>

        <RouterLink
          to="/view/page/manage/inbox"
          class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-neutral-700 dark:text-white"
        >
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Inbox
        </RouterLink>
      </nav>
    </div>
    <!-- Main Content -->
    <RouterView class="w-full" />
  </main>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const isSidebarVisible = ref(true);
const isUsersMenuOpen = ref(false);
const isAccountMenuOpen = ref(false);
const isCashflowMenuOpen = ref(false);

// Toggle Users Menu
const toggleUsersMenu = () => {
  isUsersMenuOpen.value = !isUsersMenuOpen.value;
};

// Toggle Account Menu
const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value;
};

const toggleCashflowMenu = () => {
  isCashflowMenuOpen.value = !isCashflowMenuOpen.value;
};

// Update sidebar visibility based on screen size
const updateSidebarVisibility = () => {
  isSidebarVisible.value = window.innerWidth >= 1024; // Show sidebar for lg screens and up
};

// Event listener for screen resizing
onMounted(() => {
  window.addEventListener("resize", updateSidebarVisibility);
  updateSidebarVisibility(); // Initial check
});

// Clean up the event listener on unmount
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateSidebarVisibility);
});
</script>
