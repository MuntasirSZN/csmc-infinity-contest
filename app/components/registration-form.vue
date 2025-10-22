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
const retryCount = ref(0);
const formRef = ref<HTMLFormElement>();

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

  window.addEventListener("beforeunload", handleUnsavedChanges);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleUnsavedChanges);
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

function handleUnsavedChanges(event: BeforeUnloadEvent) {
  if (loading.value) {
    event.preventDefault();
    event.returnValue = "";
  }
}

function focusFirstErrorField() {
  if (!formRef.value) return;

  nextTick(() => {
    const inputs = formRef.value?.querySelectorAll(
      "input[aria-invalid='true'], textarea[aria-invalid='true'], [data-invalid='true'] input, [data-invalid='true'] textarea",
    );
    if (inputs && inputs.length > 0) {
      const firstError = inputs[0] as HTMLElement;
      firstError.focus({ preventScroll: false });
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

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
    const isNetworkError =
      error instanceof Error && error.message?.includes("fetch");

    if (isNetworkError) {
      errorMessage.value =
        "Network error. Please check your connection and try again.";
      retryCount.value += 1;
    } else if (error && typeof error === "object" && "data" in error) {
      const errorData = error.data as RegistrationApiResponse;
      if (errorData?.error?.message) {
        errorMessage.value = errorData.error.message;
      } else {
        errorMessage.value =
          "An error occurred during registration. Please try again.";
      }

      focusFirstErrorField();
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
        ref="formRef"
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
            spellcheck="false"
            aria-label="Full name"
            aria-required="true"
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
            aria-label="Institute name"
            aria-required="true"
          />
        </UFormField>

        <UFormField label="Class" name="grade" required>
          <URadioGroup
            v-model="state.grade"
            :items="gradeOptions"
            :disabled="loading"
            orientation="horizontal"
            aria-label="Class selection"
            aria-required="true"
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
              aria-label="Section"
              aria-required="true"
              spellcheck="false"
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
              aria-label="Roll number"
              aria-required="true"
              inputmode="numeric"
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
            aria-label="Email address"
            aria-required="true"
            spellcheck="false"
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
            aria-label="Mobile number (Bangladeshi format)"
            aria-required="true"
            inputmode="tel"
          />
        </UFormField>

        <UFormField label="Father's Name" name="fatherName" required>
          <UInput
            v-model="state.fatherName"
            placeholder="Enter father's name"
            :disabled="loading"
            size="lg"
            icon="line-md:account"
            aria-label="Father's name"
            aria-required="true"
            spellcheck="false"
          />
        </UFormField>

        <UFormField label="Mother's Name" name="motherName" required>
          <UInput
            v-model="state.motherName"
            placeholder="Enter mother's name"
            :disabled="loading"
            size="lg"
            icon="line-md:account"
            aria-label="Mother's name"
            aria-required="true"
            spellcheck="false"
          />
        </UFormField>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          icon="line-md:alert-circle"
          :title="errorMessage"
          :description="
            retryCount > 0 && errorMessage.includes('Network')
              ? `Network error occurred ${retryCount} time(s). Please try again.`
              : undefined
          "
          class="mt-2"
          role="alert"
          aria-live="assertive"
        />

        <UButton
          type="submit"
          color="primary"
          size="lg"
          :loading="loading"
          :disabled="loading"
          block
          aria-label="Submit registration form"
        >
          {{ loading ? "Registering..." : "Register" }}
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
