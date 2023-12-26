<script setup lang="ts">
import { NStatistic, NIcon, NCard } from 'naive-ui'
import { UserAddOutlined } from '@vicons/antd'
import { onActivated, ref } from 'vue'
// import VisualCharts from './VisualCharts.vue'
import { summary as fetchSummaryData, type Summary } from '@/api/statistics'
import { AnalyticsOutline, AtCircleOutline, AttachSharp, BalloonOutline } from '@vicons/ionicons5'
import { BarChartOutline, BuildOutline } from '@vicons/ionicons5'

const data = ref<Summary>({
  incorrectRate: 0,
  answerRate: 0,
  totalUsers: 0,
  totalQuestions: 0,
  totalExamSessions: 0,
  totalExamParticipations: 0,
  examPaperCount: 0,
})

onActivated(() => {
  fullData()
})

async function fullData() {
  try {
    const result = await fetchSummaryData()
    data.value = result
  } catch (error) {
    console.error(error)
  }
}

function convertToPercentage(decimalNumber: number) {
  const percentage = decimalNumber * 100
  const percentageString = Math.round(percentage)
  // const isInteger = percentage % 1 === 0
  // const percentageString = isInteger ? percentage.toFixed(0) : percentage.toFixed(2)
  return percentageString
}
</script>

<template>
  <NCard class="mt-3">
    <div class="grid grid-cols-4 gap-4">
      <NStatistic tabularNums label="总题目数" class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><BuildOutline /></NIcon>
        </template>
        {{ data.totalQuestions.toLocaleString() }}&nbsp;题
      </NStatistic>
      <NStatistic label="活跃用户" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><UserAddOutlined /></NIcon>
        </template>
        {{ data.totalUsers.toLocaleString() }}&nbsp;个
      </NStatistic>
      <NStatistic
        label="所有考试的总参与人数"
        tabular-nums
        class="col-span-1 row-span-1 p-2 shadow"
      >
        <template #prefix>
          <NIcon><AnalyticsOutline /></NIcon>
        </template>
        {{ data.totalExamParticipations.toLocaleString() }}&nbsp;次
      </NStatistic>
      <NStatistic label="错题率" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><AtCircleOutline /></NIcon>
        </template>
        {{ convertToPercentage(data.incorrectRate) }}&nbsp;%
      </NStatistic>
      <NStatistic label="试卷总数" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><AttachSharp /></NIcon>
        </template>
        {{ data.examPaperCount.toLocaleString() }}&nbsp;张
      </NStatistic>
      <NStatistic label="答题率" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><BalloonOutline /></NIcon>
        </template>
        {{ convertToPercentage(data.answerRate) }}&nbsp;%
      </NStatistic>
      <NStatistic label="发布的考试总场数" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><BarChartOutline /></NIcon>
        </template>
        {{ data.totalExamSessions.toLocaleString() }}&nbsp;条
      </NStatistic>
      <!-- <div class="col-span-4 row-span-2 shadow">
        <VisualCharts></VisualCharts>
      </div> -->
    </div>
  </NCard>
</template>

<style lang="scss" scoped></style>
