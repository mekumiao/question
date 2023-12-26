<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
</script>

<template>
  <div class="container mx-auto flex flex-col">
    <NavHeader></NavHeader>
    <main class="overflow-auto pt-2" style="max-height: calc(100vh - var(--header-height))">
      <RouterView v-slot="{ Component }">
        <KeepAlive :exclude="['AnswerDetail', 'AnswerView', 'LoginView']">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<style lang="css" scoped></style>
