<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
import SiderMenu from './components/SiderMenu.vue'
</script>

<template>
  <div class="admin-layout flex flex-col" style="background-color: var(--color-background)">
    <NavHeader></NavHeader>
    <main class="flex flex-row">
      <div class="rounded bg-white"><SiderMenu></SiderMenu></div>
      <div class="m-2 w-full rounded bg-white p-3">
        <RouterView></RouterView>
      </div>
    </main>
  </div>
</template>

<style lang="css" scoped></style>
