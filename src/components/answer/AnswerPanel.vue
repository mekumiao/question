<script setup lang="tsx">
import SheetList from './SheetList.vue'
import { nextTick, provide, reactive, ref, watch } from 'vue'
import type { AnswerOption } from './data'
import { NRadio, NRadioGroup, NCheckbox, NCheckboxGroup, NInput, NButton } from 'naive-ui'
import { NCard, NScrollbar } from 'naive-ui'
import type { AnswerInput } from '@/api/students'
import type { AnswerBoard, AnswerBoardQuestion } from '@/api/answerBoard'

type AnswerOptionWithIndex = AnswerOption & { index: [number, number] }

const props = withDefaults(defineProps<{ answerBoard: AnswerBoard; isEditable?: boolean }>(), {
  isEditable: true,
})
const textareaRef = ref<InstanceType<typeof NInput>>()

const data = reactive<{
  question: AnswerBoardQuestion & { number?: number; answer?: AnswerOption['answer'] }
  sheet: AnswerOptionWithIndex[][]
  select: {
    single?: number
    multiple?: number[]
    truefalse?: string
    fillblank?: string
  }
}>({
  question: {} as AnswerBoardQuestion,
  sheet: [[], [], [], []],
  select: {},
})
const selected = ref<number>()

provide('selected', selected)
fullData(props.answerBoard)

async function fullData(answerBoard: AnswerBoard) {
  if (answerBoard.questions.length) {
    // 目前仅有4种题型：单选、多选、判断、填空
    let number = 0
    for (let i = 0; i < 4; i++) {
      data.sheet[i] = answerBoard.questions
        .filter((v) => v.questionType === i + 1)
        .map<AnswerOptionWithIndex>((v, n) => ({
          number: ++number,
          questionId: v.questionId,
          questionType: v.questionType,
          options: v.options.map((n) => ({ ...n, isCorrect: false })),
          index: [i, n],
        }))
    }
    const first = data.sheet[0][0]
    const item = answerBoard.questions.find((v) => v.questionId === first.questionId)
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
    const question = props.answerBoard.questions.find((v) => v.questionId === value.questionId)
    if (question) {
      data.question = { ...question, number: value.number }
    }
  }
  data.question.answer = value.answer
  // 填空题时，将textarea选中
  if (data.question.questionType === 4) {
    nextTick(() => {
      textareaRef.value?.focus()
    })
  }
}

function toAnswerInputs() {
  function toAnswerText(answer: AnswerOption['answer']) {
    if (answer === null || answer === undefined) {
      return ''
    } else if (typeof answer === 'number') {
      return answer.toString()
    } else if (Array.isArray(answer)) {
      return answer.join('')
    } else {
      return ''
    }
  }

  const answers = data.sheet.reduce((v, b) => v.concat(b), [])
  const inputAnswers = answers.map<AnswerInput>((u) => ({
    questionId: u.questionId,
    answerText: toAnswerText(u.answer),
  }))
  return inputAnswers
}

defineExpose({ toAnswerInputs })
</script>

<template>
  <div class="grid grid-cols-5 gap-2">
    <NCard class="col-span-3 flex flex-col justify-between rounded">
      <div class="xl:h-80">
        <h4 class="flex flex-row items-baseline justify-start">
          <span>{{ data.question.number }}.&nbsp;</span>
          <NScrollbar class="my-5 xl:max-h-56">
            {{ data.question.questionText }}
          </NScrollbar>
        </h4>
        <template v-if="data.question.questionType === 1">
          <NRadioGroup v-model:value="data.select.single" :disabled="!isEditable">
            <NRadio
              v-for="(item, key) in data.question.options"
              :key="key"
              :label="item.optionText"
              :value="item.optionId"
            ></NRadio>
          </NRadioGroup>
        </template>
        <template v-if="data.question.questionType === 2">
          <NCheckboxGroup v-model:value="data.select.multiple" :disabled="!isEditable">
            <NCheckbox
              v-for="(item, key) in data.question.options"
              :key="key"
              :label="item.optionText"
              :value="item.optionId"
            ></NCheckbox>
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
      <div class="mt-3 flex flex-row justify-end gap-2">
        <NButton @click="handleBackClick">上一题</NButton>
        <NButton type="info" @click="handleAnswer">确认（下一题）</NButton>
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
