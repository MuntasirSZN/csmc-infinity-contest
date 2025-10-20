<script setup lang="ts">
import { motion } from "motion-v";

defineProps<{
  username: string;
  fullName: string;
  category: Category;
}>();

const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

const cardVariants = computed(() => {
  if (prefersReducedMotion.value) return null;
  return {
    initial: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 600, ease: "easeOut" },
    },
  };
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 px-4 py-8 dark:from-neutral-900 dark:to-neutral-800">
    <motion.div
      v-if="cardVariants"
      :animate="cardVariants"
      class="w-full max-w-[600px]"
    >
      <UCard class="shadow-2xl">
        <div class="text-center">
          <div class="mb-6 flex justify-center">
            <Icon name="line-md:confirm-circle" size="64" class="text-green-500" />
          </div>

          <h2 class="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
            Registration Successful!
          </h2>

          <p class="mb-8 text-base text-neutral-600 dark:text-neutral-400">
            Congratulations, <strong>{{ fullName }}</strong
            >! Your registration has been completed.
          </p>

          <div
            class="mb-8 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-8 text-white shadow-xl transition-transform duration-300 hover:scale-[1.02]"
          >
            <div
              class="mb-2 text-sm font-medium uppercase tracking-wide opacity-90"
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

          <UAlert
            color="warning"
            variant="soft"
            icon="line-md:alert"
            title="Important"
            description="Please save your username. You will need it to participate in the contest."
            class="mb-6"
          />

          <div class="space-y-4">
            <UCard>
              <div class="flex items-start gap-3">
                <Icon name="line-md:document" class="mt-1 text-primary" size="24" />
                <div class="text-left">
                  <h3 class="font-semibold text-neutral-900 dark:text-neutral-100">Contest Rules</h3>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400">
                    This area is a placeholder for future content.
                  </p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-start gap-3">
                <Icon name="line-md:calendar" class="mt-1 text-primary" size="24" />
                <div class="text-left">
                  <h3 class="font-semibold text-neutral-900 dark:text-neutral-100">Program Schedule</h3>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400">
                    This area is a placeholder for future content.
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </UCard>
    </motion.div>
  </div>
</template>
