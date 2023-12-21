<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NRate, NSpin } from 'naive-ui'
import { list as fetchExaminationList, type Examination } from '@/api/examination'
import { useRouter } from 'vue-router'
import { formatSeconds } from '@/utils'

const router = useRouter()

const loading = ref(false)
const examinations = ref<Examination[]>([])

fullData()

async function fullData() {
  try {
    loading.value = true
    examinations.value = await fetchExaminationList({ examinationType: 1 })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handleToAnswerView(item: Examination) {
  router.push({
    path: `/student/answer/${item.examPaperId}`,
    query: { examinationId: item.examinationId },
  })
}
</script>

<template>
  <div class="mx-4 flex flex-row items-center justify-center" style="min-height: 200px">
    <NSpin :show="loading">
      <div v-if="examinations.length === 0">
        <span v-if="loading">加载中...</span>
        <span v-else>没有发布任何考试</span>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <NCard v-for="(item, key) in examinations" :key="key">
          <template #header>{{ item.examinationName }}</template>
          <ul role="list" class="flex flex-col justify-center gap-1">
            <li>
              <span>考试时间：</span>
              <span>{{ formatSeconds(item.durationSeconds) }}</span>
            </li>
            <li>
              <span>难度：</span>
              <NRate :value="item.difficultyLevel" readonly :count="3"></NRate>
            </li>
          </ul>
          <template #action>
            <NButton @click="handleToAnswerView(item)" type="primary">进入考试</NButton>
          </template>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>

<style lang="scss" scoped></style>
