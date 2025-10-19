<script setup lang="ts">
import { motion } from "motion-v";
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

const motionVariants = computed(() => {
  if (prefersReducedMotion.value) return null;
  return {
    initial: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 400,
        ease: "easeOut",
      },
    },
  };
});
</script>

<template>
  <motion.div
    v-if="motionVariants"
    :animate="motionVariants"
    class="flex min-h-screen items-center justify-center p-4"
  >
    <div class="flex max-w-md flex-col items-center gap-6 text-center">
      <NuxtImg
        src="/contest-logo.svg"
        alt="CSMC Infinity Contest Logo"
        class="size-30 object-contain"
        width="120"
        height="120"
      />
      <div class="flex items-center justify-center">
        <Icon
          name="line-md:loading-alt-loop"
          class="text-blue-500"
          size="48"
          aria-hidden="true"
        />
      </div>
      <h1 class="m-0 text-2xl font-semibold text-gray-800">
        Welcome to CSMC Infinity Contest
      </h1>
      <p class="m-0 text-sm text-gray-500">Preparing your registration...</p>
    </div>
  </motion.div>
</template>
