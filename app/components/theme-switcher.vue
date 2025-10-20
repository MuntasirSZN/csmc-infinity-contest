<script setup lang="ts">
const colorMode = useColorMode();

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <UButton
    :icon="
      colorMode.value === 'dark'
        ? 'line-md:moon-filled-to-sunny-filled-loop-transition'
        : 'line-md:sunny-filled-loop-to-moon-filled-loop-transition'
    "
    color="neutral"
    variant="ghost"
    aria-label="Toggle theme"
    @click="toggleTheme"
  />
</template>
