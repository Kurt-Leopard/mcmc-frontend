<template>
  <div class="relative min-h-screen bg-white flex flex-col items-center justify-center z-30">
    <!-- Header -->
    <div class="absolute top-10 left-4 text-white text-lg font-semibold">
      <i class="fas fa-arrow-left"></i> Scan QR code
    </div>

    <!-- QR Code Scanner Area -->
    <div class="relative w-72 h-72 border-4 border-blue-500 rounded-md overflow-hidden">
      <!-- Video element for the QR scanner -->
      <video
        id="qr-video"
        ref="qrVideo"
        @canplay="enableScanner"
        autoplay
        class="absolute inset-0 w-full h-full object-cover"
      ></video>

      <!-- Scanning Line -->
      <div class="absolute w-full h-20 bg-green-500  scanning-line" style="opacity: 0.2;"></div>
    </div>

    <!-- Flash and Instruction -->
    <div class="mt-8 flex flex-col items-center text-white">
      <button class="text-gray-700">
        <i class="fas fa-bolt text-xl"></i> Scan QR Code
      </button>
      <p class="mt-4 text-black">Scan QR code for budget acknowledgment</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import jsQR from "jsqr";

const qrVideo = ref(null);
let videoStream = null;
let scanInterval = null;

// Start scanning for QR codes
const enableScanner = () => {
  scanInterval = setInterval(scanQR, 100); // Scan every 100ms
};

// Scan for QR codes in the video feed
const scanQR = () => {
  if (qrVideo.value && qrVideo.value.readyState === qrVideo.value.HAVE_ENOUGH_DATA) {
    const video = qrVideo.value;
    const canvasElement = document.createElement("canvas");
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    const canvas = canvasElement.getContext("2d");

    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code.data) {
        alert("QR Code Found: " + code.data);
      console.log("QR Code Found:", code.data);
    }
  }
};

// Setup the video stream when the component is mounted
onMounted(() => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      videoStream = stream;
      qrVideo.value.srcObject = stream;
      enableScanner(); // Start scanning when video is ready
    })
    .catch((err) => console.log(err));
});

// Stop scanning when the component is unmounted
onUnmounted(() => {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }
  if (scanInterval) {
    clearInterval(scanInterval);
  }
});
</script>

<style scoped>
.scanning-line {
  position: absolute;
  top: 0;
  animation: scanning 2s infinite;
}

@keyframes scanning {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}
</style>
