<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { NIcon, useMessage, useDialog } from 'naive-ui'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import { list as fetchUserList, update as fetchUpdate, deleteItem, deleteItems } from '@/api/users'
import type { User, UserFilter } from '@/api/users'
import { createColumns } from './data'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import UserEdit from './UserEdit.vue'
import UserCreate from './UserCreate.vue'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const editRef = ref<InstanceType<typeof UserEdit>>()
const createRef = ref<InstanceType<typeof UserCreate>>()

const dialog = useDialog()
const message = useMessage()

const loading = ref(false)
const model = ref<User[]>([])
const filter = reactive<UserFilter>({})
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

const columns = createColumns({
  edit(row) {
    editRef.value?.open(row.userId, () => {
      message.success('保存成功')
      handlePageChange(pagination.page)
    })
  },
  async lock(row, lockoutEnabled) {
    await fetchUpdate(row.userId, { lockoutEnabled })
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
      const result = await fetchUserList({
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
    handleSearch()
  })
}

async function handleDeleteItems() {
  if (!checkedRowKeys.value.length) {
    return message.warning('请至少选择一项')
  }
  const errorDetail = ref('')
  const d = dialog.warning({
    title: '删除用户',
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
  <div class="user-list m-3">
    <div class="flex flex-row items-center justify-between pb-3">
      <div class="flex flex-row items-center justify-start space-x-8">
        <NInputGroup>
          <NInputGroupLabel type="primary">名称</NInputGroupLabel>
          <NInput v-model:value="filter.nickName" @keydown="handleEnter" />
          <NButton type="info" @click="handleSearch">
            <NIcon><SearchOutline></SearchOutline></NIcon>
          </NButton>
        </NInputGroup>
        <NInputGroup>
          <NInputGroupLabel type="primary">账号</NInputGroupLabel>
          <NInput v-model:value="filter.userName" @keydown="handleEnter" />
          <NButton type="success" @click="handleSearch">
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
      :row-key="(row: User) => row.userId"
      v-model:checked-row-keys="checkedRowKeys"
      @update:page="handlePageChange"
    />
    <UserEdit ref="editRef"></UserEdit>
    <UserCreate ref="createRef"></UserCreate>
  </div>
</template>

<style lang="css" scoped></style>
