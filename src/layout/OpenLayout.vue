<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
</script>

<template>
  <div class="open-layout flex flex-col" style="background-color: var(--color-background)">
    <NavHeader></NavHeader>
    <main class="m-2">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
