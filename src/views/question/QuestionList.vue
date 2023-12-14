<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NDataTable, NForm, NFormItem, NInput } from 'naive-ui'
import {
  list as fetchQuestionList,
  count as fetchQuestionCount,
  remove as fetchQuestionDelete,
} from '@/api/questions'
import type { Question } from '@/api/questions'
import { createColumns } from './data'
import QuestionEdit from './QuestionEdit.vue'

const tableRef = ref<InstanceType<typeof NDataTable>>()
const editRef = ref<InstanceType<typeof QuestionEdit>>()

const loading = ref(false)
const model = ref<Question[]>([])
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
    editRef.value?.open(row.questionId, () => {
      handlePageChange(pagination.page)
    })
  },
  async remove(row) {
    await fetchQuestionDelete(row.questionId)
    await handlePageChange(pagination.page)
  },
})

onMounted(async () => {
  pagination.itemCount = await fetchQuestionCount()
  await handlePageChange(1)
})

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    try {
      loading.value = true
      model.value = await fetchQuestionList({
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
      :data="model"
      :min-height="350"
      :max-height="350"
      :pagination="pagination"
      :row-key="(row: Question) => row.questionId"
      @update:page="handlePageChange"
    />
  </div>
  <QuestionEdit ref="editRef"></QuestionEdit>
</template>

<style lang="css" scoped></style>
