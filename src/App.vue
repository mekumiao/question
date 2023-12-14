<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider, NConfigProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
    <NMessageProvider keep-alive-on-hover :max="3">
      <RouterView></RouterView>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style lang="css" scoped></style>
