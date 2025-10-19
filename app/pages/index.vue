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
  category: Category;
} | null>(null);

const { checkRegistration, saveRegistration } = useReturningVisitor();

onMounted(async () => {
  const existing = await checkRegistration();

  if (existing) {
    registrationData.value = {
      username: existing.username,
      fullName: existing.fullName,
      category: existing.category,
    };
    currentView.value = "success";
  } else {
    setTimeout(() => {
      currentView.value = "form";
    }, 2000);
  }
});

function handleSuccess(data: {
  username: string;
  fullName: string;
  category: Category;
  grade: Grade;
  schoolName: string;
  mobile: string;
  email: string;
}) {
  registrationData.value = data;
  currentView.value = "success";

  saveRegistration({
    username: data.username,
    category: data.category,
    fullName: data.fullName,
    mobile: data.mobile,
    email: data.email,
    grade: data.grade,
    schoolName: data.schoolName,
    registeredAt: new Date().toISOString(),
  });
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
