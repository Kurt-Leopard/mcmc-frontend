<template>
  <main class="flex">
    <!-- Sidebar -->
    <div v-if="isSidebarVisible" :class="[
      'w-[350px] h-screen bg-white border-r border-gray-200  pb-10 overflow-y-auto transform transition-transform duration-300 ',
      isSidebarVisible ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]">
      <div class="flex items-center py-3 px-4">
        <img src="../../assets/logo.png" alt="Company Logo" loading="lazy" class="block w-14 h-14" />
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
        <RouterLink to="/view/page/manage/home"
          class="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">
          <svg class="w-6 h-6"  fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Dashboard
        </RouterLink>

        <!-- Users Accordion -->
        <div class="space-y-1.5">
          <button
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 "
            @click="toggleUsersMenu">
            <div class="flex items-center gap-x-3.5">
              <svg class="w-6 h-6"  fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              Users
            </div>
            <svg v-if="isUsersMenuOpen" class="w-5 h-5"  fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg v-else class="w-5 h-5"  fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <div v-show="isUsersMenuOpen" class="pl-6">
            <RouterLink to="/view/page/manage/member"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">Member</RouterLink>
            <RouterLink to="/view/page/manage/leader"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">Leader</RouterLink>
          </div>
        </div>
        <!-- Casflow Accordion -->
        <div class="space-y-1.5">
          <button
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 "
            @click="toggleCashflowMenu">
            <div class="flex items-center gap-x-3.5">
              <svg class="w-6 h-6"  fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              Cashflow
            </div>
            <svg v-if="isCashflowMenuOpen" class="w-5 h-5"  fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg v-else class="w-5 h-5"  fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <div v-show="isCashflowMenuOpen" class="pl-6">
            <RouterLink to="/view/page/manage/inflow"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">Inflow</RouterLink>
            <RouterLink to="/view/page/manage/expense"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">Expenses</RouterLink>
          </div>
        </div>

        <!-- Account Accordion -->
        <div class="space-y-1.5">
          <button
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 "
            @click="toggleAccountMenu">
            <div class="flex items-center gap-x-3.5">
              <svg class="w-6 h-6"  fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="15" r="3" />
                <circle cx="9" cy="7" r="4" />
                <path d="M10 15H6a4 4 0 0 0-4 4v2" />
              </svg>
              Account
            </div>
            <svg v-if="isAccountMenuOpen" class="w-5 h-5"  fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg v-else class="w-5 h-5"  fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <div v-show="isAccountMenuOpen" class="pl-6">
            <a href="#" class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">Profile</a>
            <a href="#" class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">Settings</a>
          </div>
        </div>

        <RouterLink to="/view/page/manage/inbox"
          class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">
          <svg class="w-6 h-6"  fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Inbox
        </RouterLink>

        <RouterLink to="/view/page/manage/gallery"
          class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">
          <svg  fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          Gallery
        </RouterLink>

        <RouterLink to="/view/page/manage/devotional"
          class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200 ">
          <svg  fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>

          Devotional
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
