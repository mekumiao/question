<script setup lang="tsx">
import './register'
import { Bar } from 'vue-chartjs'
import { ref } from 'vue'

const chartData = ref({
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12] }],
})
const chartOptions = ref({ responsive: true })
</script>

<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<style lang="scss" scoped></style>
