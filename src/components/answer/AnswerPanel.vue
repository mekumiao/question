<script setup lang="tsx">
import SheetList from './SheetList.vue'
import { nextTick, provide, reactive, ref, watch } from 'vue'
import { NRadio, NRadioGroup, NCheckbox, NCheckboxGroup, NInput, NButton, NRate } from 'naive-ui'
import { NCard, NScrollbar, NAlert, NIcon } from 'naive-ui'
import type { AnswerBoard, AnswerInput } from '@/api/answerBoard'
import type { AnswerBoardQuestionWithIndex } from './data'
import { BookmarksOutline } from '@vicons/ionicons5'

const props = withDefaults(defineProps<{ answerBoard: AnswerBoard; isEditable?: boolean }>(), {
  isEditable: true,
})
const textareaRef = ref<InstanceType<typeof NInput>>()

const data = reactive<{
  question: Omit<AnswerBoardQuestionWithIndex, 'index'>
  sheet: AnswerBoardQuestionWithIndex[][]
  select: {
    single: string
    multiple: string[]
    truefalse: string
    fillblank: string
  }
}>({
  question: {} as AnswerBoardQuestionWithIndex,
  sheet: [[], [], [], []],
  select: defaultSelect(),
})
const selected = ref<number>()

provide('selected', selected)

watch(
  () => props.answerBoard,
  (board) => {
    if (board.questions.length) {
      data.question = {} as Omit<AnswerBoardQuestionWithIndex, 'index'>
      fullSheet(board)
      const nextQuestion = nextAnswerOption([0, -1]) // 获取第一题
      nextQuestion && handleSheetSelect(nextQuestion) // 选中第一题
    }
  },
  { immediate: true },
)

function defaultSelect() {
  return {
    single: '',
    multiple: [],
    truefalse: '',
    fillblank: '',
  }
}

/**
 * 填充侧边答题卡
 * 目前仅有4种题型：单选、多选、判断、填空
 * @param answerBoard 答题板数据
 */
async function fullSheet(answerBoard: AnswerBoard) {
  let number = 0
  for (let i = 0; i < 4; i++) {
    data.sheet[i] = answerBoard.questions
      .filter((v) => v.questionType === i + 1)
      .map<AnswerBoardQuestionWithIndex>((v, n) => ({
        ...v,
        number: ++number,
        index: [i, n],
        isAnswer: false,
        answer: v.answerText ?? '',
      }))
  }
}

watch(
  () => data.question,
  (value) => {
    if (value.questionType === 1) {
      data.select = { ...defaultSelect(), single: value.answer }
    } else if (value.questionType === 2) {
      data.select = { ...defaultSelect(), multiple: value.answer.split('') }
    } else if (value.questionType === 3) {
      data.select = { ...defaultSelect(), truefalse: value.answer }
    } else if (value.questionType === 4) {
      data.select = { ...defaultSelect(), fillblank: value.answer }
    }
  },
  {
    immediate: true,
  },
)

function toAnswer() {
  const value = data.question
  if (value.questionType === 1) {
    return data.select.single
  } else if (value.questionType === 2) {
    return data.select.multiple.sort().join('')
  } else if (value.questionType === 3) {
    return data.select.truefalse
  } else if (value.questionType === 4) {
    return data.select.fillblank
  } else {
    return ''
  }
}

function handleAnswer() {
  const item = data.sheet[data.question.questionType - 1].find(
    (v) => v.questionId === data.question.questionId,
  )
  if (item) {
    const answer = toAnswer()
    if (answer) {
      item.answer = answer
      item.isAnswer = true
    }
    const nextQuestion = nextAnswerOption(item.index)
    nextQuestion && handleSheetSelect(nextQuestion)
  }
}

function handleBackClick() {
  const item = data.sheet[data.question.questionType - 1].find(
    (v) => v.questionId === data.question.questionId,
  )
  if (item) {
    const backQuestion = backAnswerOption(item.index)
    backQuestion && handleSheetSelect(backQuestion)
  }
}

function backAnswerOption([x, y]: [number, number]): AnswerBoardQuestionWithIndex | void {
  if (y > 0) {
    return data.sheet[x][y - 1]
  } else if (x > 0) {
    const len = data.sheet[x - 1].length
    return len > 0 ? data.sheet[x - 1][len - 1] : backAnswerOption([x - 1, 0])
  }
}

function nextAnswerOption([x, y]: [number, number]): AnswerBoardQuestionWithIndex | void {
  if (y + 1 < data.sheet[x].length) {
    return data.sheet[x][y + 1]
  } else if (x + 1 < data.sheet.length) {
    const item = data.sheet[x + 1]
    return item.length > 0 ? item[0] : nextAnswerOption([x + 1, 0])
  }
}

function handleSheetSelect(value: AnswerBoardQuestionWithIndex) {
  selected.value = value.questionId // 用于设置sheet的选中项
  if (value.questionId !== data.question.questionId) {
    const question = props.answerBoard.questions.find((v) => v.questionId === value.questionId)
    if (question) {
      data.question = {
        ...question,
        number: value.number,
        answer: value.answer,
        isAnswer: value.isAnswer,
        correctAnswer: value.correctAnswer,
      }
    }
  }
  // 填空题时，将textarea选中
  if (data.question.questionType === 4) {
    nextTick(() => {
      textareaRef.value?.focus()
    })
  }
}

function toAnswerInputs() {
  const answers = data.sheet.reduce((v, b) => v.concat(b), [])
  const inputAnswers = answers
    .filter((v) => v.isAnswer)
    .map<AnswerInput>((u) => ({
      questionId: u.questionId,
      answerText: u.answer,
    }))
  return inputAnswers
}

defineExpose({ toAnswerInputs })
</script>

<template>
  <div class="grid grid-cols-5 gap-2">
    <NCard class="col-span-3 flex flex-col justify-between rounded">
      <div class="xl:h-60">
        <h4 class="flex flex-row items-baseline justify-start">
          <span>{{ data.question.number }}.&nbsp;</span>
          <NScrollbar class="my-5 xl:max-h-56">
            {{ data.question.questionText }}
          </NScrollbar>
          <NRate readonly :value="data.question.difficultyLevel" :count="3"></NRate>
        </h4>
        <template v-if="data.question.questionType === 1">
          <NRadioGroup v-model:value="data.select.single" :disabled="!isEditable">
            <NRadio
              class="mx-2"
              v-for="(item, key) in data.question.options"
              :key="key"
              :value="item.optionCode"
            >
              <span>{{ item.optionCode }}</span>
              <span>.&nbsp;</span>
              <span>{{ item.optionText }}</span>
            </NRadio>
          </NRadioGroup>
        </template>
        <template v-if="data.question.questionType === 2">
          <NCheckboxGroup v-model:value="data.select.multiple" :disabled="!isEditable">
            <NCheckbox
              class="mx-2"
              v-for="(item, key) in data.question.options"
              :key="key"
              :value="item.optionCode"
            >
              <span>{{ item.optionCode }}</span>
              <span>.&nbsp;</span>
              <span>{{ item.optionText }}</span>
            </NCheckbox>
          </NCheckboxGroup>
        </template>
        <template v-if="data.question.questionType === 3">
          <NRadioGroup v-model:value="data.select.truefalse" :disabled="!isEditable">
            <NRadio label="√" value="1"></NRadio>
            <NRadio label="×" value="0"></NRadio>
          </NRadioGroup>
        </template>
        <template v-if="data.question.questionType === 4">
          <NInput
            ref="textareaRef"
            v-model:value="data.select.fillblank"
            :disabled="!isEditable"
            type="textarea"
          ></NInput>
        </template>
      </div>
      <NAlert v-if="answerBoard.isSubmission" title="标准答案" type="success">
        <template #icon>
          <NIcon><BookmarksOutline /></NIcon>
        </template>
        <span v-if="data.question.questionType === 3">{{
          data.question.correctAnswer === '0'
            ? '×'
            : data.question.correctAnswer === '1'
              ? '√'
              : data.question.correctAnswer
        }}</span>
        <span v-else>{{ data.question.correctAnswer }}</span>
      </NAlert>
      <div class="mt-3 flex flex-row justify-end gap-2">
        <NButton @click="handleBackClick">上一题</NButton>
        <NButton type="info" @click="handleAnswer">确认（下一题）</NButton>
      </div>
    </NCard>
    <NCard class="col-span-2 rounded">
      <template v-for="(item, key) in data.sheet">
        <SheetList
          v-if="item.length > 0"
          :title="['一、单选题', '二、多选题', '三、判断题', '四、填空题'][key]"
          :options="item"
          :key="key"
          @select="handleSheetSelect"
        ></SheetList>
      </template>
    </NCard>
  </div>
</template>

<style lang="scss" scoped></style>
