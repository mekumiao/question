<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
</script>

<template>
  <div class="student-layout container mx-auto flex flex-col">
    <NavHeader></NavHeader>
    <main class="my-2">
      <RouterView v-slot="{ Component }">
        <KeepAlive :exclude="['AnswerDetail', 'AnswerView']">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<style lang="css" scoped></style>
