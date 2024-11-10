<script setup>
import { ref, onMounted, provide, watch, inject } from "vue";
import { useAuthStore } from "@/stores/store";
import { accessControl, fetchUser } from "../../composables/user";
import ChatComponent from "../../components/leader/ChatComponent.vue";
import axios from "../../../axios";
import EntryComponent from "../../components/leader/modal/EntryComponent.vue";
import ExpenseComponent from "../../components/leader/modal/ExpenseComponent.vue";
import BudgetComponent from "../../components/leader/modal/BudgetComponent.vue";
import { useRoute, useRouter } from "vue-router";
import { relativeTime } from "../../composables/relativeTime";

const store = useAuthStore();
const router = useRouter();
const user= ref("");
if(store){
  user.value=decodeJWT(store.token);
}

import { computed } from 'vue';
import { decodeJWT } from "../../stores/token";
const route = useRoute();

const lastSegment = computed(() => {
  const pathSegments = route.path.split('/');
  return pathSegments.pop() || ''; 
});

const showScrollButton = ref(false);
const activeTab = ref("");
const cashFlowOpen = ref(false);
const isDropdownVisible = ref(false);
const id = ref("");
const fullname = ref("");
const statusMode = ref("");
let unreadCount = ref(0);
const typeOfExpense = ref("");
const access_control = ref();
const openChat = (chatId, chatName, status) => {
  id.value = chatId;
  fullname.value = chatName;
  statusMode.value = status;
};

provide("id", id);
provide("fullname", fullname);
provide("statusMode", statusMode);

const dropDown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};
const Closeswitching = () => {
  localStorage.removeItem("access");
  location.reload();
};
const openCasflow = () => {
  cashFlowOpen.value = !cashFlowOpen.value;
};

const onScroll = () => {
  showScrollButton.value = window.scrollY > 10;
};

// Function to handle tab click
const setActiveTab = (tab) => {
  activeTab.value = tab;
  cashFlowOpen.value = false;
};

// users chatlist
const leaders = ref([]);
const refreshData = async () => {
  const response = await axios.get(`/api/leaders-account`);

  try {
    if (response.status === 200) {
      leaders.value = response.data.result;
    }
  } catch (error) {
    console.log(response.data.message);
  }
};
const logout = async () => {
  try {
    const response = await axios.put(`/api/logout/${store.user.id}`);
    if (response.status === 200) {
       sessionStorage.removeItem("accessRole");
      location.reload();
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.data);
    }
  }
};

const notify = ref([]);
const notifyData = async () => {
  const response = await axios.get(`/api/notification/${store.user.id}`);

  try {
    if (response.status === 200) {
      notify.value = response.data.data;

      unreadCount.value = notify.value.filter((n) => n.is_read === 0).length;
    }
  } catch (error) {
    console.log(response.data.message);
  }
};

const goTo = async (type, notification_id) => {
  if (type === "events") {
    localStorage.removeItem("access");
    window.location.href = "http://localhost:5174/view/events";

    // router.push({ path: "/view/events" });
    try {
      const response = await axios.put(
        `/api/notification-update/${notification_id}`
      );

      if (response.status === 200) {
        console.log("success");
        notifyData();
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log("Error:", error.message);
      }
    }
  }
};
const showCashEntry = ref(false);
const buttonCashEntry = () => {
  showCashEntry.value = true;
};

const closeCashEntry = () => {
  showCashEntry.value = false;
};

const expenseEntry = ref(false);
const buttonExpenseEntry = (type) => {
  typeOfExpense.value = type;
  expenseEntry.value = true;
};
provide("typeOfExpense", typeOfExpense);

const closeExpenseEntry = () => {
  expenseEntry.value = false;
};

const budgetEntry = ref(false);
const buttonBudgetEntry = () => {
  budgetEntry.value = true;
};

const closeBudgetEntry = () => {
  budgetEntry.value = false;
};
const refresh = inject("refresh");
watch(refresh, async (newValue) => {
  if (newValue) {
    notifyData();
    refresh.value = false; 
  }
});

onMounted(async () => {
  await fetchUser();
   await accessControl();
  access_control.value = store.getAccessControl().access_control;
  window.addEventListener("scroll", onScroll);
  notifyData();
  refreshData();
});
</script>

<template>
  <main>
    <section
      class="fixed top-0 left-0 z-30 bg-white pt-3 px-4 lg:px-[50px] xl:px-32 w-full"
    >
      <header
        :class="
          showScrollButton
            ? 'border-b shadow-b-sm lg:border-0 lg:border-b-0 lg:shadow-none'
            : ''
        "
        class="flex items-center justify-center md:grid lg:grid xl:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 pb-3"
      >
        <section class="flex items-center w-full">
          <img
            src="../../assets/cashflow.png"
            alt="Company Logo"
            loading="lazy"
            class="block w-14 h-14"
          />
          <div class="px-6">
            <h1
              class="text-sm text-gray-600 hover:text-gray-800   font-bold tracking-[7px]"
            >
              MCM-CHURCH
            </h1>
            <h3
              class="text-xs text-gray-600 hover:text-gray-800  "
            >
              Steward-Trust-Manage-Sustain
            </h3>
          </div>
        </section>
        <!-- Search bar and other icons -->
        <div class="flex items-center w-full  md:flex lg:flex xl:flex">
        
        </div>
        <div
          class="flex items-center justify-end lg:w-full xl:w-full lg:gap-x-3 xl:gap-x-3 text-gray-600 hover:text-gray-800  "
        >
          <a
            v-show="store.getToken()"
            class="relative text-gray-600 hover:text-gray-800    group flex hidden md:flex lg:flex xl:flex"
          >
            <svg
              
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6.429 2.413a.75.75 0 0 0-1.13-.986l-1.292 1.48a4.75 4.75 0 0 0-1.17 3.024L2.78 8.65a.75.75 0 1 0 1.5.031l.056-2.718a3.25 3.25 0 0 1 .801-2.069z"
              />
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M6.237 7.7a4.214 4.214 0 0 1 4.206-3.95H11V3a1 1 0 1 1 2 0v.75h.557a4.214 4.214 0 0 1 4.206 3.95l.221 3.534a7.376 7.376 0 0 0 1.308 3.754a1.617 1.617 0 0 1-1.135 2.529l-3.407.408V19a2.75 2.75 0 1 1-5.5 0v-1.075l-3.407-.409a1.617 1.617 0 0 1-1.135-2.528a7.377 7.377 0 0 0 1.308-3.754zm4.206-2.45a2.714 2.714 0 0 0-2.709 2.544l-.22 3.534a8.877 8.877 0 0 1-1.574 4.516a.117.117 0 0 0 .082.183l3.737.449c1.489.178 2.993.178 4.482 0l3.737-.449a.117.117 0 0 0 .082-.183a8.876 8.876 0 0 1-1.573-4.516l-.221-3.534a2.714 2.714 0 0 0-2.709-2.544zm1.557 15c-.69 0-1.25-.56-1.25-1.25v-.75h2.5V19c0 .69-.56 1.25-1.25 1.25"
                clip-rule="evenodd"
              />
              <path
                fill="currentColor"
                d="M17.643 1.355a.75.75 0 0 0-.072 1.058l1.292 1.48a3.25 3.25 0 0 1 .8 2.07l.057 2.717a.75.75 0 0 0 1.5-.031l-.057-2.718a4.75 4.75 0 0 0-1.17-3.024l-1.292-1.48a.75.75 0 0 0-1.058-.072"
              />
            </svg>

            <!--  -->
            <section
              class="absolute right-0 top-6 border max-h-[500px] overflow-y-auto w-[350px] bg-white text-left p-3 rounded-md shadow-md hidden group-hover:block"
            >
              <h1 class="text-gray-700 border-b pb-2 text-center font-semibold">
                Notifications
              </h1>
              <section
                @click="goTo(notification.type, notification.notification_id)"
                class="inline-block p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-center w-full gap-4"
                v-for="(notification, index) in notify"
                :key="index"
              >
                <img
                  :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${notification.profile}`"
                  loading="lazy"
                  role="presentation"
                  alt=""
                  class="h-[30px] w-[30px] rounded-full hidden md:block lg:block xl:block"
                />
                <div class="w-full">
                  <div class="italic text-gray-500 text-xs">
                    {{ notification.user_2_username }} replied to your comment.
                  </div>
                  <div class="flex items-center justify-between">
                    <small class="italic"
                      >{{ notification.heading }} Events</small
                    ><small class="italic text-xs text-gray-500">{{
                      relativeTime(notification.created_at)
                    }}</small>
                    <small
                      v-if="notification.is_read === 0"
                      class="p-1 bg-green-500 rounded-full"
                    ></small>
                  </div>
                </div>
              </section>
            </section>
            <div
              v-if="unreadCount !== 0"
              :class="
                unreadCount === 0
                  ? ''
                  : 'rounded-full bg-red-500 w-4 h-4 flex items-center justify-center text-[10px] text-white'
              "
            >
              {{ unreadCount }}
            </div>
          </a>
          <a
            v-show="store.getToken()"
            class="relative text-gray-600 hover:text-gray-800   group"
          >
            <svg
              class="hidden md:block lg:block xl:block"
              
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98m-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2"
              />
            </svg>
            <section
              class="absolute right-0 top-6 border w-[220px] bg-white text-left p-3 rounded-md shadow-md hidden group-hover:block"
            >
              <h1 class="text-gray-700 border-b pb-2 text-center font-semibold">
                Settings
              </h1>
                <RouterLink class="inline-block p-2 hover:bg-gray-50 cursor-pointer w-full"  to="/view/page/profile">
              Profile
            </RouterLink>
              <section
                class="p-2 hover:bg-gray-50 cursor-pointer"
                @click="logout"
              >
                Logout
              </section>
            </section>
          </a>
          <svg
            @click.prevent="Closeswitching"
            
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 hidden md:block lg:block xl:block text-gray-600 hover:text-gray-800  "
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <a
            v-show="store.getToken()"
          
            class="mx-2"
          >
            <img
              :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${store.user.profile}`"
              loading="lazy"
              role="presentation"
              alt=""
              class="h-[45px] w-[45px] rounded-full hidden md:block lg:block xl:block"
            />
          </a>
          <a class="flex lg:hidden xl:hidden items-center justify-center">
            <svg
          
              
              class="h-8 w-8 mb-1 md:mb-0 lg:mb-0 xl:mb-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
      
          </a>
        </div>
      </header>
      <header
        class="border-b mt-2 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6xl:grid-cols-6 text-sm text-gray-600"
      >
        <RouterLink
          to="/view/page/home"
          class="text-xs text-center font-semibold py-2 flex items-center justify-center"
          active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          exact-active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          @click.prevent="setActiveTab('home')"
        >
          <svg
            
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="lastSegment === 'home' ? 'white' : 'black'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2"
          >
            <path d="M3 9l9-6 9 6v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <path d="M9 22V12h6v10" />
          </svg>
          HOME 
        </RouterLink>

        <!-- Cash Flow Dropdown -->
        <div
          class="relative flex items-center justify-center md:hidden lg:hidden xl:hidden"
        >
          <button
          :class="lastSegment!=='home'? 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-3 py-3 text-center me-2 mb-2':''"
            @click="openCasflow"
            class="text-xs text-center font-semibold py-2 flex items-center justify-center lg:hidden"
          >
            Cash Flow 
            <svg
              
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
          <div
            v-if="cashFlowOpen"
            class="absolute left-0 top-8 bg-white shadow-lg rounded-lg mt-2"
          >
            <RouterLink
              to="/view/page/inflow"
              class="block px-4 py-2 text-sm hover:bg-gray-100"
              @click.prevent="setActiveTab('inflow')"
              >INFLOW</RouterLink
            >
            <RouterLink
              to="/view/page/expense"
              class="block px-4 py-2 text-sm hover:bg-gray-100"
              @click.prevent="setActiveTab('expense')"
              >EXPENSE</RouterLink
            >
            <RouterLink
              to="/view/page/savings"
              class="block px-4 py-2 text-sm hover:bg-gray-100"
              @click.prevent="setActiveTab('savings')"
              >SAVINGS</RouterLink
            >
            <RouterLink
              to="/view/page/summary"
              class="block px-4 py-2 text-sm hover:bg-gray-100"
              @click.prevent="setActiveTab('summary')"
              >SUMMARY</RouterLink
            >
          </div>
        </div>

        <!-- Other links for larger screens -->
        <RouterLink
          to="/view/page/inflow"
          class="text-xs text-center font-semibold py-3 flex items-center justify-center hidden md:block lg:block xl:block"
          active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          exact-active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          @click.prevent="setActiveTab('inflow')"
        >
          <i class="fas fa-hand-holding-usd mr-2"></i>
        INFLOW
        </RouterLink>
        <RouterLink
          to="/view/page/expense"
          class="text-xs text-center font-semibold py-2 flex items-center justify-center hidden md:flex lg:flex xl:flex"
          active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          exact-active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          @click.prevent="setActiveTab('expense')"
        >
         <i class="fas fa-coins mr-2"></i>
         
          EXPENSE
        </RouterLink>
        <RouterLink
          to="/view/page/savings"
          class="text-xs text-center font-semibold py-2 flex items-center justify-center hidden md:flex lg:flex xl:flex"
          active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          exact-active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          @click.prevent="setActiveTab('savings')"
        >
          <i class="fas fa-university mr-2"></i>

          SAVINGS
        </RouterLink>
        <RouterLink
          to="/view/page/summary"
          class="text-xs text-center font-semibold py-3 flex items-center justify-center hidden md:block lg:block xl:block"
          active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          exact-active-class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          @click.prevent="setActiveTab('summary')"
        >
          <i class="fas fa-receipt mr-2"></i>SUMMARY
        </RouterLink>
        <a class="text-end flex justify-end gap-x-2">
          <nav class="relative group">
            <i
              class="fas fa-message p-3 bg-gray-50 rounded-md hover:bg-gray-100 mb-2"
            >
            </i>
            <div
              class="absolute right-0 top-9 border w-[220px] bg-white text-left p-3 rounded-md shadow-md hidden group-hover:block"
            >
              <section
                v-for="(leader, index) in leaders"
                :key="index"
                v-show="leader.id !== store.user.id"
                class="p-2 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center"
                @click="openChat(leader.id, leader.fullname, leader.status)"
              >
                <img
                  :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${leader.profile}`"
                  class="w-8 h-8 rounded-full mr-2"
                  alt=""
                />
                {{ leader.fullname }} 
                <p
                  class="ml-2 p-1 rounded-full"
                  :class="leader.status === 'online' ? 'bg-green-500' : ''"
                ></p>
              </section>
            </div>
          </nav>
          <nav class="relative group" v-if="access_control==='Bookkeeper'">
            <i
              class="fas fa-plus p-3 bg-gray-50 rounded-md hover:bg-gray-100 mb-2 group-hover:block cursor-pointer"
            ></i>
            <div
              class="absolute right-0 top-12 border w-[180px] bg-white text-left p-3 rounded-md shadow-md hidden group-hover:block"
            >
           
              <section
                class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                @click="buttonCashEntry"
              >
                Cash Entry
              </section>
              <section
                @click="dropDown"
                class="relative p-3 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between"
              >
                Expense Entry
                <svg
                  v-if="isDropdownVisible"
                  class="w-5 h-5"
                  
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 ml-2"
                  
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M10 6l6 6-6 6" />
                </svg>
              </section>
              <!-- drop down expense -->
              <div v-if="isDropdownVisible">
                <li
                  class="p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                  @click="buttonExpenseEntry('Bill')"
                >
                  Bill
                </li>
                <li
                  class="p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                  @click="buttonExpenseEntry('Ministry')"
                >
                  Ministry
                </li>
                <li
                  class="p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                  @click="buttonExpenseEntry('Honorarium')"
                >
                  Honorarium
                </li>
                <li
                  class="p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                  @click="buttonExpenseEntry('Others')"
                >
                  Others
                </li>
              </div>
              <section class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer" @click="buttonBudgetEntry">
                Budget Allocation
              </section>
              
            </div>
          </nav>
        </a>
        <ChatComponent />
      </header>
    </section>
    <EntryComponent v-if="showCashEntry" @closeCashEntry="closeCashEntry"/>
    <ExpenseComponent
      v-if="expenseEntry"
      @closeExpenseEntry="closeExpenseEntry"
    />
    <BudgetComponent v-if="budgetEntry"  @closeBudgetEntry="closeBudgetEntry"/>

    <RouterView />
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
