<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider } from 'naive-ui'
</script>

<template>
  <NMessageProvider keep-alive-on-hover :max="3"><RouterView></RouterView></NMessageProvider>
</template>

<style lang="css" scoped></style>
