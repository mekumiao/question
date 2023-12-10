<script setup lang="ts"></script>

<template>
  <div
    class="flex flex-row justify-between items-center justify-items-center m-2"
    style="background-color: var(--vt-c-white)"
  >
    <div class="flex flex-row ms-5 p-2">
      <img src="@/assets/img/icon.png" height="40" width="40" />
    </div>
    <nav class="flex flex-row">
      <ul class="flex flex-row justify-start items-center text-xl font-bold">
        <li class="px-1">开始考试</li>
        <li class="px-1">模拟考试</li>
        <li class="px-1">考试记录</li>
        <li class="px-1">错题重做</li>
        <li class="px-1">我要练习</li>
      </ul>
      <div
        class="w-16 h-16 border rounded-full flex justify-center items-center bg-blue-700 text-white"
      >
        头像
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped></style>
