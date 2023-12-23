<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NIcon, NSelect, useMessage, type DataTableRowKey, NModal, NRate } from 'naive-ui'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import {
  list as fetchExamList,
  count as fetchExamCount,
  remove as fetchExamDelete,
  exportToExcel,
  random as fetchRandemGenExam,
} from '@/api/examPapers'
import type { ExamPaper, ExamPaperFilter } from '@/api/examPapers'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import { createColumns, createDifficultyLevelOptions } from './data'
import ExamPaperImport from './ExamPaperImport.vue'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const importRef = ref<InstanceType<typeof ExamPaperImport>>()
const message = useMessage()

const loading = ref(false)
const exportLoading = ref(false)
const model = ref<ExamPaper[]>([])
const checkedRowKeys = ref<DataTableRowKey[]>([])
const filter = reactive<ExamPaperFilter>({ difficultyLevel: 0 })
const showRandom = ref(false)
const randomDifficultyLevel = ref(1)

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
    await fetchExamDelete(row.examPaperId)
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
      const items = await fetchExamList({
        offset: (currentPage - 1) * pagination.pageSize,
        limit: pagination.pageSize,
        ...filter,
      })
      model.value = items.map((v) => ({ ...v, checked: false }))
      pagination.page = currentPage
    } finally {
      loading.value = false
    }
  }
}

async function handleSearch() {
  checkedRowKeys.value = []
  await Promise.all([
    handlePageChange(1),
    fetchExamCount(filter).then((v) => {
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

function handleImportClick() {
  importRef.value?.open(() => {
    handleSearch()
  })
}

async function handleExportClick() {
  const items = checkedRowKeys.value
  if (items.length > 0) {
    const examPaper = model.value.find((v) => v.examPaperId == items[0])
    if (examPaper) {
      try {
        exportLoading.value = true
        await exportToExcel(examPaper.examPaperName, items as number[])
        message.success('导出成功')
      } catch (error) {
        if (error instanceof Error) message.error(error.message)
        console.error(error)
      } finally {
        exportLoading.value = false
      }
    } else {
      message.warning('数据错误，请刷新页面')
    }
  } else {
    message.warning('请至少选择一项')
  }
}

function handelRandomClick() {
  showRandom.value = true
}

async function handleRandomConfirmClick() {
  try {
    await fetchRandemGenExam({ difficultyLevel: randomDifficultyLevel.value })
    message.success('生成成功')
    await handleSearch()
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  }
}
</script>

<template>
  <div class="m-3">
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
          <NInputGroupLabel type="primary">搜索试卷</NInputGroupLabel>
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
          <NButton type="default" @click="handelRandomClick">随机生成</NButton>
        </NButtonGroup>
        <NButtonGroup size="small">
          <NButton type="warning" @click="handleImportClick">导入</NButton>
          <NButton type="info" :loading="exportLoading" @click="handleExportClick">导出</NButton>
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
      :row-key="(row: ExamPaper) => row.examPaperId"
      v-model:checked-row-keys="checkedRowKeys"
      @update:page="handlePageChange"
    />
    <ExamPaperImport ref="importRef"></ExamPaperImport>
    <!-- <QuestionDetail ref="detailRef"></QuestionDetail> -->
  </div>
  <NModal
    v-model:show="showRandom"
    preset="dialog"
    title="随机生成试卷"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleRandomConfirmClick"
  >
    <div class="m-10 flex w-full flex-row items-center justify-start gap-5">
      <div>试卷难度:</div>
      <NRate size="medium" v-model:value="randomDifficultyLevel" :count="3"></NRate>
    </div>
  </NModal>
</template>

<style lang="css" scoped></style>
