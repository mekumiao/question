<script setup lang="tsx">
import { reactive, watch, ref } from 'vue'
import {
  NCard,
  NForm,
  NFormItemRow,
  NButtonGroup,
  NRate,
  useMessage,
  type FormRules,
} from 'naive-ui'
import { NRadio, NRadioGroup, NCheckbox, NCheckboxGroup, NInput, NButton } from 'naive-ui'
import type { ExamPaperUpdate, ExamPaper, ExamPaperQuestion } from '@/api/examPapers'
import { get as fetchExamPaper } from '@/api/examPapers'
import { update as fetchUpdateExamPaper } from '@/api/examPapers'

type ExamPaperQuestionWithIndex = ExamPaperQuestion & { index: number }

const props = defineProps<{ examPaperId: number }>()
const emit = defineEmits<{ saved: [paper: ExamPaper] }>()
const message = useMessage()
const loading = ref(false)
const examPaperCache = ref<ExamPaper>()
const model = reactive<{
  update: ExamPaperUpdate
  single: ExamPaperQuestionWithIndex[]
  multiple: (ExamPaperQuestionWithIndex & { correctAnswerList: string[] })[]
  truefalse: ExamPaperQuestionWithIndex[]
  fillblank: ExamPaperQuestionWithIndex[]
}>({
  update: {},
  single: [],
  multiple: [],
  truefalse: [],
  fillblank: [],
})

watch(
  () => props.examPaperId,
  (v) => {
    fullData(v)
  },
  {
    immediate: true,
  },
)

async function fullData(examPaperId: number) {
  const result = await fetchExamPaper(examPaperId)
  examPaperCache.value = result
  model.update = { examPaperName: result.examPaperName, difficultyLevel: result.difficultyLevel }
  let i = 1
  model.single = result.questions
    .filter((v) => v.questionType === 1)
    .map((v) => ({ ...v, index: i++ }))
  model.multiple = result.questions
    .filter((v) => v.questionType === 2)
    .map((v) => ({ ...v, index: i++, correctAnswerList: v.correctAnswer.split('') }))
  model.truefalse = result.questions
    .filter((v) => v.questionType === 3)
    .map((v) => ({ ...v, index: i++ }))
  model.fillblank = result.questions
    .filter((v) => v.questionType === 4)
    .map((v) => ({ ...v, index: i++ }))
}

async function handleSaveClick() {
  try {
    loading.value = true
    model.multiple.forEach((v) => (v.correctAnswer = v.correctAnswerList.join('')))
    model.update.questions = model.single
      .concat(model.multiple)
      .concat(model.truefalse)
      .concat(model.fillblank)
    const paper = await fetchUpdateExamPaper(props.examPaperId, model.update)
    examPaperCache.value = paper
    emit('saved', paper)
    message.success('保存成功')
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    loading.value = false
  }
}

const rules: FormRules = {
  examPaperName: [
    {
      required: true,
      message: '请输入试卷名称',
      trigger: ['input', 'blur'],
    },
    {
      type: 'string',
      max: 256,
      message: '最大支持256个字符',
      trigger: ['input', 'blur'],
    },
  ],
}
</script>

<template>
  <div v-if="!examPaperCache">加载中...</div>
  <div v-else class="grid grid-cols-5 gap-2">
    <NCard class="col-span-3">
      <!-- 单选题 -->
      <div class="p-2">
        <h3>一、单选题</h3>
        <div class="flex flex-col space-y-2">
          <NCard v-for="(item, key) in model.single" :key="key">
            <div class="py-2">
              <span>{{ item.index }}.&nbsp;{{ item.questionText }}</span>
            </div>
            <NRadioGroup class="space-x-5" v-model:value="item.correctAnswer">
              <NRadio v-for="(sub, key) in item.options" :key="key" :value="sub.optionCode">
                {{ sub.optionCode }}.&nbsp;{{ sub.optionText }}
              </NRadio>
            </NRadioGroup>
          </NCard>
        </div>
      </div>
      <!-- 多选题 -->
      <div class="p-2">
        <h3>二、多选题</h3>
        <div class="flex flex-col space-y-2">
          <NCard v-for="(item, key) in model.multiple" :key="key">
            <div class="py-2">
              <span>{{ item.index }}.&nbsp;{{ item.questionText }}</span>
            </div>
            <NCheckboxGroup class="space-x-5" v-model:value="item.correctAnswerList">
              <NCheckbox v-for="(sub, key) in item.options" :key="key" :value="sub.optionCode">
                {{ sub.optionCode }}.&nbsp;{{ sub.optionText }}
              </NCheckbox>
            </NCheckboxGroup>
          </NCard>
        </div>
      </div>
      <!-- 判断题 -->
      <div class="p-2">
        <h3>三、判断题</h3>
        <div class="flex flex-col space-y-2">
          <NCard v-for="(item, key) in model.truefalse" :key="key">
            <div class="py-2">
              <span>{{ item.index }}.&nbsp;{{ item.questionText }}</span>
            </div>
            <NRadioGroup class="space-x-5" v-model:value="item.correctAnswer">
              <NRadio value="1">对</NRadio>
              <NRadio value="0">错</NRadio>
            </NRadioGroup>
          </NCard>
        </div>
      </div>
      <!-- 填空题 -->
      <div class="p-2">
        <h3>四、填空题</h3>
        <div class="flex flex-col space-y-2">
          <NCard v-for="(item, key) in model.fillblank" :key="key">
            <div class="py-2">
              <span>{{ item.index }}.&nbsp;{{ item.questionText }}</span>
            </div>
            <NInput type="textarea" v-model:value="item.correctAnswer" />
          </NCard>
        </div>
      </div>
    </NCard>
    <NCard class="sticky top-0 z-10 col-span-2" style="height: 400px">
      <template #header>
        <NButtonGroup size="small">
          <NButton :loading="loading" type="primary" @click="handleSaveClick">保存</NButton>
        </NButtonGroup>
      </template>
      <NForm :rules="rules" :model="model.update">
        <NFormItemRow label="试卷名称" path="examPaperName">
          <NInput v-model:value="model.update.examPaperName"></NInput>
        </NFormItemRow>
        <NFormItemRow label="难度" ignore-path-change>
          <NRate v-model:value="model.update.difficultyLevel" :count="3"></NRate>
        </NFormItemRow>
      </NForm>
    </NCard>
  </div>
</template>

<style lang="scss" scoped></style>
