<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits<{
  success: [
    data: {
      username: string;
      fullName: string;
      category: Category;
      grade: Grade;
      schoolName: string;
      mobile: string;
      email: string;
    },
  ];
}>();

type FormSchema = z.output<typeof registrationRequestSchema>;

const registrationStore = useRegistrationStore();
const state = reactive<{
  fullName: string;
  schoolName: string;
  grade: Grade | undefined;
  section: string;
  roll: string;
  email: string;
  mobile: string;
  fatherName: string;
  motherName: string;
  deviceFingerprint: string;
}>(registrationStore.$state);

const loading = ref(false);
const errorMessage = ref<string | null>(null);

onMounted(async () => {
  const ua = navigator.userAgent;
  const lang = navigator.language;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const raw = `${ua}||${lang}||${screen}||${tz}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(hash));
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  state.deviceFingerprint = hex.slice(0, 32);
});

watch(
  state,
  (newState) => {
    registrationStore.$patch(newState);
  },
  { deep: true },
);

const gradeOptions = [
  { value: 5, label: "5" } as const,
  { value: 6, label: "6" } as const,
  { value: 7, label: "7" } as const,
  { value: 8, label: "8" } as const,
  { value: 9, label: "9" } as const,
  { value: 10, label: "10" } as const,
];

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  loading.value = true;
  errorMessage.value = null;

  try {
    const response = await $fetch<RegistrationApiResponse>(
      "/api/registration",
      {
        method: "POST",
        body: event.data,
      },
    );

    if (response.success && response.data) {
      emit("success", {
        username: response.data.username,
        fullName: response.data.fullName,
        category: response.data.category,
        grade: response.data.grade,
        schoolName: response.data.schoolName,
        mobile: response.data.mobile,
        email: response.data.email,
      });
    }
  } catch (error: unknown) {
    if (error && typeof error === "object" && "data" in error) {
      const errorData = error.data as RegistrationApiResponse;
      if (errorData?.error?.message) {
        errorMessage.value = errorData.error.message;
      } else {
        errorMessage.value =
          "An error occurred during registration. Please try again.";
      }
    } else {
      errorMessage.value =
        "An error occurred during registration. Please try again.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-[600px] px-4 py-8">
    <UCard class="shadow-xl">
      <div class="mb-8 text-center">
        <h2
          class="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100"
        >
          Student Registration
        </h2>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          Please fill in all fields to complete your registration
        </p>
      </div>

      <UForm
        :schema="registrationRequestSchema"
        :state="state"
        class="flex flex-col gap-5"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="fullName" required>
          <UInput
            v-model="state.fullName"
            placeholder="Enter your full name"
            autocomplete="name"
            :disabled="loading"
            size="lg"
            icon="line-md:account"
          />
        </UFormField>

        <UFormField label="Institute" name="schoolName" required>
          <UInput
            v-model="state.schoolName"
            placeholder="Enter your school/college name"
            autocomplete="organization"
            :disabled="loading"
            size="lg"
            icon="line-md:folder-settings-filled"
          />
        </UFormField>

        <UFormField label="Class" name="grade" required>
          <URadioGroup
            v-model="state.grade"
            :items="gradeOptions"
            :disabled="loading"
            orientation="horizontal"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormField label="Section" name="section" required class="min-w-0">
            <UInput
              v-model="state.section"
              placeholder="e.g., A"
              :disabled="loading"
              size="lg"
              icon="line-md:text-box"
            />
          </UFormField>

          <UFormField label="Roll Number" name="roll" required class="min-w-0">
            <UInput
              v-model="state.roll"
              type="number"
              placeholder="e.g., 123"
              :disabled="loading"
              size="lg"
              icon="line-md:hash"
            />
          </UFormField>
        </div>

        <UFormField label="Email" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="your.email@example.com"
            autocomplete="email"
            :disabled="loading"
            size="lg"
            icon="line-md:email"
          />
        </UFormField>

        <UFormField label="Mobile Number" name="mobile" required>
          <UInput
            v-model="state.mobile"
            type="tel"
            placeholder="01712345678"
            autocomplete="tel"
            :disabled="loading"
            size="lg"
            icon="line-md:phone"
          />
        </UFormField>

        <UFormField label="Father's Name" name="fatherName" required>
          <UInput
            v-model="state.fatherName"
            placeholder="Enter father's name"
            :disabled="loading"
            size="lg"
            icon="line-md:account"
          />
        </UFormField>

        <UFormField label="Mother's Name" name="motherName" required>
          <UInput
            v-model="state.motherName"
            placeholder="Enter mother's name"
            :disabled="loading"
            size="lg"
            icon="line-md:account"
          />
        </UFormField>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          icon="line-md:alert-circle"
          :title="errorMessage"
          class="mt-2"
        />

        <UButton
          type="submit"
          color="primary"
          size="lg"
          :loading="loading"
          :disabled="loading"
          block
        >
          {{ loading ? "Registering..." : "Register" }}
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
