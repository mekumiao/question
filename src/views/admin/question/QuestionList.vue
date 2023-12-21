<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import { NIcon, NSelect, useMessage } from 'naive-ui'
import {
  list as fetchQuestionList,
  count as fetchQuestionCount,
  remove as fetchQuestionDelete,
} from '@/api/questions'
import type { Question, QuestionFilter } from '@/api/questions'
import { createColumns, createQuestionTypeOptions } from './data'
import QuestionEdit from './QuestionEdit.vue'
import QuestionCreate from './QuestionCreate.vue'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const editRef = ref<InstanceType<typeof QuestionEdit>>()
const createRef = ref<InstanceType<typeof QuestionCreate>>()

const message = useMessage()

const loading = ref(false)
const model = ref<Question[]>([])
const filter = reactive<QuestionFilter>({ questionType: 0 })

const questionTypeOptions = ref(createQuestionTypeOptions())

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  // @ts-ignore
  prefix({ itemCount }) {
    return `Total: ${itemCount}`
  },
})

const columns = createColumns({
  edit(row) {
    editRef.value?.open(row.questionId, () => {
      message.success('保存成功')
      handlePageChange(1)
    })
  },
  async remove(row) {
    await fetchQuestionDelete(row.questionId)
    await handlePageChange(pagination.page)
  },
})

onMounted(async () => {
  await handleSearch()
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      loading.value = true
      model.value = await fetchQuestionList({
        offset: (currentPage - 1) * pagination.pageSize,
        limit: pagination.pageSize,
        ...filter,
      })
      pagination.page = currentPage
    } finally {
      loading.value = false
    }
  }
}

function handleSearch() {
  return Promise.all([
    handlePageChange(1),
    fetchQuestionCount(filter).then((v) => {
      pagination.itemCount = v
      return v
    }),
  ])
}

async function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    await handleSearch()
  }
}

async function handleCreate() {
  createRef.value?.open(() => {
    message.success('保存成功')
    handlePageChange(1)
  })
}
</script>

<template>
  <div class="question-list m-3">
    <div class="flex flex-row items-center justify-between pb-3">
      <div class="flex flex-row items-center justify-start space-x-8">
        <NInputGroup>
          <NInputGroupLabel type="primary">题型</NInputGroupLabel>
          <NSelect
            v-model:value="filter.questionType"
            :options="questionTypeOptions"
            @update:value="handleSearch"
          ></NSelect>
        </NInputGroup>
        <NInputGroup>
          <NInputGroupLabel type="primary">搜索题目</NInputGroupLabel>
          <NInput v-model:value="filter.questionText" @keydown="handleEnter" />
          <NButton type="info" @click="handleSearch">
            <NIcon><SearchOutline></SearchOutline></NIcon>
          </NButton>
        </NInputGroup>
      </div>
      <div class="flex flex-row justify-end space-x-4">
        <NButtonGroup size="small">
          <NButton type="default" circle @click="handleSearch">
            <NIcon><RefreshOutline></RefreshOutline></NIcon>
          </NButton>
        </NButtonGroup>
        <NButtonGroup size="small">
          <NButton type="primary" @click="handleCreate">新建</NButton>
        </NButtonGroup>
      </div>
    </div>
    <NDataTable
      remote
      ref="tableRef"
      size="small"
      :loading="loading"
      :columns="columns"
      :data="model"
      :pagination="pagination"
      :row-key="(row: Question) => row.questionId"
      @update:page="handlePageChange"
    />
    <QuestionEdit ref="editRef"></QuestionEdit>
    <QuestionCreate ref="createRef"></QuestionCreate>
  </div>
</template>

<style lang="css" scoped></style>
