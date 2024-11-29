<script setup>
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import { ref, onMounted, watch } from "vue";
import axios from "../../../axios";
import { useToast } from "vue-toastification";
const toast = useToast();
const users = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchBy = ref("");
const hasMoreData = ref(true);
const roles = ref([]); // List of roles from the API
const isModalOpen = ref(false); // Modal visibility state
const selectedUser = ref(null); // Currently selected user for role editing
const access_control = ref([]);
const accessRefreshData = async () => {
  try {
    const response = await axios.get("/api/user/get-access-conrol");
    if (response.status === 200) {
      access_control.value = response.data.result;
    }
  } catch (error) {
    console.log(error.response);
  }
};
// Fetch user data with role information
const refreshData = async () => {
  try {
    const response = await axios.get(
      `/users/leaders?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}`
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

// Fetch data when the component is mounted
onMounted(() => {
  refreshData();
  refreshRole();
  accessRefreshData();
});

const showModal = ref(false);
const selectedAccessControlId = ref(null);
const selectedUserId = ref(null);
const selecetedRole = ref(null);
const onChangeAccessControl = (user, event, role_id) => {
  selecetedRole.value = role_id;
  selectedAccessControlId.value = event.target.value;
  selectedUserId.value = user.id;
  showModal.value = true;
  alert(user.id)
};

const confirmChange = async () => {
  try {
    const response = await axios.put(
      `/api/users/role-set/${selectedAccessControlId.value}`,
      { user_id: selectedUserId.value, role_id: selecetedRole.value }
    );

    if (response.status === 200) {
      toast.success(response.data.result);
      showModal.value = false;
    }
  } catch (error) {
    toast.error("Error saving role:", error);
    showModal.value = false;
  }
};

const cancelChange = () => {
  showModal.value = false;
};

watch([currentPage, searchBy], refreshData);
</script>

<template>
  <main>
    <HeaderComponent />
    <div class="pb-3 px-4 mt-5">
      <h1 class="text-2xl font-semibold mb-4">Leaders List</h1>

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

            <!-- <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th> -->
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>

            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Access Role
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 w-full inline-block">
          <tr
            v-for="user in users"
            :key="user.id"
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
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.fullname }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ user.username }}
                  </div>
                </div>
              </div>
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

            <td
              class="py-4 whitespace-nowrap text-sm font-medium text-gray-500"
            >
              <select
                @change="onChangeAccessControl(user, $event, roles[1].id)"
                class="border border-gray-300 p-2 rounded"
              >
                <option
                  v-for="role in access_control"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.access_control }}
                </option>
              </select>
            </td>

            <div
              v-if="showModal"
              class="fixed top-0 left-0 flex items-center justify-center h-screen w-full bg-gray-500 bg-opacity-[.2]"
            >
              <div class="bg-white p-6 rounded shadow-md">
                <p class="text-lg font-semibold mb-4">
                  Are you sure you want to assign this access control?
                </p>
                <div class="flex justify-end gap-4">
                  <button
                    @click="confirmChange"
                    class="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Yes
                  </button>
                  <button
                    @click="cancelChange"
                    class="px-4 py-2 bg-gray-300 rounded"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
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
