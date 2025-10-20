<script setup lang="ts">
useSeoMeta({
  title: "Registration - CSMC Infinity Contest",
  description:
    "Register for the CSMC Infinity Contest and receive your examination username",
  ogTitle: "Registration - CSMC Infinity Contest",
  ogDescription:
    "Register for the CSMC Infinity Contest and receive your examination username. Join students from grades 5-10 in this exciting mathematical competition.",
  ogType: "website",
  twitterTitle: "Registration - CSMC Infinity Contest",
  twitterDescription:
    "Register for the CSMC Infinity Contest and receive your examination username",
});

useSchemaOrg([
  {
    "@type": "Organization",
    name: "CSMC Infinity Contest",
    url: "https://csmc-infinity-contest.vercel.app",
    logo: "https://csmc-infinity-contest.vercel.app/contest-logo.svg",
  },
  {
    "@type": "Event",
    name: "CSMC Infinity Contest",
    description: "CSMC Infinity Contest - Mathematical Competition for grades 5-10",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: "CSMC",
    },
  },
]);

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
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <div class="fixed right-4 top-4 z-50">
      <ThemeSwitcher />
    </div>

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
