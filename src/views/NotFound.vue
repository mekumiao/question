<script setup lang="ts">
import { NResult, NButton } from 'naive-ui'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found flex h-screen flex-row items-center justify-center">
    <NResult status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <RouterLink to="/home"><NButton type="success">返回首页</NButton></RouterLink>
      </template>
    </NResult>
  </div>
</template>

<style lang="scss" scoped></style>
