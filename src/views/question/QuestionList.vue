<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useMessage, NDataTable, NForm, NFormItem, NInput } from 'naive-ui'
import { list as fetchQuestionList, count as fetchQuestionCount } from '@/api/questions'
import type { Question } from '@/api/questions'
import { createColumns } from './data'

const tableRef = ref<InstanceType<typeof NDataTable>>()

const message = useMessage()
const loading = ref(false)
const data = ref<Question[]>([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 10,
  // @ts-ignore
  prefix({ itemCount }) {
    return `Total: ${itemCount}`
  },
})
const columns = createColumns({
  sendMail: (row) => {
    message.success(row.questionText)
  },
})

onMounted(async () => {
  pagination.itemCount = await fetchQuestionCount()
  data.value = await fetchQuestionList({ limit: pagination.pageSize })
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      loading.value = true
      data.value = await fetchQuestionList({
        offset: (currentPage - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      })
      pagination.page = currentPage
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <div class="question-list">
    <NForm>
      <NFormItem>
        <NInput></NInput>
      </NFormItem>
    </NForm>
    <NDataTable
      remote
      ref="tableRef"
      size="small"
      :loading="loading"
      :columns="columns"
      :data="data"
      :min-height="350"
      :max-height="350"
      :pagination="pagination"
      :row-key="(row: Question) => row.questionId"
      @update:page="handlePageChange"
    />
  </div>
</template>

<style lang="css" scoped></style>
