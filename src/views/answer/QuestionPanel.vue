<script setup lang="ts">
import type { ExamQuestion } from '@/api/exams'
import type { AnswerOption } from './data'
import { ref, watch } from 'vue'
import BtClock from '@/components/BtClock.vue'
import { NRadio, NRadioGroup, NCheckbox, NCheckboxGroup, NInput, NButton } from 'naive-ui'

const props = defineProps<{
  question: ExamQuestion & { number?: number; answer?: AnswerOption['answer'] }
}>()
const emit = defineEmits<{ answer: [value: AnswerOption['answer']] }>()

const data = ref<{
  single?: number
  multiple?: number[]
  truefalse?: string
  fillblank?: string
}>({})

watch(
  () => props.question,
  (value) => {
    if (value.questionType === 1) {
      data.value = { single: value.answer as number }
    } else if (value.questionType === 2) {
      data.value = { multiple: value.answer as number[] }
    } else if (value.questionType === 3) {
      data.value = { truefalse: value.answer as string }
    } else if (value.questionType === 4) {
      data.value = { fillblank: value.answer as string }
    }
  },
)

function handleAnswer() {
  const value = props.question
  if (value.questionType === 1) {
    emit('answer', data.value.single)
  } else if (value.questionType === 2) {
    emit('answer', data.value.multiple)
  } else if (value.questionType === 3) {
    emit('answer', data.value.truefalse)
  } else if (value.questionType === 4) {
    emit('answer', data.value.fillblank)
  }
}
</script>

<template>
  <div class="question-panel col-span-3 flex flex-col justify-between rounded bg-white p-3">
    <div class="mt-1">
      <BtClock></BtClock>
      <h4 class="my-5">{{ question.number }}.&nbsp;{{ question.questionText }}</h4>
      <template v-if="question.questionType === 1">
        <NRadioGroup v-model:value="data.single">
          <NRadio
            v-for="(item, key) in question.options"
            :key="key"
            :label="item.optionText"
            :value="item.optionId"
          ></NRadio>
        </NRadioGroup>
      </template>
      <template v-if="question.questionType === 2">
        <NCheckboxGroup v-model:value="data.multiple">
          <NCheckbox
            v-for="(item, key) in question.options"
            :key="key"
            :label="item.optionText"
            :value="item.optionId"
          ></NCheckbox>
        </NCheckboxGroup>
      </template>
      <template v-if="question.questionType === 3">
        <NRadioGroup v-model:value="data.truefalse">
          <NRadio label="√" value="1"></NRadio>
          <NRadio label="×" value="0"></NRadio>
        </NRadioGroup>
      </template>
      <template v-if="question.questionType === 4">
        <NInput v-model:value="data.fillblank" type="textarea"></NInput>
      </template>
    </div>
    <div class="mt-3 flex flex-row justify-end gap-2">
      <NButton>上一题</NButton>
      <NButton type="info" @click="handleAnswer">确认（下一题）</NButton>
      <NButton type="success">交卷</NButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activate {
  background-color: var(--color-theme);
}
</style>
