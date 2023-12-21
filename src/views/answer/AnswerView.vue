<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { create as fetchCreateAnswerBorard, type AnswerBoard } from '@/api/answerBoard'
import { NButton, NResult } from 'naive-ui'
import { useRouter } from 'vue-router'

const props = defineProps<{ examPaperId: number; examinationId?: number }>()
const router = useRouter()

const description = ref('创建答题板中...')
const answerBoard = ref<AnswerBoard>()

const loading = ref(false)

onMounted(async () => {
  await createAnswerBorard()
})

async function createAnswerBorard() {
  try {
    loading.value = true
    answerBoard.value = await fetchCreateAnswerBorard({
      examPaperId: props.examPaperId,
      examinationId: props.examinationId,
    })
    await router.push({ path: `/student/answer-detail/${answerBoard.value.answerBoardId}` })
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
