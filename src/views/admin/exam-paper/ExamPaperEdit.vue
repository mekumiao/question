<script setup lang="tsx">
import { reactive, watch, ref } from 'vue'
import type { FormRules } from 'naive-ui'
import { NDrawer, NSpace, NDrawerContent, NDataTable, NTag } from 'naive-ui'
import { NSelect, NInputGroupLabel, NInputGroup, NIcon } from 'naive-ui'
import { NCard, NForm, NFormItemRow, NButtonGroup, NRate, useMessage } from 'naive-ui'
import { NRadio, NRadioGroup, NCheckbox, NCheckboxGroup, NInput, NButton } from 'naive-ui'
import type { ExamPaperUpdate, ExamPaper, ExamPaperQuestion } from '@/api/examPapers'
import { get as fetchExamPaper } from '@/api/examPapers'
import { update as fetchUpdateExamPaper } from '@/api/examPapers'
import type { Question, QuestionFilter } from '@/api/questions'
import { createQuestionColumns } from './data'
import { createDifficultyLevelOptions, createQuestionTypeOptions } from './data'
import { list as fetchQuestionList } from '@/api/questions'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import { VueDraggable } from 'vue-draggable-plus'

type ExamPaperQuestionWithIndex = ExamPaperQuestion & { index: number }

const props = defineProps<{ examPaperId: number }>()
const emit = defineEmits<{ saved: [paper: ExamPaper] }>()
const message = useMessage()
const loading = ref(false)
const tableLoading = ref(false)
const activeDrawer = ref(false)
const examPaper = ref<ExamPaper>()
const filter = reactive<QuestionFilter>({ questionType: 0, difficultyLevel: 0 })
const model = reactive<{
  update: ExamPaperUpdate
  questionOrders: Record<number, number>
  single: ExamPaperQuestionWithIndex[]
  multiple: (ExamPaperQuestionWithIndex & { correctAnswerList: string[] })[]
  truefalse: ExamPaperQuestionWithIndex[]
  fillblank: ExamPaperQuestionWithIndex[]
}>({
  update: {},
  questionOrders: {},
  single: [],
  multiple: [],
  truefalse: [],
  fillblank: [],
})
const questionTableData = ref<Question[]>([])
const checkedRowKeys = ref<number[]>([])
// const checkedRowKeys = computed<number[]>({
//   get() {
//     // return examPaper.value?.questions.map((v) => v.questionId) ?? []
//     return model.single
//       .concat(model.multiple)
//       .concat(model.truefalse)
//       .concat(model.fillblank)
//       .map((v) => v.questionId)
//   },
//   set(v) {
//     if (examPaper.value) {
//       const questions = questionTableData.value.filter((b) => v.includes(b.questionId))
//       fullQuestionList(examPaper.value.examPaperId, questions)
//     }
//   },
// })

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  // @ts-ignore
  prefix({ itemCount }) {
    return `Total: ${itemCount}`
  },
})

const columns = createQuestionColumns()
const questionTypeOptions = ref(createQuestionTypeOptions())
const difficultyLevelOptions = ref(createDifficultyLevelOptions())

watch(
  () => props.examPaperId,
  (v) => {
    fullExamPaperData(v)
  },
  {
    immediate: true,
  },
)

async function fullExamPaperData(examPaperId: number) {
  const result = await fetchExamPaper(examPaperId)
  examPaper.value = result
  model.update = { examPaperName: result.examPaperName, difficultyLevel: result.difficultyLevel }
  appendToModelQuestionList(result.examPaperId, result.questions)
}

function appendToModelQuestionList(
  examPaperId: number,
  questions: (ExamPaperQuestion | Question)[],
) {
  questions.forEach((item) => {
    // 保存题目排序
    if ('order' in item) {
      model.questionOrders[item.questionId] = item.order
    } else {
      model.questionOrders[item.questionId] = 0
    }
  })

  let i = 1
  model.single.push(
    ...questions
      .filter((v) => v.questionType === 1)
      .map((v) => ({
        ...v,
        index: i++,
        examPaperId,
        order: model.questionOrders[v.questionId] ?? 0,
      })),
  )
  model.multiple.push(
    ...questions
      .filter((v) => v.questionType === 2)
      .map((v) => ({
        ...v,
        index: i++,
        correctAnswerList: v.correctAnswer.split(''),
        examPaperId,
        order: model.questionOrders[v.questionId] ?? 0,
      })),
  )
  model.truefalse.push(
    ...questions
      .filter((v) => v.questionType === 3)
      .map((v) => ({
        ...v,
        index: i++,
        examPaperId,
        order: model.questionOrders[v.questionId] ?? 0,
      })),
  )
  model.fillblank.push(
    ...questions
      .filter((v) => v.questionType === 4)
      .map((v) => ({
        ...v,
        index: i++,
        examPaperId,
        order: model.questionOrders[v.questionId] ?? 0,
      })),
  )
}

function getQuestionsAndSetOrder() {
  const items = model.single.concat(model.multiple).concat(model.truefalse).concat(model.fillblank)
  items.forEach((item, i) => {
    item.index = i + 1
    item.order = i + 1
  })
  return items
}

async function handleSaveClick() {
  try {
    loading.value = true
    model.multiple.forEach((v) => (v.correctAnswer = v.correctAnswerList.join('')))
    model.update.questions = getQuestionsAndSetOrder()
    const paper = await fetchUpdateExamPaper(props.examPaperId, model.update)
    examPaper.value = paper
    emit('saved', paper)
    message.success('保存成功')
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handlePageChange(page: number) {
  try {
    tableLoading.value = true
    const result = await fetchQuestionList({
      ...filter,
      offset: (page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    })
    questionTableData.value = result.items
    pagination.itemCount = result.total
    pagination.page = page
  } catch (error) {
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}

function handleAppendItems() {
  if (examPaper.value) {
    const examPaperId = examPaper.value.examPaperId
    const questions = questionTableData.value.filter(
      (v) =>
        checkedRowKeys.value.includes(v.questionId) &&
        v.questionId in model.questionOrders == false,
    )
    appendToModelQuestionList(examPaperId, questions)
  }
  checkedRowKeys.value = []
}

async function handleSearch() {
  checkedRowKeys.value = []
  await handlePageChange(1)
}

async function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    await handleSearch()
  }
}

function handleAppendQutesionsClick() {
  activeDrawer.value = true
  handleSearch()
}

function handleQuestionClose(question: ExamPaperQuestionWithIndex) {
  function removeFromQuestions(items: ExamPaperQuestionWithIndex[]) {
    const i = items.findIndex((v) => v.questionId == question.questionId)
    items.splice(i, 1)
    delete model.questionOrders[question.questionId]
  }

  if (question.questionType === 1) {
    removeFromQuestions(model.single)
  } else if (question.questionType === 2) {
    removeFromQuestions(model.multiple)
  } else if (question.questionType === 3) {
    removeFromQuestions(model.truefalse)
  } else if (question.questionType === 4) {
    removeFromQuestions(model.fillblank)
  }

  getQuestionsAndSetOrder()
}

function handleOrderUpdate() {
  getQuestionsAndSetOrder()
}

async function handleCopyText(text: number | string) {
  await navigator.clipboard.writeText(`${text}`)
  message.success('复制成功')
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
  <div v-if="!examPaper">加载中...</div>
  <div v-else class="grid grid-cols-5 gap-2">
    <NCard class="col-span-3">
      <!-- 单选题 -->
      <div class="p-2">
        <h3 class="py-2">一、单选题</h3>
        <VueDraggable
          v-model="model.single"
          ghostClass="shadow-xl"
          :animation="150"
          class="flex flex-col space-y-2"
        >
          <NCard
            v-for="(item, key) in model.single"
            :key="key"
            :title="`${item.index}. ${item.questionText}`"
            closable
            @close="handleQuestionClose(item)"
          >
            <!-- <div class="py-2">
              <span>{{ item.index }}.&nbsp;{{ item.questionText }}</span>
            </div> -->
            <NRadioGroup class="space-x-5" v-model:value="item.correctAnswer">
              <NRadio v-for="(sub, key) in item.options" :key="key" :value="sub.optionCode">
                {{ sub.optionCode }}.&nbsp;{{ sub.optionText }}
              </NRadio>
            </NRadioGroup>
            <div>
              <NTag size="small" type="info" class="mt-4" @click="handleCopyText(item.questionId)">
                ID:&nbsp;{{ item.questionId }}
              </NTag>
            </div>
          </NCard>
        </VueDraggable>
      </div>
      <!-- 多选题 -->
      <div class="p-2">
        <h3 class="py-2">二、多选题</h3>
        <VueDraggable
          v-model="model.multiple"
          ghostClass="shadow-xl"
          :animation="150"
          class="flex flex-col space-y-2"
        >
          <NCard
            v-for="(item, key) in model.multiple"
            :key="key"
            :title="`${item.index}. ${item.questionText}`"
            closable
            @close="handleQuestionClose(item)"
          >
            <!-- <div class="py-2">
              <span>{{ item.index }}.&nbsp;{{ item.questionText }}</span>
            </div> -->
            <NCheckboxGroup class="space-x-5" v-model:value="item.correctAnswerList">
              <NCheckbox v-for="(sub, key) in item.options" :key="key" :value="sub.optionCode">
                {{ sub.optionCode }}.&nbsp;{{ sub.optionText }}
              </NCheckbox>
            </NCheckboxGroup>
            <NTag size="small" type="info" class="mt-4" @click="handleCopyText(item.questionId)">
              ID:&nbsp;{{ item.questionId }}
            </NTag>
          </NCard>
        </VueDraggable>
      </div>
      <!-- 判断题 -->
      <div class="p-2">
        <h3 class="py-2">三、判断题</h3>
        <VueDraggable
          v-model="model.truefalse"
          ghostClass="shadow-xl"
          :animation="150"
          class="flex flex-col space-y-2"
          @update="handleOrderUpdate"
        >
          <NCard
            v-for="(item, key) in model.truefalse"
            :key="key"
            :title="`${item.index}. ${item.questionText}`"
            closable
            @close="handleQuestionClose(item)"
          >
            <!-- <div class="py-2">
              <span>{{ item.index }}.&nbsp;{{ item.questionText }}</span>
            </div> -->
            <NRadioGroup class="space-x-5" v-model:value="item.correctAnswer">
              <NRadio value="1">对</NRadio>
              <NRadio value="0">错</NRadio>
            </NRadioGroup>
            <div>
              <NTag size="small" type="info" class="mt-4" @click="handleCopyText(item.questionId)">
                ID:&nbsp;{{ item.questionId }}
              </NTag>
            </div>
          </NCard>
        </VueDraggable>
      </div>
      <!-- 填空题 -->
      <div class="p-2">
        <h3 class="py-2">四、填空题</h3>
        <VueDraggable
          v-model="model.fillblank"
          ghostClass="shadow-xl"
          :animation="150"
          class="flex flex-col space-y-2"
        >
          <NCard
            v-for="(item, key) in model.fillblank"
            :key="key"
            :title="`${item.index}. ${item.questionText}`"
            closable
            @close="handleQuestionClose(item)"
          >
            <!-- <div class="py-2">
              <span>{{ item.index }}.&nbsp;{{ item.questionText }}</span>
            </div> -->
            <NInput type="textarea" v-model:value="item.correctAnswer" />
            <NTag size="small" type="info" class="mt-4" @click="handleCopyText(item.questionId)">
              ID:&nbsp;{{ item.questionId }}
            </NTag>
          </NCard>
        </VueDraggable>
      </div>
    </NCard>
    <NCard class="sticky top-0 z-10 col-span-2" style="height: 400px">
      <template #header>
        <NButtonGroup size="small">
          <NSpace>
            <NButton :loading="loading" type="primary" @click="handleSaveClick">保存</NButton>
            <NButton type="info" @click="handleAppendQutesionsClick"> 添加题目 </NButton>
          </NSpace>
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
  <NDrawer v-model:show="activeDrawer" width="50%">
    <NDrawerContent title="选择题目" closable>
      <div class="grid grid-cols-2 items-center gap-2">
        <!-- <div class="flex flex-row items-center justify-start space-x-2"> -->
        <NInputGroup>
          <NInputGroupLabel type="primary">题型</NInputGroupLabel>
          <NSelect
            v-model:value="filter.questionType"
            :options="questionTypeOptions"
            @update:value="handleSearch"
          ></NSelect>
        </NInputGroup>
        <NInputGroup>
          <NInputGroupLabel type="primary">难度</NInputGroupLabel>
          <NSelect
            v-model:value="filter.difficultyLevel"
            :options="difficultyLevelOptions"
            @update:value="handleSearch"
          ></NSelect>
        </NInputGroup>
        <NInputGroup>
          <NInputGroupLabel type="primary">题目</NInputGroupLabel>
          <NInput v-model:value="filter.questionText" @keydown="handleEnter" />
          <NButton type="info" @click="handleSearch">
            <NIcon><SearchOutline></SearchOutline></NIcon>
          </NButton>
        </NInputGroup>
      </div>

      <div class="my-2 flex flex-row justify-end">
        <NButtonGroup size="small">
          <NSpace>
            <NButton type="default" circle @click="handleSearch">
              <NIcon><RefreshOutline></RefreshOutline></NIcon>
            </NButton>
            <NButton type="primary" @click="handleAppendItems">添加选中项</NButton>
          </NSpace>
        </NButtonGroup>
      </div>

      <NDataTable
        remote
        ref="tableRef"
        size="small"
        :loading="tableLoading"
        :columns="columns"
        :data="questionTableData"
        :pagination="pagination"
        :row-key="(row: Question) => row.questionId"
        v-model:checked-row-keys="checkedRowKeys"
        @update:page="handlePageChange"
      />
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
