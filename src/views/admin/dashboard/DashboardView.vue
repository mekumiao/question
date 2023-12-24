<script setup lang="ts">
import { NStatistic, NIcon, NCard } from 'naive-ui'
import { UserAddOutlined } from '@vicons/antd'
import { ref } from 'vue'
import VisualCharts from './VisualCharts.vue'
import { summary as fetchSummaryData, type Summary } from '@/api/statistics'
import { AnalyticsOutline, AtCircleOutline, AttachSharp, BalloonOutline } from '@vicons/ionicons5'
import { BarChartOutline, BuildOutline } from '@vicons/ionicons5'

const data = ref<Summary>({
  mistakeRate: 0,
  answerRate: 0,
  userCount: 0,
  questionCount: 0,
  examinationCount: 0,
  examinationCountNumber: 0,
  examPaperCount: 0,
})

fullData()

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
  const isInteger = percentage % 1 === 0
  const percentageString = isInteger ? percentage.toFixed(0) : percentage.toFixed(2)
  return `${percentageString}%`
}
</script>

<template>
  <NCard>
    <div class="m-3 grid grid-cols-4 gap-4">
      <NStatistic tabularNums label="总题目数" class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><BuildOutline /></NIcon>
        </template>
        {{ data.questionCount.toLocaleString() }}&nbsp;题
      </NStatistic>
      <NStatistic label="活跃用户" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><UserAddOutlined /></NIcon>
        </template>
        {{ data.userCount.toLocaleString() }}&nbsp;个
      </NStatistic>
      <NStatistic label="总参加考试次数" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><AnalyticsOutline /></NIcon>
        </template>
        {{ data.examinationCountNumber.toLocaleString() }}&nbsp;次
      </NStatistic>
      <NStatistic label="错题率" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><AtCircleOutline /></NIcon>
        </template>
        {{ convertToPercentage(data.mistakeRate) }}
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
        {{ convertToPercentage(data.answerRate) }}
      </NStatistic>
      <NStatistic label="考试总数" tabular-nums class="col-span-1 row-span-1 p-2 shadow">
        <template #prefix>
          <NIcon><BarChartOutline /></NIcon>
        </template>
        {{ data.examinationCount.toLocaleString() }}&nbsp;条
      </NStatistic>
      <div class="col-span-4 row-span-2 shadow">
        <VisualCharts></VisualCharts>
      </div>
    </div>
  </NCard>
</template>

<style lang="scss" scoped></style>
