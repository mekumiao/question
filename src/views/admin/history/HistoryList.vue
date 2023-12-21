<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import { NIcon, NSelect } from 'naive-ui'
import { getMyAnswerHistories as fetchHistoryList } from '@/api/students'
import type { AnswerHistory } from '@/api/students'
import type { ExamPaperFilter } from '@/api/examPapers'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import { createColumns, createDifficultyLevelOptions } from './data'

const tableRef = ref<InstanceType<typeof NDataTable>>()

const loading = ref(false)
const model = ref<AnswerHistory[]>([])
const modelCache = ref<AnswerHistory[]>([])
const filter = reactive<ExamPaperFilter>({ difficultyLevel: 0 })

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
  // async remove(row) {
  //   await fetchExamDelete(row.examPaperId)
  //   await handlePageChange(pagination.page)
  // },
})

onMounted(async () => {
  await handlePageChange(1)
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      loading.value = true
      model.value = await fetchHistoryList()
      modelCache.value = model.value
      pagination.page = currentPage
    } finally {
      loading.value = false
    }
  }
}

async function handleSearch() {
  model.value = modelCache.value
    .filter((v) => (filter.difficultyLevel ? v.difficultyLevel === filter.difficultyLevel : true))
    .filter((v) => (filter.examPaperName ? v.examPaperName.includes(filter.examPaperName) : true))
}

async function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    await handleSearch()
  }
}
</script>

<template>
  <div class="history-list m-3">
    <div class="flex flex-row items-center justify-between pb-3">
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
          <NInputGroupLabel type="primary">搜索</NInputGroupLabel>
          <NInput v-model:value="filter.examPaperName" @keydown="handleEnter" />
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
      :pagination="pagination"
      :row-key="(row: AnswerHistory) => row.answerHistoryId"
      @update:page="handlePageChange"
    />
  </div>
</template>

<style lang="css" scoped></style>
