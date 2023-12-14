<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import { NIcon, NSelect } from 'naive-ui'
import {
  list as fetchQuestionList,
  count as fetchQuestionCount,
  remove as fetchQuestionDelete,
} from '@/api/questions'
import type { Question, QuestionFilter } from '@/api/questions'
import { SearchOutline } from '@vicons/ionicons5'

const tableRef = ref<InstanceType<typeof NDataTable>>()

const loading = ref(false)
const model = ref<Question[]>([])
const filter = reactive<QuestionFilter>({ questionType: -1 })

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
      handlePageChange(pagination.page)
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

async function handleSearch() {
  pagination.itemCount = await fetchQuestionCount(filter)
  await handlePageChange(1)
}

async function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    await handleSearch()
  }
}
</script>

<template>
  <div class="exam-list">
    <div
      class="flex flex-row items-center justify-between rounded border border-solid border-gray-400 p-3"
    >
      <div class="flex flex-row items-center justify-start space-x-8">
        <NInputGroup>
          <NInputGroupLabel type="primary">搜索题型</NInputGroupLabel>
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
      <div class="flex flex-row justify-end">
        <NButtonGroup size="small">
          <NButton type="primary">新建</NButton>
          <NButton type="warning">导入</NButton>
          <NButton type="info">导出</NButton>
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
      :min-height="350"
      :max-height="350"
      :pagination="pagination"
      :row-key="(row: Question) => row.questionId"
      @update:page="handlePageChange"
    />
    <QuestionEdit ref="editRef"></QuestionEdit>
    <QuestionDetail ref="detailRef"></QuestionDetail>
  </div>
</template>

<style lang="css" scoped></style>
