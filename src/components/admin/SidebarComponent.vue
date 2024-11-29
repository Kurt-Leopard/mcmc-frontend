<template>
  <main class="flex">
    <div
      :class="
        !store.showmenuAdmin
          ? 'hidden lg:block xl:block w-[350px] h-screen bg-white border-r border-gray-200  pb-10 overflow-y-auto transform transition-transform duration-300'
          : 'fixed top-0 left-0 w-[350px] h-screen bg-white border-r border-gray-200  pb-10 overflow-y-auto transform transition-transform duration-300 '
      "
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
          class="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-gray-200 hover:bg-gray-200 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <svg
            class="w-6 h-6"
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
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
            @click="toggleUsersMenu"
          >
            <div class="flex items-center gap-x-3.5">
              <svg
                class="w-6 h-6"
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
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
              >Member</RouterLink
            >
            <RouterLink
              to="/view/page/manage/leader"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
              >Leader</RouterLink
            >
          </div>
        </div>
        <!-- Casflow Accordion -->
        <div class="space-y-1.5">
          <button
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
            @click="toggleCashflowMenu"
          >
            <div class="flex items-center gap-x-3.5">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M3 7h18M3 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M5 12h14"
                />
              </svg>

              Cashflow
            </div>
            <svg
              v-if="isCashflowMenuOpen"
              class="w-5 h-5"
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
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
              >Inflow</RouterLink
            >
            <RouterLink
              to="/view/page/manage/expense"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
              >Expenses</RouterLink
            >
          </div>
        </div>

        <RouterLink
          to="/view/page/manage/inbox"
          class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M3 7h18M3 7l9 9 9-9M3 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"
            />
          </svg>

          Inbox
        </RouterLink>

        <RouterLink
          to="/view/page/manage/gallery"
          class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          Gallery
        </RouterLink>

        <RouterLink
          to="/view/page/manage/devotional"
          class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>

          Devotional
        </RouterLink>

        <RouterLink
          to="/view/page/manage/meeting"
          class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
            />
          </svg>

          Meeting Schedule
        </RouterLink>

        <!-- Account Accordion -->
        <div class="space-y-1.5 border-t">
          <button
            class="flex items-center justify-between w-full py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
            @click="toggleAccountMenu"
          >
            <div class="flex items-center gap-x-3.5">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              Settings
            </div>
            <svg
              v-if="isAccountMenuOpen"
              class="w-5 h-5"
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
            <!-- <a
              href="#"
              class="block py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
              >Profile</a
            > -->

            <RouterLink
              to="/view/page/manage/Profile"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <svg
                class="w-6 h-6"
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

              Profile
            </RouterLink>
            <a
              href="#"
              class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
              @click="logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>

              Logout</a
            >
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <RouterView class="w-full" />
  </main>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useAuthStore } from "../../stores/store";
const store = useAuthStore();
const isSidebarVisible = ref(true);
const isUsersMenuOpen = ref(false);
const isAccountMenuOpen = ref(false);
const isCashflowMenuOpen = ref(false);

const logout = async () => {
  try {
    // const response = await axios.put(`/api/logout/${store.user.id}`);
    // if (response.status === 200) {
    // Clear sessionStorage
    sessionStorage.removeItem("accessRole");

    // Clear localStorage
    localStorage.removeItem("access");

    // Clear cookies
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    location.reload();
    // }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.data);
    }
  }
};

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
  isSidebarVisible.value = window.innerWidth >= 1024;
  store.setShowmenuAdmin(false); // Show sidebar for lg screens and up
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

watch(
  () => store.showmenuAdmin,
  (newVal, oldVal) => {
    if (!newVal) {
      console.log("Menu is closed");
    } else {
      console.log("Menu is open");
    }
  }
);

onMounted(() => {
  store.getShowmenuAdmin();
});
</script>