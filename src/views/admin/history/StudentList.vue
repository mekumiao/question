<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NInputGroup, NInput, NInputGroupLabel, useMessage } from 'naive-ui'
import { NDataTable, NButton, NButtonGroup, NIcon } from 'naive-ui'
import { RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { createStudentColumns } from './data'
import { list as fetchStudentList, count as fetchStudentCount, resetSummary } from '@/api/students'
import type { Student, StudentFilter } from '@/api/students'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const message = useMessage()

const loading = ref(false)
const model = ref<Student[]>([])
const filter = reactive<StudentFilter>({})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  // @ts-ignore
  prefix({ itemCount }) {
    return `Total: ${itemCount}`
  },
})

const columns = createStudentColumns({
  async reset(row) {
    try {
      await resetSummary(row.studentId)
      await handlePageChange(pagination.page)
      message.success('重置成功')
    } catch (error) {
      if (error instanceof Error) message.error(error.message)
      console.log(error)
    }
  },
})

onMounted(() => {
  handleSearch()
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      loading.value = true
      model.value = await fetchStudentList({
        ...filter,
        offset: (currentPage - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      })
      pagination.page = currentPage
    } finally {
      loading.value = false
    }
  }
}

async function handleSearch() {
  await Promise.all([
    handlePageChange(1),
    fetchStudentCount().then((v) => {
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
</script>

<template>
  <div class="history-list m-3">
    <div class="flex flex-row items-center justify-between pb-3">
      <div class="flex flex-row items-center justify-start space-x-8">
        <NInputGroup>
          <NInputGroupLabel type="primary">搜索用户</NInputGroupLabel>
          <NInput
            v-model:value="filter.studentNameOrUserId"
            @keydown="handleEnter"
            placeholder="请输入用户名或ID"
          />
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
      :row-key="(row: Student) => row.studentId"
      @update:page="handlePageChange"
    />
  </div>
</template>

<style lang="css" scoped></style>
