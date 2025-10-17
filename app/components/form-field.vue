<script setup lang="ts">
defineProps<{
  label?: string;
  id?: string;
  error?: string | null;
  required?: boolean;
}>();
</script>

<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="mb-1.5 block font-semibold">
      {{ label }}<span v-if="required" aria-hidden="true"> *</span>
    </label>
    <div class="block">
      <slot />
    </div>
    <p
      v-if="error"
      class="mt-1.5 text-[0.95rem] text-red-600"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>
