<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { NInputGroupLabel, NInputGroup, useMessage, useDialog, NAlert } from 'naive-ui'
import { NDataTable, NButton, NButtonGroup, NIcon, NInput, NSelect } from 'naive-ui'
import { list as fetchHistoryList } from '@/api/answerHistory'
import { deleteAnswerHistoryItem, deleteAnswerHistoryItems } from '@/api/answerHistory'
import type { AnswerHistory, AnswerHistoryFilter } from '@/api/answerHistory'
import { RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { createColumns, createDifficultyLevelOptions } from './data'
import { ValidationProblemError } from '@/api/base'

const props = defineProps<{
  studentId?: number
  studentName?: string
  examinationId?: number
  examinationName?: string
}>()
const tableRef = ref<InstanceType<typeof NDataTable>>()
const message = useMessage()
const dialog = useDialog()

const loading = ref(false)
const model = ref<AnswerHistory[]>([])
const filter = reactive<AnswerHistoryFilter>({
  studentId: props.studentId,
  examinationId: props.examinationId,
  difficultyLevel: 0,
})
const checkedRowKeys = ref<number[]>([])

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

const columns = createColumns()

onMounted(() => {
  handleSearch()
})

async function handlePageChange(currentPage: number) {
  try {
    loading.value = true
    const result = await fetchHistoryList({
      ...filter,
      offset: (currentPage - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    })
    model.value = result.items
    pagination.itemCount = result.total
    pagination.page = currentPage
  } finally {
    loading.value = false
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

async function handleDeleteItems() {
  if (!checkedRowKeys.value.length) {
    return message.warning('请至少选择一项')
  }
  const errorDetail = ref('')
  const d = dialog.warning({
    title: '删除记录',
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
          await deleteAnswerHistoryItem(checkedRowKeys.value[0])
        } else {
          await deleteAnswerHistoryItems(checkedRowKeys.value)
        }
        checkedRowKeys.value = []
        await handlePageChange(pagination.page)
      } catch (error) {
        console.error(error)
        if (error instanceof ValidationProblemError) {
          errorDetail.value = error.message
          return false
        }
      } finally {
        d.loading = false
      }
    },
  })
}
</script>

<template>
  <div class="m-3 flex flex-col space-y-2">
    <div><NButton size="small" type="info" @click="() => $router.back()">返回上一级</NButton></div>
    <NAlert title="答题记录详细" type="info" :bordered="false">
      <ul class="flex flex-row space-x-2">
        <li v-if="studentName">
          <span>学生名称:&nbsp;</span>
          <span class="font-bold">{{ studentName }}</span>
        </li>
        <li v-if="examinationName">
          <span>考试名称:&nbsp;</span>
          <span class="font-bold">{{ examinationName }}</span>
        </li>
      </ul>
    </NAlert>
    <div class="grid grid-cols-8 gap-2">
      <NInputGroup class="col-span-2">
        <NInputGroupLabel type="primary">难度</NInputGroupLabel>
        <NSelect
          v-model:value="filter.difficultyLevel"
          :options="difficultyLevelOptions"
          @update:value="handleSearch"
        ></NSelect>
      </NInputGroup>
      <NInputGroup class="col-span-3">
        <NInputGroupLabel type="primary">搜索试卷</NInputGroupLabel>
        <NInput v-model:value="filter.examPaperName" @keydown="handleEnter" />
        <NButton type="info" @click="handleSearch">
          <NIcon><SearchOutline></SearchOutline></NIcon>
        </NButton>
      </NInputGroup>
      <div class="col-span-3 flex flex-row items-center justify-end gap-2">
        <NButtonGroup size="small">
          <NButton type="default" circle @click="handleSearch">
            <NIcon><RefreshOutline></RefreshOutline></NIcon>
          </NButton>
        </NButtonGroup>
        <NButtonGroup size="small">
          <NButton type="warning" @click="handleDeleteItems">删除选中项</NButton>
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
      v-model:checked-row-keys="checkedRowKeys"
      @update:page="handlePageChange"
    />
  </div>
</template>

<style lang="css" scoped></style>
