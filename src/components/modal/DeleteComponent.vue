<script setup>
import axios from "../../../axios";
import { onMounted} from "vue";


const emit = defineEmits(["cancelButtonShowDeleteModal", "refreshData"]);

const props = defineProps({
  isDeleteModalShow: {
    type: Boolean,
    required: true,
  },
  sendBy: {
    type: String,
  },
  id: {
    type: String,
  },
});

const submitDelete = async () => {
  if (props.sendBy === "gallery") {
    const response = await axios.put(`/gallery/${props.id}/delete`);

    if (response.data.success) {
      emit("cancelButtonShowDeleteModal",'GalleryDelete');
      emit("refreshData");
    } else {
      toast.error("Try again!");
    }
  }else if(props.sendBy==="event"){
     const response = await axios.put(`/events/${props.id}/delete`);

    if (response.data.success) {
      emit("cancelButtonShowDeleteModal");
      emit("refreshData");
    } else {
      toast.error("Try again!");
    }
  }else if(props.sendBy==="devotional"){
    console.log(props.id)
     const response = await axios.put(`/devotional/${props.id}/delete`);

    if (response.data.success) {
      emit("cancelButtonShowDeleteModal",'DevotionalDelete');
      emit("refreshData");
    } else {
      toast.error("Try again!");
    }
  }else if(props.sendBy==="deleteComment"){
     const response = await axios.put(`/api/comment/${props.id}/delete`);

    if (response.data.success) {
      emit("cancelButtonShowDeleteModal");
      emit("refreshData");
    } else {
      toast.error("Try again!");
    }
  }
};

const cancelButtonShowDeleteModal = () => {
  emit("cancelButtonShowDeleteModal");
};
</script>
<template>
  <div
    v-if="isDeleteModalShow"
    class="fixed inset-0 flex items-center justify-center z-30 confirm-dialog"
  >
    <div
      class="px-4 min-h-screen flex items-center md:flex md:items-center md:justify-center"
    >
      <div
        class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 inset-x-0 bottom-0 border z-50 mb-4 mx-4 md:relative shadow-lg"
      >
        <div class="md:flex items-center">
          <div
            class="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto"
          >
            <i class="bx bx-error text-3xl"> &#9888; </i>
          </div>
          <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <p class="font-bold">Warning!</p>
            <p class="text-sm text-gray-700 mt-1">
              You will lose all of your data by deleting this. This action
              cannot be undone.
            </p>
          </div>
        </div>
        <div class="text-center md:text-right mt-4 md:flex md:justify-end">
          <button
            @click="submitDelete"
            id="confirm-delete-btn"
            class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
          >
            Delete
          </button>
          <button
            @click="cancelButtonShowDeleteModal"
            id="confirm-cancel-btn"
            class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>