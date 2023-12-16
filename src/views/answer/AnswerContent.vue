<script setup lang="ts">
import SheetList from './SheetList.vue'
import { onMounted, reactive, ref } from 'vue'
import { get as fetchExam } from '@/api/exams'
import type { Exam, ExamQuestion } from '@/api/exams'
import type { AnswerOption } from './data'
import QuestionPanel from './QuestionPanel.vue'

const props = defineProps<{ examId: number }>()

const examCache = ref<Exam>()
const data = reactive<{
  question: ExamQuestion & { number?: number; answer?: AnswerOption['answer'] }
  sheet: AnswerOption[][]
}>({
  question: {} as ExamQuestion,
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
          questionType: v.questionType,
          options: v.options,
        }))
    }
    const first = data.sheet[0][0]
    const item = exam.examQuestions.find((v) => v.questionId === first.questionId)
    if (item) {
      data.question = { ...item, number: first.number }
    }
  }
}

function handleAnswer(answer: AnswerOption['answer']) {
  data.question.answer = answer
  const item = data.sheet[data.question.questionType - 1].find(
    (v) => v.questionId === data.question.questionId,
  )
  if (item) {
    item.answer = answer
  }
}

function handleSheetSelect(value: AnswerOption) {
  if (value.questionId !== data.question.questionId) {
    const question = examCache.value?.examQuestions.find((v) => v.questionId === value.questionId)
    if (question) {
      data.question = { ...question, number: value.number }
    }
  }
  data.question.answer = value.answer
}
</script>

<template>
  <div class="grid grid-cols-5 gap-2">
    <QuestionPanel :question="data.question" @answer="handleAnswer"></QuestionPanel>
    <div class="col-span-2 rounded bg-white p-3">
      <div class="mx-3">
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
