<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { NInputGroup, NInput, NInputGroupLabel, useMessage, useDialog } from 'naive-ui'
import { NDataTable, NButton, NButtonGroup, NIcon } from 'naive-ui'
import { RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { createStudentColumns } from './data'
import { list as fetchStudentList, resetSummary, deleteItem, deleteItems } from '@/api/students'
import type { Student, StudentFilter } from '@/api/students'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const message = useMessage()
const dialog = useDialog()

const loading = ref(false)
const model = ref<Student[]>([])
const filter = reactive<StudentFilter>({})
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
      const result = await fetchStudentList({
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
    title: '删除学生',
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
          await deleteItem(checkedRowKeys.value[0])
        } else {
          await deleteItems(checkedRowKeys.value)
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
      v-model:checked-row-keys="checkedRowKeys"
      :row-key="(row: Student) => row.studentId"
      @update:page="handlePageChange"
    />
  </div>
</template>

<style lang="css" scoped></style>
