<script setup lang="ts">
const props = defineProps<{ title?: string }>();
</script>

<template>
  <UCard role="region" :aria-label="props.title ?? 'placeholder'">
    <div class="flex items-start gap-3">
      <Icon name="line-md:question-circle" class="mt-1 text-primary" size="24" />
      <div>
        <strong class="text-neutral-900 dark:text-neutral-100">{{ props.title ?? "Placeholder" }}</strong>
        <p class="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
          This area is a placeholder for future content.
        </p>
      </div>
    </div>
  </UCard>
</template>
