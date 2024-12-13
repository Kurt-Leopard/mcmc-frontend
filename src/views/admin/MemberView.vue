<script setup>
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import { ref, onMounted, watch } from "vue";
import axios from "../../../axios";

const users = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchBy = ref("");
const hasMoreData = ref(true);
const roles = ref([]); // List of roles from the API
const isModalOpen = ref(false); // Modal visibility state
const selectedUser = ref(null); // Currently selected user for role editing
import { useToast } from "vue-toastification";
const toast = useToast();

// Fetch user data with role information
const refreshData = async () => {
  try {
    const response = await axios.get(
      `/users/members?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}`
    );

    // Map users and ensure they have a role
    users.value = response.data.data.map((user) => ({
      ...user,
      role: user.role || "", // Default to an empty string if the role is not defined
    }));

    // Check if there's more data for pagination
    hasMoreData.value = response.data.data.length === itemsPerPage.value;
  } catch (error) {
    console.log("Error fetching user data:", error);
  }
};

// Fetch available roles for the dropdown
const refreshRole = async () => {
  try {
    const response = await axios.get("/users/roles");
    if (response.status === 200) {
      roles.value = response.data.result; // Assume result is the list of roles
    }
  } catch (error) {
    console.log("Error fetching roles:", error);
  }
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

// Open the modal for editing user role
const openModal = (user) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedUser.value = null;
};

// Save the updated role
const saveRole = async () => {
  try {
    const roleToUpdate = roles.value.find(
      (role) => role.role === selectedUser.value.role
    );
    if (roleToUpdate) {
      await axios.put(`/users/role/${selectedUser.value.id}`, {
        role: roleToUpdate.id, // Send the role ID instead of the role name
      });
    }
    closeModal();
    refreshData(); // Refresh the user list after updating
  } catch (error) {
    console.log("Error saving role:", error);
  }
};

const activation = async (id, status,email) => {
  const temp = ref(status == "active" ? "inactive" : "active");
  console.log(email);
  try {
    const response = await axios.put("/user/activation", {
      id: id,
      status: temp.value,
      email: email
    });

    if (response.status === 200) {
      toast.success(response.data.message || "Action successful!");
      refreshData();
    } else {
      toast.error(response.data.error || "An error occurred");
    }
  } catch (error) {
    toast.error(error.message || "An unexpected error occurred");
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  refreshData();
  refreshRole();

});

// Watch for changes in currentPage or searchBy and refresh data
watch([currentPage, searchBy], refreshData);
</script>

<template>
  <main>
    <HeaderComponent />
    <div class="pb-3 px-4">
      <h1 class="text-2xl font-semibold mb-4">Members List</h1>

      <!-- Search Input -->
      <div class="mb-4">
        <input
          v-model="searchBy"
          type="text"
          placeholder="Search by name or username"
          class="border border-gray-300 p-2 rounded w-full"
        />
      </div>
      <table
        class="w-full divide-y divide-gray-200 inline-block max-h-[360px] overflow-y-auto element-with-horizontal-scroll"
      >
        <thead class="bg-gray-50 w-full inline-block">
          <tr class="w-full inline-block grid grid-cols-3">
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>

            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 w-full inline-block">
          <tr
            v-for="(user, index) in users"
            :key="index"
            class="w-full inline-block grid grid-cols-3"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    class="h-10 w-10 rounded-full"
                    :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${user.profile}`"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 flex">
                    <div
                      class="w-fit px-2 rounded-full flex sm:hidden"
                      :class="
                        users[index].status == 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{ user.fullname }}
                    </div>
                    <div
                      class="flex sm:hidden"
                      @click="activation(user.id, users[index].status)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-4 mx-2 cursor-pointer z-10"
                        :class="
                          users[index].status == 'active'
                            ? ' text-red-800'
                            : ' text-green-800'
                        "
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ user.username }}
                  </div>
                </div>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span class="flex items-center h-full">
                <span
                  class="px-2 hidden sm:inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                  :class="
                    users[index].status == 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ users[index].status }}
                </span>
                <div class="group hidden sm:flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4 mx-2 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  <span class="relative hidden group-hover:block">
                    <div
                      class="absolute border rounded-md bg-white p-3 text-gray-600"
                    >

                     <div v-if="users[index].status == 'pending'"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md capitalize cursor-pointer w-full"
                        :class="
                          users[index].status == 'active'
                            ? 'hover:bg-gray-50  p-2'
                            : 'hover:bg-gray-50 p-2'
                        "
                        @click="activation(user.id, users[index].status,users[index].username)"
                      >
                        {{
                          users[index].status == "pending"
                            ? "Approve"
                            : ""
                        }}
                      </div>
                      <div v-if="users[index].status != 'pending'"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md capitalize cursor-pointer w-full"
                        :class="
                          users[index].status == 'active'
                            ? 'hover:bg-gray-50  p-2'
                            : 'hover:bg-gray-50 p-2'
                        "
                        @click="activation(user.id, users[index].status,users[index].username)"
                      >
                        {{
                          users[index].status == "active"
                            ? "Deactivate"
                            : "Activate"
                        }}
                      </div>
                      <div v-if="users[index].status != 'pending'"
                        class="px-2 text-xs leading-5 font-semibold rounded-md capitalize opacity-[.7]"
                      >
                        {{
                          users[index].status != "active"
                            ? "Deactivate"
                            : "Activate"
                        }}
                      </div>
                    </div>
                  </span>
                </div>
              </span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <select
                v-model="user.role"
                @change="openModal(user)"
                class="border border-gray-300 p-2 rounded"
              >
                <option
                  v-for="role in roles"
                  :key="role.id"
                  :value="role.role"
                  v-show="role.role !== 'admin'"
                >
                  {{ role.role }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="mt-4 flex justify-center items-center border-t pt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded"
        >
          Prev
        </button>

        <span class="text-sm text-gray-500">Page {{ currentPage }}</span>

        <button
          @click="nextPage"
          :disabled="!hasMoreData"
          class="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      <!-- Modal for editing role -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded shadow-lg">
          <h2 class="text-xl mb-4">Edit Role</h2>
          <div>
            <label class="block mb-2"
              >Are you sure you want to change the role of
              {{ selectedUser?.fullname }}?</label
            >
          </div>
          <div class="mt-4 flex justify-end">
            <button
              @click="closeModal"
              class="bg-gray-300 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              @click="saveRole"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
