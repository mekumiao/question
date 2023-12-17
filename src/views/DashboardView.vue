<script setup lang="ts">
import { NStatistic, NIcon, NCard } from 'naive-ui'
import { UserAddOutlined } from '@vicons/antd'
import { count as fetchQuestionCount } from '@/api/questions'
import { count as fetchUserCount } from '@/api/users'
import { reactive } from 'vue'

const data = reactive({
  questionCount: 0,
  userCount: 0,
})

fetchQuestionCount().then((v) => {
  data.questionCount = v
})

fetchUserCount().then((v) => {
  data.userCount = v
})
</script>

<template>
  <NCard>
    <div class="m-3 grid grid-cols-4 gap-4">
      <NStatistic label="总题目数" class="col-span-1 row-span-1 p-2 shadow">
        共&nbsp;{{ data.questionCount.toLocaleString() }}&nbsp;题
      </NStatistic>
      <NStatistic label="活跃用户" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon>
            <UserAddOutlined />
          </NIcon>
        </template>
        {{ data.userCount.toLocaleString() }} / {{ (10000).toLocaleString() }}
      </NStatistic>
    </div>
  </NCard>
</template>

<style lang="scss" scoped></style>
