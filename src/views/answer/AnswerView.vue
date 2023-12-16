<script setup lang="ts">
import { shallowRef, ref } from 'vue'
import AnswerPanel from './AnswerPanel.vue'
import { NButton, useMessage } from 'naive-ui'
import { get as fetchExam, type Exam } from '@/api/exams'

const examId = 4
const exam = shallowRef<Exam>()
const loading = ref(false)

const message = useMessage()

async function handleStartTest() {
  try {
    loading.value = true
    exam.value = await fetchExam(examId)
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="answer-view">
    <AnswerPanel v-if="exam" :exam="exam"></AnswerPanel>
    <div v-else class="flex flex-row items-center justify-center">
      <NButton :loading="loading" @click="handleStartTest" type="primary">开始考试</NButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
