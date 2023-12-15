<script setup lang="ts">
import { NStatistic, NIcon } from 'naive-ui'
import { MdSave } from '@vicons/ionicons4'
import { UserAddOutlined } from '@vicons/antd'
</script>

<template>
  <div class="dashboard-view grid grid-cols-4 grid-rows-2 gap-4">
    <NStatistic
      label="统计数据"
      :value="99"
      class="col-span-1 row-span-1 rounded border border-solid border-gray-300 p-2 shadow"
    >
      <template #prefix>
        <NIcon>
          <MdSave />
        </NIcon>
      </template>
      <template #suffix> / 100 </template>
    </NStatistic>
    <NStatistic
      label="活跃用户"
      tabular-nums
      class="col-span-1 row-span-1 rounded border border-solid border-gray-300 p-2 shadow"
    >
      <template #prefix>
        <NIcon>
          <UserAddOutlined />
        </NIcon>
      </template>
      1,234,123
    </NStatistic>
  </div>
</template>

<style lang="scss" scoped></style>
