<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { useDialog } from 'naive-ui'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import { NIcon, NSelect, useMessage } from 'naive-ui'
import {
  list as fetchQuestionList,
  remove as fetchQuestionDelete,
  deleteQuestionItems,
  exportToExcel,
} from '@/api/questions'
import type { Question, QuestionFilter } from '@/api/questions'
import { createColumns, createDifficultyLevelOptions, createQuestionTypeOptions } from './data'
import QuestionEdit from './QuestionEdit2.vue'
import QuestionCreate from './QuestionCreate.vue'
import QuestionImport from './QuestionImport.vue'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import { getTimestamp } from '@/utils'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const editRef = ref<InstanceType<typeof QuestionEdit>>()
const createRef = ref<InstanceType<typeof QuestionCreate>>()
const importRef = ref<InstanceType<typeof QuestionImport>>()
const dialog = useDialog()
const message = useMessage()

const loading = ref(false)
const exportLoading = ref(false)
const model = ref<Question[]>([])
const filter = reactive<QuestionFilter>({ questionType: 0, difficultyLevel: 0 })
const checkedRowKeys = ref<number[]>([])

const questionTypeOptions = ref(createQuestionTypeOptions())
const difficultyLevelOptions = ref(createDifficultyLevelOptions())

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
      handlePageChange(pagination.page)
    })
  },
  async remove(row) {
    try {
      await fetchQuestionDelete(row.questionId)
      message.success('删除成功')
      await handlePageChange(pagination.page)
    } catch (error) {
      if (error instanceof Error) message.error(error.message)
      console.error(error)
    }
  },
})

onMounted(async () => {
  await handleSearch()
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      loading.value = true
      const result = await fetchQuestionList({
        offset: (currentPage - 1) * pagination.pageSize,
        limit: pagination.pageSize,
        ...filter,
      })
      model.value = result.items
      pagination.itemCount = result.total
      pagination.page = currentPage
    } finally {
      loading.value = false
    }
  }
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

async function handleCreate() {
  createRef.value?.open(() => {
    message.success('保存成功')
    handlePageChange(1)
  })
}

async function handleDeleteItems() {
  if (!checkedRowKeys.value.length) {
    return message.warning('请至少选择一项')
  }
  const errorDetail = ref('')
  const d = dialog.warning({
    title: '删除题目',
    content: () => (
      <div class="flex flex-col">
        <span>{`您选中了${checkedRowKeys.value.length}项，删除后无法恢复`}</span>
        <span class="text-red-500">{errorDetail.value}</span>
      </div>
    ),
    negativeText: '取消',
    positiveText: '确实',
    async onPositiveClick() {
      d.loading = true
      try {
        if (checkedRowKeys.value.length === 1) {
          await fetchQuestionDelete(checkedRowKeys.value[0])
        } else {
          await deleteQuestionItems(checkedRowKeys.value)
        }
        checkedRowKeys.value = []
        await handlePageChange(pagination.page)
      } catch (error) {
        console.error(error)
        if (error instanceof Error) {
          errorDetail.value = error.message
          return false
        }
      } finally {
        d.loading = false
      }
    },
  })
}

function handleImportClick() {
  importRef.value?.open(() => {
    handleSearch()
  })
}

async function handleExportClick() {
  const items = checkedRowKeys.value
  if (items.length > 0) {
    try {
      exportLoading.value = true
      await exportToExcel(`导出题目-${getTimestamp()}.xlsx`, items as number[])
      message.success('导出成功')
    } catch (error) {
      if (error instanceof Error) message.error(error.message)
      console.error(error)
    } finally {
      exportLoading.value = false
    }
  } else {
    message.warning('请至少选择一项')
  }
}
</script>

<template>
  <div class="question-list m-3">
    <div class="flex flex-row items-center justify-between space-x-8 pb-3">
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
        <NInput
          v-model:value="filter.questionTextOrId"
          @keydown="handleEnter"
          placeholder="题目或ID"
        />
        <NButton type="info" @click="handleSearch">
          <NIcon><SearchOutline></SearchOutline></NIcon>
        </NButton>
      </NInputGroup>
      <NButtonGroup size="small">
        <NButton type="default" circle @click="handleSearch">
          <NIcon><RefreshOutline></RefreshOutline></NIcon>
        </NButton>
      </NButtonGroup>
      <NButtonGroup size="small">
        <NButton type="primary" @click="handleCreate">新建</NButton>
        <NButton type="warning" @click="handleDeleteItems">删除选中项</NButton>
        <NButton type="info" @click="handleImportClick">导入</NButton>
        <NButton type="primary" :loading="exportLoading" @click="handleExportClick">导出</NButton>
      </NButtonGroup>
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
      v-model:checked-row-keys="checkedRowKeys"
      @update:page="handlePageChange"
    />
    <QuestionEdit ref="editRef"></QuestionEdit>
    <QuestionCreate ref="createRef"></QuestionCreate>
    <QuestionImport ref="importRef"></QuestionImport>
  </div>
</template>

<style lang="css" scoped></style>
