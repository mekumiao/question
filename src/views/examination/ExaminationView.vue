<script setup lang="ts">
import { onActivated, ref } from 'vue'
import type { CountdownTimeInfo } from 'naive-ui'
import { NButton, NCard, NRate, NSpin, NEmpty, NTag, NCountdown, NSpace } from 'naive-ui'
import { listPublish as fetchExaminationList, type ExaminationPublish } from '@/api/examination'
import { useRouter } from 'vue-router'
import { formatSeconds } from '@/utils'

const router = useRouter()

const loading = ref(false)
const examinations = ref<ExaminationPublish[]>([])

onActivated(() => {
  fullData()
})

async function fullData() {
  try {
    loading.value = true
    const result = await fetchExaminationList({ examinationType: 1, limit: 100 })
    examinations.value = result.items
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handleToAnswerView(item: ExaminationPublish) {
  router.push({
    path: `/student/answer/exam/`,
    query: {
      examPaperId: item.examPaperId,
      examinationId: item.examinationId,
    },
  })
}

function renderCountdown({ hours, minutes, seconds }: CountdownTimeInfo) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`
}
</script>

<template>
  <div class="mx-4">
    <NSpin :show="loading">
      <NEmpty
        v-if="examinations.length === 0"
        :description="loading ? '加载中...' : '没有发布任何考试'"
        class="mt-5 p-2"
      >
        <template #extra>
          <NButton size="small">尝试刷新</NButton>
        </template>
      </NEmpty>
      <div v-else class="grid grid-cols-3 gap-4">
        <NCard v-for="(item, key) in examinations" :key="key">
          <template #header>{{ item.examinationName }}</template>
          <ul role="list" class="flex flex-col justify-center gap-1">
            <li class="flex flex-row items-baseline">
              <span>考试时间：</span>
              <NTag size="small" type="primary">{{ formatSeconds(item.durationSeconds) }}</NTag>
            </li>
            <li class="flex flex-row items-center">
              <span>难度：</span>
              <NRate :value="item.difficultyLevel" readonly :count="3"></NRate>
            </li>
            <li class="flex flex-row items-baseline">
              <span>已参加人数：</span>
              <NTag size="small" round type="info">{{ item.examParticipantCount }}</NTag>
            </li>
          </ul>
          <template #action>
            <div class="flex flex-row items-center justify-between">
              <NButton @click="handleToAnswerView(item)" type="primary">进入考试</NButton>
              <div v-if="item.answerState === 1">
                <NTag size="small" type="warning">未参加</NTag>
              </div>
              <div v-else-if="item.answerState === 2">
                <NSpace>
                  <NTag size="small" type="warning">答题中</NTag>
                  <NTag size="small" type="info">
                    <NCountdown
                      :render="renderCountdown"
                      :duration="item.remainingSeconds * 1000"
                      :active="true"
                    />
                  </NTag>
                </NSpace>
              </div>
              <div v-else-if="item.answerState === 3">
                <NTag size="small" type="primary">已完成</NTag>
              </div>
              <div v-else-if="item.answerState === 4">
                <NSpace>
                  <NTag size="small" type="primary">已完成</NTag>
                  <NTag size="small" type="error">已超时</NTag>
                </NSpace>
              </div>
            </div>
          </template>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>

<style lang="scss" scoped></style>
