<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NIcon, NSelect, type DataTableRowKey } from 'naive-ui'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import type { Examination, ExaminationFilter } from '@/api/examination'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import { createColumns, createDifficultyLevelOptions } from './data'
import ExaminationCreate from './ExaminationCreate.vue'
import ExaminationEdit from './ExaminationEdit.vue'
import { list as fetchExaminationList, remove as fetchRemoveExamination } from '@/api/examination'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const createRef = ref<InstanceType<typeof ExaminationCreate>>()
const editRef = ref<InstanceType<typeof ExaminationEdit>>()

const loading = ref(false)
const model = ref<Examination[]>([])
const checkedRowKeys = ref<DataTableRowKey[]>([])
const filter = reactive<ExaminationFilter>({ difficultyLevel: 0 })

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
  edit(row) {
    editRef.value?.open(row.examinationId, () => {
      handlePageChange(pagination.page)
    })
  },
  async remove(row) {
    await fetchRemoveExamination(row.examinationId)
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
      const result = await fetchExaminationList({
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

function handleCreatedClick() {
  createRef.value?.open(() => {
    handleSearch()
  })
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
          <NInputGroupLabel type="primary">搜索考试</NInputGroupLabel>
          <NInput v-model:value="filter.examinationName" @keydown="handleEnter" />
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
          <NButton type="primary" @click="handleCreatedClick">新建</NButton>
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
      :row-key="(row: Examination) => row.examPaperId"
      v-model:checked-row-keys="checkedRowKeys"
      @update:page="handlePageChange"
    />
    <ExaminationCreate ref="createRef"></ExaminationCreate>
    <ExaminationEdit ref="editRef"></ExaminationEdit>
  </div>
</template>

<style lang="css" scoped></style>
