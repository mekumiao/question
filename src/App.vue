<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider, NConfigProvider, NDialogProvider, NGlobalStyle } from 'naive-ui'
import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
import { ref, provide } from 'vue'
import type { GlobalTheme } from 'naive-ui'
import { useDark } from '@vueuse/core'

const theme = ref<GlobalTheme | undefined>()
const isDark = useDark({
  onChanged(dark) {
    theme.value = dark ? darkTheme : undefined
  },
})
provide('isDark', isDark)
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme="theme">
    <NGlobalStyle />
    <NMessageProvider keep-alive-on-hover :max="3">
      <NDialogProvider>
        <RouterView></RouterView>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style lang="scss" scoped></style>
