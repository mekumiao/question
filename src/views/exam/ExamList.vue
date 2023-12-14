<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import { NIcon, NSelect } from 'naive-ui'
import {
  list as fetchExamList,
  count as fetchExamCount,
  remove as fetchExamDelete,
} from '@/api/exams'
import type { Exam, ExamFilter } from '@/api/exams'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import { createColumns, createDifficultyLevelOptions } from './data'

const tableRef = ref<InstanceType<typeof NDataTable>>()

const loading = ref(false)
const model = ref<Exam[]>([])
const filter = reactive<ExamFilter>({ difficultyLevel: 0 })

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  // @ts-ignore
  prefix({ itemCount }) {
    return `Total: ${itemCount}`
  },
})

const difficultyLevelOptions = ref(createDifficultyLevelOptions())

const columns = createColumns({
  // edit(row) {
  //   editRef.value?.open(row.questionId, () => {
  //     handlePageChange(pagination.page)
  //   })
  // },
  async remove(row) {
    await fetchExamDelete(row.examId)
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
      model.value = await fetchExamList({
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
  await handlePageChange(1)
  pagination.itemCount = await fetchExamCount(filter)
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
          <NInputGroupLabel type="primary">难度</NInputGroupLabel>
          <NSelect
            v-model:value="filter.difficultyLevel"
            :options="difficultyLevelOptions"
            @update:value="handleSearch"
          ></NSelect>
        </NInputGroup>
        <NInputGroup>
          <NInputGroupLabel type="primary">搜索试卷</NInputGroupLabel>
          <NInput v-model:value="filter.examName" @keydown="handleEnter" />
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
      :row-key="(row: Exam) => row.examId"
      @update:page="handlePageChange"
    />
    <!-- <QuestionEdit ref="editRef"></QuestionEdit>
    <QuestionDetail ref="detailRef"></QuestionDetail> -->
  </div>
</template>

<style lang="css" scoped></style>
