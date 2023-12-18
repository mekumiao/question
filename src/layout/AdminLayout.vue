<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
import SiderMenu from './components/SiderMenu.vue'
</script>

<template>
  <div class="admin-layout container mx-auto flex flex-col">
    <NavHeader></NavHeader>
    <main class="my-2 grid min-h-screen grid-cols-10 gap-2">
      <div class="col-span-2 rounded">
        <SiderMenu></SiderMenu>
      </div>
      <div class="col-span-8 rounded">
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<style lang="css" scoped></style>
