<script setup lang="ts">
import SheetList from './SheetList.vue'
import { onMounted, provide, reactive, ref, watch } from 'vue'
import type { CountdownTimeInfo } from 'naive-ui'
import type { Exam, ExamQuestion } from '@/api/exams'
import type { AnswerOption } from './data'
import { NRadio, NRadioGroup, NCheckbox, NCheckboxGroup, NInput, NButton } from 'naive-ui'
import { useDialog, useMessage, NCountdown, NIcon, NCard, NScrollbar } from 'naive-ui'
import { TimeOutline } from '@vicons/ionicons5'

type AnswerOptionWithIndex = AnswerOption & { index: [number, number] }

const props = defineProps<{ exam: Exam }>()

const active = ref(true)
const data = reactive<{
  question: ExamQuestion & { number?: number; answer?: AnswerOption['answer'] }
  sheet: AnswerOptionWithIndex[][]
  select: {
    single?: number
    multiple?: number[]
    truefalse?: string
    fillblank?: string
  }
}>({
  question: {} as ExamQuestion,
  sheet: [[], [], [], []],
  select: {},
})
const selected = ref<number>()

const dialog = useDialog()
const message = useMessage()

provide('selected', selected)

onMounted(async () => {
  fullData(props.exam)
})

function fullData(exam: Exam) {
  if (exam.examQuestions.length) {
    // 目前仅有4种题型：单选、多选、判断、填空
    let number = 0
    for (let i = 0; i < 4; i++) {
      data.sheet[i] = exam.examQuestions
        .filter((v) => v.questionType === i + 1)
        .map((v, n) => ({
          number: ++number,
          questionId: v.questionId,
          questionType: v.questionType,
          options: v.options,
          index: [i, n],
        }))
    }
    const first = data.sheet[0][0]
    const item = exam.examQuestions.find((v) => v.questionId === first.questionId)
    if (item) {
      data.question = { ...item, number: first.number }
      selected.value = item.questionId
    }
  }
}

watch(
  () => data.question,
  (value) => {
    if (value.questionType === 1) {
      data.select = { single: value.answer as number }
    } else if (value.questionType === 2) {
      data.select = { multiple: value.answer as number[] }
    } else if (value.questionType === 3) {
      data.select = { truefalse: value.answer as string }
    } else if (value.questionType === 4) {
      data.select = { fillblank: (value.answer ?? '') as string }
    }
  },
)

function toAnswer() {
  const value = data.question
  if (value.questionType === 1) {
    return data.select.single
  } else if (value.questionType === 2) {
    return data.select.multiple
  } else if (value.questionType === 3) {
    return data.select.truefalse
  } else if (value.questionType === 4) {
    return data.select.fillblank || undefined
  }
}

function handleAnswer() {
  const answer = toAnswer()
  data.question.answer = answer
  const item = data.sheet[data.question.questionType - 1].find(
    (v) => v.questionId === data.question.questionId,
  )
  if (item) {
    item.answer = answer
    const nextQuestion = nextAnswerOption(item)
    nextQuestion && handleSheetSelect(nextQuestion)
  }
}

function handleBackClick() {
  const item = data.sheet[data.question.questionType - 1].find(
    (v) => v.questionId === data.question.questionId,
  )
  if (item) {
    const backQuestion = backAnswerOption(item)
    backQuestion && handleSheetSelect(backQuestion)
  }
}

function backAnswerOption(current: AnswerOptionWithIndex): AnswerOption | void {
  let [x, y] = current.index
  if (y > 0) {
    return data.sheet[x][y - 1]
  } else if (x > 0) {
    return data.sheet[x - 1][data.sheet[x - 1].length - 1]
  }
}

function nextAnswerOption(current: AnswerOptionWithIndex): AnswerOption | void {
  let [x, y] = current.index
  if (y + 1 < data.sheet[x].length) {
    return data.sheet[x][y + 1]
  } else if (x + 1 < data.sheet.length) {
    return data.sheet[x + 1][0]
  }
}

function handleSheetSelect(value: AnswerOption) {
  selected.value = value.questionId
  if (value.questionId !== data.question.questionId) {
    const question = props.exam.examQuestions.find((v) => v.questionId === value.questionId)
    if (question) {
      data.question = { ...question, number: value.number }
    }
  }
  data.question.answer = value.answer
}

function renderCountdown({ minutes, seconds }: CountdownTimeInfo) {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function handleSucmit() {
  dialog.create({
    title: '确认',
    content: '提交之后不能修改，确定继续吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      message.success('提交成功')
    },
  })
}
</script>

<template>
  <div class="grid grid-cols-5 gap-2">
    <NCard class="col-span-3 flex flex-col justify-between rounded p-3">
      <div class="mt-1 xl:h-80">
        <div class="flex w-fit flex-row items-center justify-center gap-1 text-red-500">
          <NIcon color="#18a058"><TimeOutline></TimeOutline></NIcon>
          <NCountdown :render="renderCountdown" :duration="1800 * 1000" :active="active" />
        </div>
        <h4 class="flex flex-row items-baseline justify-start">
          <span>{{ data.question.number }}.&nbsp;</span>
          <NScrollbar class="my-5 xl:max-h-56">
            {{ data.question.questionText }}
          </NScrollbar>
        </h4>
        <template v-if="data.question.questionType === 1">
          <NRadioGroup v-model:value="data.select.single">
            <NRadio
              v-for="(item, key) in data.question.options"
              :key="key"
              :label="item.optionText"
              :value="item.optionId"
            ></NRadio>
          </NRadioGroup>
        </template>
        <template v-if="data.question.questionType === 2">
          <NCheckboxGroup v-model:value="data.select.multiple">
            <NCheckbox
              v-for="(item, key) in data.question.options"
              :key="key"
              :label="item.optionText"
              :value="item.optionId"
            ></NCheckbox>
          </NCheckboxGroup>
        </template>
        <template v-if="data.question.questionType === 3">
          <NRadioGroup v-model:value="data.select.truefalse">
            <NRadio label="√" value="1"></NRadio>
            <NRadio label="×" value="0"></NRadio>
          </NRadioGroup>
        </template>
        <template v-if="data.question.questionType === 4">
          <NInput v-model:value="data.select.fillblank" type="textarea"></NInput>
        </template>
      </div>
      <div class="mt-3 flex flex-row justify-end gap-2">
        <NButton @click="handleBackClick">上一题</NButton>
        <NButton type="info" @click="handleAnswer">确认（下一题）</NButton>
        <NButton type="success" @click="handleSucmit">交卷</NButton>
      </div>
    </NCard>
    <NCard class="col-span-2 rounded">
      <SheetList
        title="一、单选题"
        :options="data.sheet[0]"
        @select="handleSheetSelect"
      ></SheetList>
      <SheetList
        title="二、多选题"
        :options="data.sheet[1]"
        @select="handleSheetSelect"
      ></SheetList>
      <SheetList
        title="三、判断题"
        :options="data.sheet[2]"
        @select="handleSheetSelect"
      ></SheetList>
      <SheetList
        title="四、填空题"
        :options="data.sheet[3]"
        @select="handleSheetSelect"
      ></SheetList>
    </NCard>
  </div>
</template>

<style lang="scss" scoped></style>
