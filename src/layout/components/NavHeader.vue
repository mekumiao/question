<script setup lang="ts">
import router from '@/router'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const data = reactive({
  menus: [
    {
      path: '/',
      text: '首页',
    },
    {
      path: '/student/answer',
      text: '开始考试',
    },
    {
      path: '/student/2',
      text: '模拟考试',
    },
    {
      path: '/student/3',
      text: '考试记录',
    },
    {
      path: '/student/4',
      text: '错题重做',
    },
    {
      path: '/student/5',
      text: '我要练习',
    },
  ],
})

function handleClick(path: string) {
  router.push(path)
}
</script>

<template>
  <div
    class="flex flex-row items-center justify-between justify-items-center p-2"
    style="background-color: var(--vt-c-white)"
  >
    <div class="ms-5 flex flex-row p-2">
      <img src="@/assets/img/icon.png" height="40" width="40" />
    </div>
    <nav class="flex flex-row">
      <ul class="flex flex-row items-center justify-start text-xl font-bold">
        <li
          class="mx-2 cursor-pointer"
          :class="{ activate: item.path === route.path }"
          v-for="(item, key) in data.menus"
          :key="key"
          @click="handleClick(item.path)"
        >
          {{ item.text }}
        </li>
      </ul>
      <div
        class="ms-5 flex h-16 w-16 items-center justify-center rounded-full border bg-blue-700 text-white"
      >
        头像
      </div>
    </nav>
  </div>
</template>

<style lang="css" scoped>
.activate {
  color: var(--color-theme);
  border-bottom: 4px solid var(--color-theme);
}
</style>
