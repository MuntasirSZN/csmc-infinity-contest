<script setup lang="ts">
import { consola } from "consola";

consola.wrapAll();

useHead({
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
    },
  ],
});
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
