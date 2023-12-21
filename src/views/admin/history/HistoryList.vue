<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NDataTable, NButton, NButtonGroup, NIcon } from 'naive-ui'
import { list as fetchHistoryList, count as fetchHistoryCount } from '@/api/answerHistory'
import type { AnswerHistory, AnswerHistoryFilter } from '@/api/answerHistory'
import { RefreshOutline } from '@vicons/ionicons5'
import { createColumns } from './data'

const tableRef = ref<InstanceType<typeof NDataTable>>()

const loading = ref(false)
const model = ref<AnswerHistory[]>([])
const modelCache = ref<AnswerHistory[]>([])
const filter = reactive<AnswerHistoryFilter>({})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  // @ts-ignore
  prefix({ itemCount }) {
    return `Total: ${itemCount}`
  },
})

// const difficultyLevelOptions = ref(createDifficultyLevelOptions())

const columns = createColumns({
  // show(row) {
  //   editRef.value?.open(row.questionId, () => {
  //     handlePageChange(pagination.page)
  //   })
  // },
})

onMounted(() => {
  handleSearch()
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      loading.value = true
      model.value = await fetchHistoryList({
        ...filter,
        offset: (currentPage - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      })
      modelCache.value = model.value
      pagination.page = currentPage
    } finally {
      loading.value = false
    }
  }
}

async function handleSearch() {
  await Promise.all([
    fetchHistoryCount().then((v) => {
      pagination.itemCount = v
      return v
    }),
    handlePageChange(1),
  ])
}

// async function handleEnter(e: KeyboardEvent) {
//   if (e.key === 'Enter') {
//     await handleSearch()
//   }
// }
</script>

<template>
  <div class="history-list m-3">
    <div class="flex flex-row items-center justify-between pb-3">
      <!-- <div class="flex flex-row items-center justify-start space-x-8">
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
      </div> -->
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
      :row-key="(row: AnswerHistory) => row.answerHistoryId"
      @update:page="handlePageChange"
    />
  </div>
</template>

<style lang="css" scoped></style>
