<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AnswerPanel from '@/components/answer/AnswerPanel.vue'
import { NButton, useDialog, NResult, NModal, NCountdown, NIcon, NCard } from 'naive-ui'
import { update as submitAnswerBoard, get as fetchAnswerBord } from '@/api/answerBoard'
import { TimeOutline } from '@vicons/ionicons5'
import type { AnswerBoard } from '@/api/answerBoard'
import type { CountdownTimeInfo } from 'naive-ui'

const props = defineProps<{ answerBoardId: number }>()
const dialog = useDialog()
const answerPanelRef = ref<InstanceType<typeof AnswerPanel>>()

const showCover = ref(false)
const showResultPaper = ref(false)
const isEditable = ref(true)
const answerBoard = ref<AnswerBoard>()
const loading = ref(false)
const isClock = ref(true)

onMounted(() => {
  fullData()
})

async function fullData() {
  try {
    loading.value = true
    answerBoard.value = await fetchAnswerBord(props.answerBoardId)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handleSucmit() {
  const d = dialog.create({
    title: '确认',
    content: '提交之后不能修改，确定继续吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const inputAnswers = answerPanelRef.value?.toAnswerInputs()
      if (!inputAnswers) return
      try {
        d.loading = true
        const answerBoard = await submitAnswerBoard(props.answerBoardId, inputAnswers)
        answerBoard.totalIncorrectAnswers
        // for (const item of answers) {
        //   const question = outputs.find((v) => v.questionId === item.questionId)
        //   item.isCorrect = question?.isCorrect ?? false
        // }
        isEditable.value = true
        d.loading = false
        showResultPaper.value = true
      } catch (error) {
        console.error(error)
      } finally {
        d.loading = false
      }
    },
  })
}

function renderCountdown({ minutes, seconds }: CountdownTimeInfo) {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
</script>

<template>
  <div class="mx-4">
    <div>
      <div class="mb-2 flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-2">
          <div
            v-if="answerBoard && answerBoard.durationSeconds > 0"
            class="flex w-fit flex-row items-center justify-center gap-1 text-red-500"
          >
            <NIcon color="#18a058"><TimeOutline></TimeOutline></NIcon>
            <NCountdown
              :render="renderCountdown"
              :duration="(answerBoard?.durationSeconds ?? 0) * 1000"
              :active="isClock"
            />
          </div>
          <span>《{{ answerBoard?.examPaperName }}》</span>
        </div>
        <div class="flex flex-row gap-2">
          <NButton type="success" @click="handleSucmit">交卷</NButton>
        </div>
      </div>
      <AnswerPanel v-if="answerBoard" :answer-board="answerBoard"></AnswerPanel>
    </div>
  </div>

  <NModal v-model:show="showResultPaper">
    <NCard style="width: 600px" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <NResult status="success" title="完成" :description="'恭喜您，已全部答对！'">
        <template #footer>
          <NButton type="primary" size="small" @click="showResultPaper = false">朕已阅</NButton>
        </template>
      </NResult>
    </NCard>
  </NModal>

  <NModal :show="showCover">
    <NCard
      style="width: 600px"
      title="开始作答"
      size="huge"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      试卷《{{ answerBoard?.examPaperName }}》，考试时间 {{ answerBoard?.durationSeconds }}
      <template #footer>
        <div class="flex flex-row justify-end gap-2">
          <NButton size="small">取消考试</NButton>
          <NButton type="primary" size="small">点击开始</NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<style lang="scss" scoped></style>
