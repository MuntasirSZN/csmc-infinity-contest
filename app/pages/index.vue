<script setup lang="ts">
useSeoMeta({
  title: "Registration - CSMC Infinity Contest",
  description:
    "Register for the CSMC Infinity Contest and receive your examination username",
});

const currentView = ref<"loader" | "form" | "success">("loader");
const registrationData = ref<{
  username: string;
  fullName: string;
  category: string;
} | null>(null);

onMounted(() => {
  setTimeout(() => {
    currentView.value = "form";
  }, 2000);
});

function handleSuccess(data: {
  username: string;
  fullName: string;
  category: string;
}) {
  registrationData.value = data;
  currentView.value = "success";
}
</script>

<template>
  <div class="min-h-screen">
    <RegistrationLoader v-if="currentView === 'loader'" />

    <RegistrationForm
      v-else-if="currentView === 'form'"
      @success="handleSuccess"
    />

    <SuccessMessage
      v-else-if="currentView === 'success' && registrationData"
      :username="registrationData.username"
      :full-name="registrationData.fullName"
      :category="registrationData.category"
    />
  </div>
</template>
