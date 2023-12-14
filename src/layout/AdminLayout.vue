<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
import SiderMenu from './components/SiderMenu.vue'
</script>

<template>
  <div
    class="admin-layout container mx-auto flex flex-col"
    style="background-color: var(--color-background)"
  >
    <NavHeader></NavHeader>
    <main class="my-2 grid grid-cols-10 gap-2">
      <div class="col-span-2 overflow-hidden rounded bg-white">
        <SiderMenu></SiderMenu>
      </div>
      <div class="col-span-8 rounded bg-white p-3">
        <RouterView></RouterView>
      </div>
    </main>
  </div>
</template>

<style lang="css" scoped></style>
