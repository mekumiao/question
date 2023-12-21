<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AnswerPanel from '@/components/answer/AnswerPanel.vue'
import { NButton, useDialog, NResult, NModal, NCountdown, NIcon, NCard, useMessage } from 'naive-ui'
import { update as submitAnswerBoard, get as fetchAnswerBord } from '@/api/answerBoard'
import { TimeOutline } from '@vicons/ionicons5'
import type { AnswerBoard } from '@/api/answerBoard'
import type { CountdownTimeInfo } from 'naive-ui'

const props = defineProps<{ answerBoardId: number }>()
const dialog = useDialog()
const message = useMessage()
const answerPanelRef = ref<InstanceType<typeof AnswerPanel>>()

const showResultDialog = ref(false)
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
    isEditable.value = !answerBoard.value.isSubmission
    isClock.value = !answerBoard.value.isSubmission
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handleSucmit() {
  const inputAnswers = answerPanelRef.value?.toAnswerInputs()
  if (!inputAnswers || !inputAnswers.length || !inputAnswers.every((v) => v.answerText)) {
    message.warning('您有未作答的题目，请完成所有题目后继续')
    return
  }
  const d = dialog.create({
    title: '确认',
    content: '提交之后不能修改，确定继续吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        d.loading = true
        const result = await submitAnswerBoard(props.answerBoardId, inputAnswers)
        answerBoard.value = result
        isEditable.value = false
        d.loading = false
        showResultDialog.value = true
      } catch (error) {
        if (error instanceof Error) message.error(error.message)
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
            v-if="answerBoard && !answerBoard.isSubmission && answerBoard.durationSeconds > 0"
            class="flex w-fit flex-row items-center justify-center gap-2 text-red-500"
          >
            <NIcon color="#18a058"><TimeOutline></TimeOutline></NIcon>
            <NCountdown
              :render="renderCountdown"
              :duration="(answerBoard?.durationSeconds ?? 0) * 1000"
              :active="isClock"
            />
          </div>
          <span>{{ answerBoard?.examPaperName }}</span>
        </div>
        <div class="flex flex-row gap-2">
          <NButton
            v-if="answerBoard && !answerBoard.isSubmission"
            type="success"
            @click="handleSucmit"
          >
            交卷
          </NButton>
        </div>
      </div>
      <AnswerPanel
        ref="answerPanelRef"
        v-if="answerBoard"
        :answer-board="answerBoard"
        :is-editable="isEditable"
      ></AnswerPanel>
    </div>
  </div>

  <NModal :show="showResultDialog">
    <NCard style="width: 600px" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <NResult status="success" title="交卷成功！" description="">
        <ul class="flex flex-col items-center gap-2">
          <li v-if="answerBoard?.totalIncorrectAnswers === 0">恭喜您，已全部答对！</li>
          <li v-else>
            <span>总共{{ answerBoard?.questions.length }}题，</span>
            <span>错{{ answerBoard?.totalIncorrectAnswers }}题，</span>
            <span>
              对{{
                (answerBoard?.questions.length ?? 0) - (answerBoard?.totalIncorrectAnswers ?? 0)
              }}题。
            </span>
          </li>
          <li><span>耗时:</span>{{ answerBoard?.timeTakenSeconds }}</li>
        </ul>
        <template #footer>
          <NButton type="primary" size="small" @click="showResultDialog = false">朕已阅</NButton>
        </template>
      </NResult>
    </NCard>
  </NModal>
</template>

<style lang="scss" scoped></style>
