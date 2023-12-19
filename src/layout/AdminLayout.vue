<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
import SiderMenu from './components/SiderMenu.vue'
import { NEl } from 'naive-ui'
</script>

<template>
  <div class="admin-layout container mx-auto flex flex-col">
    <NEl
      class="sticky top-0 z-10"
      style="
        background-color: var(--body-color);
        transition: background-color 0.3s var(--cubic-bezier-ease-in-out);
      "
    >
      <NavHeader></NavHeader>
    </NEl>
    <main class="grid grid-cols-10 gap-2">
      <div class="col-span-2">
        <SiderMenu></SiderMenu>
      </div>
      <div class="col-span-8 overflow-auto" style="max-height: calc(100vh - var(--header-height))">
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
