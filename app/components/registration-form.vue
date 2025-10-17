<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits<{
  success: [data: { username: string; fullName: string; category: string }];
}>();

type FormSchema = z.output<typeof registrationRequestSchema>;

const state = reactive<{
  fullName: string;
  schoolName: string;
  grade: 5 | 6 | 7 | 8 | 9 | 10 | undefined;
  section: string;
  roll: string;
  email: string;
  mobile: string;
  fatherName: string;
  motherName: string;
}>({
  fullName: "",
  schoolName: "",
  grade: undefined,
  section: "",
  roll: "",
  email: "",
  mobile: "",
  fatherName: "",
  motherName: "",
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);

const gradeOptions = [
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
];

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  loading.value = true;
  errorMessage.value = null;

  try {
    const deviceFingerprint = "temp-fingerprint";

    const response = await $fetch<RegistrationApiResponse>(
      "/api/registration",
      {
        method: "POST",
        body: {
          ...event.data,
          deviceFingerprint,
        },
      },
    );

    if (response.success && response.data) {
      emit("success", {
        username: response.data.username,
        fullName: response.data.fullName,
        category: response.data.category,
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
    <div class="mb-8 text-center">
      <h2 class="mb-2 text-3xl font-bold text-gray-800">
        Student Registration
      </h2>
      <p class="text-sm text-gray-500">
        Please fill in all fields to complete your registration
      </p>
    </div>

    <UForm
      :schema="registrationRequestSchema"
      :state="state"
      class="flex flex-col gap-5"
      @submit="onSubmit"
    >
      <UFormGroup label="Name" name="fullName" required>
        <UInput
          v-model="state.fullName"
          placeholder="Enter your full name"
          autocomplete="name"
          :disabled="loading"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Institute" name="schoolName" required>
        <UInput
          v-model="state.schoolName"
          placeholder="Enter your school/college name"
          autocomplete="organization"
          :disabled="loading"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Class" name="grade" required>
        <URadioGroup
          v-model="state.grade"
          :options="gradeOptions"
          :disabled="loading"
        />
      </UFormGroup>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UFormGroup label="Section" name="section" required class="min-w-0">
          <UInput
            v-model="state.section"
            placeholder="e.g., A"
            :disabled="loading"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="Roll Number" name="roll" required class="min-w-0">
          <UInput
            v-model="state.roll"
            type="number"
            placeholder="e.g., 123"
            :disabled="loading"
            size="lg"
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Email" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          placeholder="your.email@example.com"
          autocomplete="email"
          :disabled="loading"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Mobile Number" name="mobile" required>
        <UInput
          v-model="state.mobile"
          type="tel"
          placeholder="01712345678"
          autocomplete="tel"
          :disabled="loading"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Father's Name" name="fatherName" required>
        <UInput
          v-model="state.fatherName"
          placeholder="Enter father's name"
          :disabled="loading"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Mother's Name" name="motherName" required>
        <UInput
          v-model="state.motherName"
          placeholder="Enter mother's name"
          :disabled="loading"
          size="lg"
        />
      </UFormGroup>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
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
  </div>
</template>
