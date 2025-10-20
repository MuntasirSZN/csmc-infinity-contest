<script setup lang="ts">
import { consola } from "consola";

consola.wrapAll();

useHead({
  htmlAttrs: {
    lang: "en",
  },
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/contest-logo.svg",
    },
    {
      rel: "preload",
      as: "image",
      href: "/contest-logo.svg",
    },
  ],
});

useSeoMeta({
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
