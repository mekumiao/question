<script setup lang="ts">
import BtClock from '@/components/BtClock.vue'
import SheetList from './SheetList.vue'
import { NButton } from 'naive-ui'
import { onMounted, reactive, ref } from 'vue'
import { get as fetchExam } from '@/api/exams'
import type { Exam, ExamQuestion } from '@/api/exams'
import type { AnswerOption } from './data'

const props = defineProps<{ examId: number }>()

const examCache = ref<Exam>()
const data = reactive<{
  queston: ExamQuestion & { number?: number; answer?: AnswerOption['answer'] }
  sheet: AnswerOption[][]
}>({
  queston: {} as ExamQuestion,
  sheet: [[], [], [], []],
})

onMounted(async () => {
  examCache.value = await fetchExam(props.examId)
  fullData(examCache.value)
})

function fullData(exam: Exam) {
  if (exam.examQuestions.length) {
    // 目前仅有4种题型：单选、多选、判断、填空
    for (let i = 0; i < 4; i++) {
      data.sheet[i] = exam.examQuestions
        .filter((v) => v.questionType === i + 1)
        .map<AnswerOption>((v, n) => ({
          number: n + 1,
          questionId: v.questionId,
          options: v.options,
        }))
    }
    const first = data.sheet[0][0]
    const item = exam.examQuestions.find((v) => v.questionId === first.questionId)
    if (item) {
      data.queston = { ...item, number: first.number }
    }
  }
}

function handleOptionsClick(answer: AnswerOption['answer']) {
  data.queston.answer = answer
  const item = data.sheet[data.queston.questionType - 1].find(
    (v) => v.number === data.queston.number,
  )
  if (item) {
    item.answer = answer
  }
}

function handleSheetSelect(value: AnswerOption) {
  if (value.questionId !== data.queston.questionId) {
    const question = examCache.value?.examQuestions.find((v) => v.questionId === value.questionId)
    if (question) {
      data.queston = { ...question, number: value.number }
    }
  }
  data.queston.answer = value.answer
}
</script>

<template>
  <div class="grid grid-cols-5 gap-2">
    <div class="col-span-3 flex flex-col justify-between rounded bg-white p-3">
      <div class="mt-1">
        <BtClock></BtClock>
        <h4 class="my-5">{{ data.queston.number }}.&nbsp;{{ data.queston.questionText }}</h4>
        <ul
          class="flex flex-row justify-around rounded border border-solid border-gray-400 p-3 text-start"
        >
          <li
            class="w-fit cursor-pointer rounded px-1"
            :class="{ 'activate text-white': data.queston.answer === item.optionId }"
            v-for="(item, key) in data.queston.options"
            :key="key"
            @click="handleOptionsClick(item.optionId)"
          >
            {{ item.optionCode }}.&nbsp;{{ item.optionText }}
          </li>
        </ul>
      </div>
      <div class="mt-3 flex flex-row justify-end gap-2">
        <NButton>上一题</NButton>
        <NButton type="info">下一题</NButton>
        <NButton type="success">交卷</NButton>
      </div>
    </div>
    <div class="col-span-2 rounded bg-white p-3">
      <div class="mx-3">
        <SheetList
          title="一、单选题"
          type="SingleChoice"
          :options="data.sheet[0]"
          @select="handleSheetSelect"
        ></SheetList>
        <SheetList
          title="二、多选题"
          type="MultipleChoice"
          :options="data.sheet[1]"
          @select="handleSheetSelect"
        ></SheetList>
        <SheetList
          title="三、判断题"
          type="TrueFalse"
          :options="data.sheet[2]"
          @select="handleSheetSelect"
        ></SheetList>
        <SheetList
          title="四、填空题"
          type="FillInTheBlank"
          :options="data.sheet[3]"
          @select="handleSheetSelect"
        ></SheetList>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activate {
  background-color: var(--color-theme);
}
</style>
