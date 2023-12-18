<script setup lang="tsx">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'

const domRef = ref<HTMLElement>()
const echart = shallowRef<echarts.ECharts>()

onMounted(() => {
  const chart = echarts.init(domRef.value)
  echart.value = chart
  chart.setOption({
    xAxis: {
      type: 'category',
      data: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ],
    },
    tooltip: {
      trigger: 'axis',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320, 801, 102, 230, 4321, 4129],
        type: 'line',
        smooth: true,
      },
    ],
  })
  window.onresize = function () {
    //自适应大小
    chart.resize()
  }
})

onUnmounted(() => {
  echart.value?.dispose()
})
</script>

<template>
  <div ref="domRef" class="h-64"></div>
</template>

<style lang="scss" scoped></style>
