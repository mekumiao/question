<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NDataTable, NInput, NButton, NButtonGroup, NInputGroup, NInputGroupLabel } from 'naive-ui'
import { NIcon, useMessage } from 'naive-ui'
import { list as fetchUserList, count as fetchUserCount } from '@/api/users'
import type { User, UserFilter } from '@/api/users'
import { createColumns } from './data'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import UserEdit from './UserEdit.vue'
import UserCreate from './UserCreate.vue'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const editRef = ref<InstanceType<typeof UserEdit>>()
const createRef = ref<InstanceType<typeof UserCreate>>()

const message = useMessage()

const loading = ref(false)
const model = ref<User[]>([])
const filter = reactive<UserFilter>({})

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
})

onMounted(async () => {
  await handleSearch()
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      loading.value = true
      model.value = await fetchUserList({
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
  pagination.itemCount = await fetchUserCount(filter)
}

async function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    await handleSearch()
  }
}

async function handleCreate() {
  createRef.value?.open(() => {
    handlePageChange(pagination.page)
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
      @update:page="handlePageChange"
    />
    <UserEdit ref="editRef"></UserEdit>
    <UserCreate ref="createRef"></UserCreate>
  </div>
</template>

<style lang="css" scoped></style>
