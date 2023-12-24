<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
import SiderMenu from './components/SiderMenu.vue'
</script>

<template>
  <div class="container mx-auto flex flex-col">
    <NavHeader></NavHeader>
    <main class="grid grid-cols-10 gap-2">
      <div class="col-span-2">
        <SiderMenu></SiderMenu>
      </div>
      <div class="col-span-8 overflow-auto" style="max-height: calc(100vh - var(--header-height))">
        <RouterView v-slot="{ Component }">
          <KeepAlive :exclude="[]">
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<style lang="css" scoped></style>
