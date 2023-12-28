<script setup lang="ts">
import type { AnswerBoard } from '@/api/answerBoard'
import { onMounted, ref } from 'vue'
import {
  create as fetchCreateAnswerBorard,
  redoIncorrect as fetchRedoIncorrect,
  random as fetchRandom,
} from '@/api/answerBoard'
import { NButton, NResult } from 'naive-ui'
import { useRouter } from 'vue-router'
import type { AnswerType } from './data'

const props = defineProps<{
  type: AnswerType
  examPaperId?: number
  examinationId?: number
  answerBoardId?: number
  examPaperName?: string
  difficultyLevel?: number
}>()
const router = useRouter()

const description = ref('创建答题板中...')
const answerBoard = ref<AnswerBoard>()

const loading = ref(false)

onMounted(async () => {
  await createAnswerBorard()
})

async function createAnswerBorard() {
  if (props.type === 'exam') {
    await createExamAnswerBorard()
  } else if (props.type === 'random') {
    await createRandomAnswerBorard()
  } else if (props.type === 'redo-incorrect') {
    await createRedoAnswerBorard()
  } else if (props.type === 'practice') {
    await createPracticeAnswerBorard()
  }
}

async function createExamAnswerBorard() {
  if (!props.examPaperId || !props.examinationId) {
    return
  }
  try {
    loading.value = true
    answerBoard.value = await fetchCreateAnswerBorard({
      examinationId: props.examinationId,
    })
    await router.replace({ path: `/student/answer-detail/${answerBoard.value.answerBoardId}` })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function createRandomAnswerBorard() {
  try {
    loading.value = true
    answerBoard.value = await fetchRandom({
      examPaperName: props.examPaperName,
      difficultyLevel: props.difficultyLevel,
    })
    await router.replace({ path: `/student/answer-detail/${answerBoard.value.answerBoardId}` })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function createRedoAnswerBorard() {
  if (!props.answerBoardId) {
    return
  }
  try {
    loading.value = true
    answerBoard.value = await fetchRedoIncorrect(props.answerBoardId)
    await router.replace({ path: `/student/answer-detail/${answerBoard.value.answerBoardId}` })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function createPracticeAnswerBorard() {
  if (!props.examPaperId) {
    return
  }
  try {
    loading.value = true
    answerBoard.value = await fetchCreateAnswerBorard({
      examPaperId: props.examPaperId,
    })
    await router.replace({ path: `/student/answer-detail/${answerBoard.value.answerBoardId}` })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto">
    <NResult status="info" :description="description" style="min-height: 200px">
      <template #footer>
        <NButton :loading="loading" type="primary" @click="createAnswerBorard">
          {{ loading ? '请稍后' : '立即进入' }}
        </NButton>
      </template>
    </NResult>
  </div>
</template>

<style lang="scss" scoped></style>
