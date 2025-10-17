<script setup lang="ts">
defineProps<{
  username: string;
  fullName: string;
  category: string;
}>();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-8">
    <div class="w-full max-w-[600px] text-center">
      <div class="mb-6 flex justify-center">
        <Icon name="line-md:confirm-circle" size="64" color="#10b981" />
      </div>

      <h2 class="mb-4 text-3xl font-bold text-gray-800 sm:text-2xl">
        Registration Successful!
      </h2>

      <p class="mb-8 text-base text-gray-600">
        Congratulations, <strong>{{ fullName }}</strong
        >! Your registration has been completed.
      </p>

      <div
        class="mb-8 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 text-white shadow-[0_10px_25px_rgb(0_0_0/10%)]"
      >
        <div
          class="mb-2 text-sm font-medium tracking-wide uppercase opacity-90"
        >
          Your Examination Username
        </div>
        <div
          class="mb-4 font-mono text-3xl font-bold tracking-wide sm:text-2xl"
        >
          {{ username }}
        </div>
        <div
          class="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-[10px]"
        >
          {{ category }} Category
        </div>
      </div>

      <div class="mb-8 rounded-lg border border-amber-400 bg-amber-50 p-4">
        <p class="m-0 text-sm text-amber-900">
          Please save your username. You will need it to participate in the
          contest.
        </p>
      </div>

      <div class="mb-6">
        <TodoPlaceholder title="Contest Rules" />
      </div>

      <div class="mb-6">
        <TodoPlaceholder title="Program Schedule" />
      </div>
    </div>
  </div>
</template>
