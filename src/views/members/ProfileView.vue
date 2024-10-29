<script setup>
import { onMounted, ref } from "vue";
import ProfileComponent from "../../components/modal/ProfilesComponent.vue";
import ChangePasswordComponent from "../../components/modal/ChangePasswordComponent.vue";
import { fetchUser } from "../../composables/user";
import { useAuthStore } from "../../stores/store";

const access = localStorage.getItem("access");
const store= useAuthStore();
const showProfile=ref(false);
const showPasswordModal=ref(false);
const showQrcode =ref(false);

const viewQrcode =()=>{
  showQrcode.value=true;
}
const closeQrcode =()=>{
  showQrcode.value=false;
}
const editProfile=()=>{
showProfile.value=true;
}

const changePassword=()=>{
showPasswordModal.value=true;
}


const closeProfile=()=>{
    showProfile.value=false;
}
const closePasswordModal=()=>{
    showPasswordModal.value=false;
}

onMounted(async()=>{
  await fetchUser();
})
</script>
<template>
  <div class="py-3 px-4 lg:px-[50px] xl:px-32 mt-24">
    <section class="text-gray-600 lg:mt-12 xl:mt-12 md:mt-12 mt-6">
      <div class="border-b rounded-bl-lg rounded-br-lg my-7">
        <p
          class="outfit-header text-gray-600 p-4 border rounded-tl-lg rounded-tr-lg"
        >
          Basic Info
        </p>
        <p class="outfit-subtext border-x p-4">
          Some info may be visible to other people using Google services. Learn
          more
        </p>
        <div class="flex items-center w-full border-x p-4">
          <div class="lg:flex xl:flex w-2/3">
            <p class="w-full outfit-header">Profile picture </p>
            <p class="w-full">A picture helps personalize your account</p>
          </div>
          <p class="w-1/3 flex justify-center">
            <img
              :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${store.user.profile}`"
              class="h-12 w-12 rounded-full"
              alt=""
            />
          </p>
        </div>
        <div
          class="flex items-center w-full border-x p-4 rounded-bl-lg rounded-br-lg"
        >
          <div class="lg:flex xl:flex w-full">
            <p class="w-full outfit-header">Name</p>
            <p class="w-full">{{store.user.fullname}}</p>
          </div>
          <p class="w-1/2 flex justify-center items-center" :class="access? 'text-gray-700':'text-[#D98757]'">
            <span class="cursor-pointer" @click="editProfile()">
              <i class="fas fa-edit mx-1"></i>
              Edit profile</span
            >
          </p>
        </div>
        <!-- modal -->
       <ProfileComponent v-if="showProfile" @closeProfile="closeProfile" class="animate-slide-in"/>
       <!-- end modal -->
      </div>

      <!-- contact -->
      <div class="border-b rounded-bl-lg rounded-br-lg my-7">
        <p
          class="outfit-header text-gray-600 p-4 border rounded-tl-lg rounded-tr-lg"
        >
          Contact Info
        </p>
        <p class="outfit-subtext border-x p-4">
          The email address used to identify your Google Account to you and
          others. You can't change this address.
        </p>
        <div class="flex items-center w-full border-x p-4">
          <div class="lg:flex xl:flex w-2/3">
            <p class="w-1/2 outfit-header">Email</p>
            <p class="w-1/2">{{store.user.username}}</p>
          </div>
        </div>
      </div>
      <!-- privacy -->
      <div class="border-b rounded-bl-lg rounded-br-lg my-7">
        <p
          class="outfit-header text-gray-600 p-4 border rounded-tl-lg rounded-tr-lg"
        >
          Privacy
        </p>
        <p class="outfit-subtext border-x p-4">
          A strong password helps prevent unauthorized access to your account and personal information. 
        </p>
        <div class="flex items-center w-full border-x p-4">
          <div class="lg:flex xl:flex w-full">
            <p class="w-full outfit-header">Password</p>
            <p class="w-full">
              A secure password helps to protect your account.
            </p>
          </div>
          <a
            
            class="w-1/2 flex justify-center items-center cursor-pointer" @click="changePassword()" :class="access? 'text-gray-700':'text-[#D98757]'">
            <i class="fas fa-key mx-1"></i>
            Change Password
          </a>
             <ChangePasswordComponent v-if="showPasswordModal" @closePasswordModal="closePasswordModal"/>
        </div>
      </div>
      <div class="border-b rounded-bl-lg rounded-br-lg my-7">
        <p
          class="outfit-header text-gray-600 p-4 border rounded-tl-lg rounded-tr-lg"
        >
          QR Code Accounts
        </p>
        <p class="outfit-subtext border-x p-4">
A QR code can be used as an acknowledgment tool to confirm the receipt of a budget. When funds are transferred, a unique QR code is generated and sent to the recipient.        </p>
        <div class="flex items-center w-full border-x p-4">
          <div class="lg:flex xl:flex w-full">
            <p class="w-full outfit-header">Qr code</p>
            <p class="w-full">
              A secure password helps to protect your account.
            </p>
          </div>
          <div class="w-1/2 flex justify-center items-center">
            <img @click="viewQrcode"
              class="w-24 h-24 mx-auto"
              :src="store.user.qr_code_data"
              alt=""
            />

            <div v-if="showQrcode" @click="closeQrcode" class="min-h-screen bg-gray-100 flex items-center justify-center fixed top-0 left-0 w-full z-30">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h1 class="text-center text-2xl font-bold mb-6">Scan QR code</h1>
        <form>
           <img
              class="w-full h-full mx-auto"
              :src="store.user.qr_code_data"
              alt=""
            />
        </form>
    </div>
</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>