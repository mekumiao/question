<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
</script>

<template>
  <div
    class="student-layout container mx-auto flex flex-col"
    style="background-color: var(--color-background)"
  >
    <NavHeader></NavHeader>
    <main class="my-2">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style lang="css" scoped></style>
