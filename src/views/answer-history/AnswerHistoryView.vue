<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { NDataTable, NInput, NButton, NButtonGroup, NSpace, NTime } from 'naive-ui'
import { NIcon, NSelect, NInputGroup, NInputGroupLabel, NRate, NPopconfirm, NTag } from 'naive-ui'
import { meAnswerHistory as fetchHistoryList } from '@/api/students'
import type { AnswerHistory } from '@/api/students'
import type { ExamPaperFilter } from '@/api/examPapers'
import type { DataTableColumns } from 'naive-ui'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'

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

const difficultyLevelOptions = ref([
  {
    label: '全部',
    value: 0,
  },
  {
    label: '简单',
    value: 1,
  },
  {
    label: '中等',
    value: 2,
  },
  {
    label: '困难',
    value: 3,
  },
])

const columns: DataTableColumns<AnswerHistory> = [
  {
    title: 'ID',
    key: 'examPaperId',
    width: 80,
  },
  {
    title: '试卷名称',
    key: 'examPaperName',
  },
  {
    title: '难度',
    key: 'difficultyLevel',
    render(row) {
      return <NRate readonly size="small" value={row.difficultyLevel} count={3}></NRate>
    },
  },

  {
    title: '作答时间',
    key: 'difficultyLevel',
    render(row) {
      return (
        <NSpace>
          {{
            default: () => {
              const min = new Date(2023)
              const start = new Date(row.startTime)
              const end = new Date(row.submissionTime)
              return (
                <>
                  {start > min ? <NTime time={start}></NTime> : '--'}
                  <span>至</span>
                  {end > min ? <NTime time={end}></NTime> : '--'}
                </>
              )
            },
          }}
        </NSpace>
      )
    },
  },
  {
    title: '已交卷',
    key: 'difficultyLevel',
    render(row) {
      return (
        <NTag size="small" type={row.isSubmission ? 'success' : 'error'}>
          {row.isSubmission ? '是' : '否'}
        </NTag>
      )
    },
  },
  {
    title: '错题数',
    key: 'totalIncorrectAnswers',
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return (
        <NButtonGroup>
          <NButton type="primary" size="small" onClick={() => handleRedoIncorrectClick(row)}>
            错题重做
          </NButton>
          <NPopconfirm onPositiveClick={() => handleRemoveClick(row)}>
            {{
              trigger: () => (
                <NButton type="warning" size="small">
                  删除
                </NButton>
              ),
              default: () => `确定删除ID为 "${row.examPaperId}" 的试卷吗？`,
            }}
          </NPopconfirm>
        </NButtonGroup>
      )
    },
  },
]

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

function handleRedoIncorrectClick(item: AnswerHistory) {
  console.log(item)
}
function handleRemoveClick(item: AnswerHistory) {
  console.log(item)
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
          <NButton type="default" circle @click="handlePageChange(1)">
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