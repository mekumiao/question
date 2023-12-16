<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider, NConfigProvider, NDialogProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
    <NMessageProvider keep-alive-on-hover :max="3">
      <NDialogProvider>
        <RouterView></RouterView>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style lang="scss" scoped></style>
