<script setup lang="tsx">
import { onActivated, reactive, ref } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { NDataTable, NInput, NButton, NButtonGroup, NSpace, NTime } from 'naive-ui'
import { NIcon, NSelect, NInputGroup, NInputGroupLabel, NRate, NTag } from 'naive-ui'
import { getMyAnswerHistories as fetchHistoryList } from '@/api/students'
import { deleteAnswerHistoryItems, deleteAnswerHistoryItem } from '@/api/students'
import type { AnswerHistory } from '@/api/answerHistory'
import type { ExamPaperFilter } from '@/api/examPapers'
import type { DataTableColumns } from 'naive-ui'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import { RouterLink, useRouter } from 'vue-router'
import { ValidationProblemError } from '@/api/base'
import { formatSeconds } from '@/utils'

const message = useMessage()
const dialog = useDialog()
const tableRef = ref<InstanceType<typeof NDataTable>>()
const router = useRouter()

const loading = ref(false)
const model = ref<AnswerHistory[]>([])
const modelCache = ref<AnswerHistory[]>([])
const filter = reactive<ExamPaperFilter>({ difficultyLevel: 0 })
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
    type: 'selection',
  },
  {
    title: 'ID',
    key: 'answerHistoryId',
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
              return (
                <>
                  <span>开始于</span>
                  {start > min ? <NTime time={start}></NTime> : '--'}
                  <span>耗时</span>
                  {row.isSubmission ? formatSeconds(row.timeTakenSeconds) : '--'}
                </>
              )
            },
          }}
        </NSpace>
      )
    },
  },
  {
    title: '类别',
    key: 'examinationType',
    render(row) {
      if (row.examinationType === 1) {
        return (
          <NTag size="small" type="success">
            考试
          </NTag>
        )
      } else if (row.examinationType === 2) {
        return (
          <NTag size="small" type="info">
            模拟
          </NTag>
        )
      } else {
        return (
          <NTag size="small" type="warning">
            练习
          </NTag>
        )
      }
    },
  },
  {
    title: '已交卷',
    key: 'isSubmission',
    render(row) {
      return row.isTimeout ? (
        <NTag size="small" type="error">
          超时
        </NTag>
      ) : (
        <NTag size="small" type={row.isSubmission ? 'success' : 'error'}>
          {row.isSubmission ? '是' : '否'}
        </NTag>
      )
    },
  },
  {
    title: '题总数',
    key: 'totalQuestions',
  },
  {
    title: '作答数',
    key: 'totalNumberAnswers',
  },
  {
    title: '错题数',
    key: 'totalIncorrectAnswers',
  },
  {
    title: '操作',
    key: 'actions',
    align: 'right',
    render(row) {
      return (
        <NButtonGroup>
          <NSpace>
            {row.isSubmission &&
              row.totalQuestions - row.totalNumberAnswers + row.totalIncorrectAnswers > 0 && (
                <NButton
                  type="primary"
                  size="small"
                  secondary
                  onClick={() => handleRedoIncorrectClick(row)}
                >
                  错题重做
                </NButton>
              )}
            <RouterLink to={`/student/answer-detail/${row.answerHistoryId}`}>
              <NButton ghost size="small" type="info">
                点击查看
              </NButton>
            </RouterLink>
          </NSpace>
        </NButtonGroup>
      )
    },
  },
]

onActivated(() => {
  handlePageChange(1)
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      checkedRowKeys.value = []
      loading.value = true
      const result = await fetchHistoryList({
        offset: (currentPage - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      })
      model.value = result.items
      modelCache.value = result.items
      pagination.itemCount = result.total
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

async function handleRedoIncorrectClick(item: AnswerHistory) {
  router.push({
    path: `/student/answer/redo-incorrect/`,
    query: { answerBoardId: item.answerHistoryId },
  })
}

function handleRemoveClick() {
  if (!checkedRowKeys.value.length) {
    return message.warning('请至少选择一项')
  }
  const errorDetail = ref('')
  const d = dialog.warning({
    title: '删除答题记录',
    content: () => (
      <div class="flex flex-col">
        <span>删除后无法恢复</span>
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
  <div class="history-list mx-2">
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
        <NButtonGroup size="small">
          <NButton type="warning" @click="handleRemoveClick">删除选中项</NButton>
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
