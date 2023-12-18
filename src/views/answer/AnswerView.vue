<script setup lang="ts">
import { shallowRef, ref } from 'vue'
import AnswerPanel from './AnswerPanel.vue'
import { NButton, NCard, useMessage, NRate, NSpin, NCountdown } from 'naive-ui'
import { get as fetchExam, type ExamPaper } from '@/api/examPapers'
import { list as fetchExaminationList, type Examination } from '@/api/examination'

const exam = shallowRef<ExamPaper>()
const loading = ref(false)
const examinations = ref<Examination[]>([])

const message = useMessage()

fullData()

async function fullData() {
  examinations.value = await fetchExaminationList({ examinationType: 1 })
}

async function handleAnswer(item: Examination) {
  try {
    loading.value = true
    exam.value = await fetchExam(item.examPaperId)
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
    <NSpin v-else :show="loading">
      <div class="grid grid-cols-3 gap-4">
        <NCard v-for="(item, key) in examinations" :key="key">
          <template #header>{{ item.examinationName }}</template>
          <ul role="list" class="flex flex-col justify-center gap-1">
            <li>
              <span>考试时间：</span>
              <NCountdown :active="false" :duration="item.durationSeconds * 1000" />
            </li>
            <li>
              <span>难度：</span>
              <NRate :value="item.difficultyLevel" readonly :count="3"></NRate>
            </li>
          </ul>
          <template #action>
            <NButton @click="handleAnswer(item)" type="primary">开始考试</NButton>
          </template>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>

<style lang="scss" scoped></style>
