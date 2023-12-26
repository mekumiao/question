<script setup lang="tsx">
import type { ExaminationInput } from '@/api/examination'
import type { FormRules, DataTableColumns, DataTableRowKey } from 'naive-ui'
import { create as fetchCreate } from '@/api/examination'
import { list as fetchExamPaperList } from '@/api/examPapers'
import { NDataTable, NSpace, NTimePicker, NButtonGroup } from 'naive-ui'
import { NDrawer, NDrawerContent, NButton, NSpin, NInput, NInputNumber } from 'naive-ui'
import { useMessage, NRadioGroup, NRadio, NFormItem, NForm, NRate } from 'naive-ui'
import { NIcon, NSelect, NInputGroupLabel, NInputGroup } from 'naive-ui'
import { createDifficultyLevelOptions, createExaminationTypeOptions } from './data'
import { computed, reactive, ref, watch } from 'vue'
import { SearchOutline, RefreshOutline } from '@vicons/ionicons5'
import type { ExamPaper, ExamPaperFilter } from '@/api/examPapers'

const formRef = ref<InstanceType<typeof NForm>>()
const examPaperTableRef = ref<InstanceType<typeof NDataTable>>()

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const dataLoading = ref(false)
const data = reactive<{
  model: ExaminationInput
  examPapers: ExamPaper[]
}>({
  model: defaultModel(),
  examPapers: [],
})

const [, ...options] = createExaminationTypeOptions()
const examinationTypeOptions = ref(options)
const filter = reactive<ExamPaperFilter>({ difficultyLevel: 0 })
const difficultyLevelOptions = ref(createDifficultyLevelOptions())

const pagination = reactive({
  page: 1,
  pageSize: 5,
  itemCount: 0,
  // @ts-ignore
  prefix({ itemCount }) {
    return `Total: ${itemCount}`
  },
})

const durationSeconds = computed({
  get() {
    return data.model.durationSeconds * 1000 - 28800000
  },
  set(v) {
    data.model.durationSeconds = (v + 28800000) / 1000
  },
})

const checkedRowKeys = computed({
  get() {
    return [data.model.examPaperId]
  },
  set(v) {
    data.model.examPaperId = v[0]
  },
})

// 只加载一次
let isLoadExamPaperList = false
watch(active, (v) => {
  if (isLoadExamPaperList == false && v === true) {
    loadExamPaperList().then(() => {
      isLoadExamPaperList = true
    })
  }
})

let callback: VoidFunction

async function open(cb: VoidFunction) {
  callback = cb
  active.value = true
}

function defaultModel(): ExaminationInput {
  return {
    examinationName: '',
    examinationType: 1,
    difficultyLevel: 1,
    examPaperId: 0,
    durationSeconds: 1800,
    order: 0,
  }
}

function handleAfterLeave() {
  loading.value = false
  data.model = defaultModel()
}

async function handleSaveClick() {
  try {
    loading.value = true
    await formRef.value?.validate()
    await fetchCreate(data.model)
    message.success('创建成功')
    active.value = false
    callback?.()
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function loadExamPaperList() {
  checkedRowKeys.value = []
  await handlePageChange(1)
}

async function handlePageChange(currentPage: number) {
  if (dataLoading.value == true) return
  try {
    dataLoading.value = true
    const result = await fetchExamPaperList({
      offset: (currentPage - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      ...filter,
    })
    data.examPapers = result.items
    pagination.itemCount = result.total
    pagination.page = currentPage
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    dataLoading.value = false
  }
}

async function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    await loadExamPaperList()
  }
}

function handleChecked(v: DataTableRowKey[], rows: any) {
  if (!v.length) return
  const items = rows as ExamPaper[]
  data.model.examinationName = items[0].examPaperName
  data.model.difficultyLevel = items[0].difficultyLevel
}

defineExpose({ open })

const rules: FormRules = {
  examinationName: [
    {
      required: true,
      message: '请输入试卷名',
    },
    {
      max: 256,
      trigger: ['blur', 'input'],
      message: '最大长度为256',
    },
  ],
  difficultyLevel: [
    {
      required: true,
      message: '请选择难度',
    },
  ],
  examinationType: [
    {
      required: true,
      message: '请选择考试类型',
    },
  ],
  examPaperId: [
    {
      required: true,
      message: '请选择试卷',
      type: 'number',
      validator() {
        if (!data.model.examPaperId) {
          return new Error('请选择试卷')
        }
        return true
      },
    },
  ],
  durationSeconds: [
    {
      required: true,
      type: 'number',
      min: 1,
      message: '请设置考试时间',
    },
  ],
}

const columns: DataTableColumns<ExamPaper> = [
  {
    type: 'selection',
    multiple: false,
  },
  {
    title: 'ID',
    key: 'examPaperId',
  },
  {
    title: '试卷',
    key: 'examPaperName',
  },
  {
    title: '难度',
    key: 'difficultyLevel',
    render(row) {
      return <NRate readonly size="small" value={row.difficultyLevel} count={3}></NRate>
    },
  },
]
</script>

<template>
  <NDrawer v-model:show="active" width="60%" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>创建考试</template>
      <NSpin :show="loading">
        <NForm ref="formRef" :rules="rules" :model="data.model">
          <NFormItem label="排序 (值越大越靠前)" path="order">
            <NInputNumber v-model:value="data.model.order" placeholder="请输入排序"></NInputNumber>
          </NFormItem>
          <NFormItem label="考试类型" path="examinationType">
            <NRadioGroup class="pb-4" v-model:value="data.model.examinationType">
              <NRadio v-for="(item, key) in examinationTypeOptions" :value="item.value" :key="key">
                {{ item.label }}
              </NRadio>
            </NRadioGroup>
          </NFormItem>
          <NFormItem label="考试时间" path="durationSeconds">
            <NTimePicker
              v-model:value="durationSeconds"
              :hours="[0, 1, 2, 3]"
              :minutes="[0, 30]"
              :seconds="[0, 30]"
            />
          </NFormItem>
          <NFormItem label="难度" path="difficultyLevel">
            <NRate v-model:value="data.model.difficultyLevel" :count="3"></NRate>
          </NFormItem>
          <NFormItem label="考试名称" path="examinationName">
            <NInput v-model:value="data.model.examinationName" placeholder="请输入名称"></NInput>
          </NFormItem>
          <NFormItem label="选择试卷" path="examPaperId">
            <NSpace vertical class="w-full">
              <div class="flex flex-row items-center justify-between pb-3">
                <div class="flex flex-row items-center justify-start space-x-8">
                  <NInputGroup>
                    <NInputGroupLabel type="primary">难度</NInputGroupLabel>
                    <NSelect
                      v-model:value="filter.difficultyLevel"
                      :options="difficultyLevelOptions"
                      @update:value="loadExamPaperList"
                    ></NSelect>
                  </NInputGroup>
                  <NInputGroup>
                    <NInputGroupLabel type="primary">搜索试卷</NInputGroupLabel>
                    <NInput v-model:value="filter.examPaperName" @keydown="handleEnter" />
                    <NButton type="info" @click="loadExamPaperList">
                      <NIcon><SearchOutline></SearchOutline></NIcon>
                    </NButton>
                  </NInputGroup>
                </div>
                <div class="flex flex-row justify-end space-x-4">
                  <NButtonGroup size="small">
                    <NButton type="default" circle @click="loadExamPaperList">
                      <NIcon><RefreshOutline></RefreshOutline></NIcon>
                    </NButton>
                  </NButtonGroup>
                </div>
              </div>
              <NDataTable
                remote
                ref="examPaperTableRef"
                v-model:checked-row-keys="checkedRowKeys"
                :loading="dataLoading"
                :columns="columns"
                :data="data.examPapers"
                :row-key="(row: ExamPaper) => row.examPaperId"
                :pagination="pagination"
                @update:page="handlePageChange"
                @update:checked-row-keys="handleChecked"
              ></NDataTable>
            </NSpace>
          </NFormItem>
        </NForm>
      </NSpin>
      <template #footer>
        <NButton :loading="loading" type="primary" @click="handleSaveClick">保存</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
