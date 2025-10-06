<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <div>
    <h1 class="flex justify-center items-center font-bold scale-150">
      Hello World!
    </h1>
    <p>Count is {{ count }}</p>
    <code>
      let a = 10
      <br>
      console.log(a)
    </code>
  </div>
</template>
