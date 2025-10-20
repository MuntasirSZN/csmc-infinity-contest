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
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4 dark:from-neutral-900 dark:to-neutral-800"
  >
    <UCard
      class="max-w-md shadow-xl transition-shadow duration-300 hover:shadow-2xl"
    >
      <div class="flex flex-col items-center gap-6 text-center">
        <NuxtImg
          src="/contest-logo.svg"
          alt="CSMC Infinity Contest Logo"
          class="size-30 object-contain"
          width="120"
          height="120"
          loading="eager"
          fetchpriority="high"
        />
        <div class="flex items-center justify-center">
          <Icon
            name="line-md:loading-alt-loop"
            class="text-primary"
            size="48"
            aria-hidden="true"
          />
        </div>
        <h1 class="m-0 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Welcome to CSMC Infinity Contest
        </h1>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">
          Preparing your registration...
        </p>
      </div>
    </UCard>
  </motion.div>
</template>
