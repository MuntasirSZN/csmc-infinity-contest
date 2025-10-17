<script setup lang="ts">
const props = defineProps<{ title?: string }>();
</script>

<template>
  <div role="region" aria-label="placeholder">
    <div class="rounded-md border border-dashed border-gray-300 bg-gray-50 p-3">
      <strong>{{ props.title ?? "Placeholder" }}</strong>
      <p class="mt-1.5 text-gray-600">
        This area is a placeholder for future content.
      </p>
    </div>
  </div>
</template>
