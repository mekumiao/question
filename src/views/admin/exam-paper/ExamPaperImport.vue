<script setup lang="ts">
import type { ImportExamPaperFromExcelInput } from '@/api/examPapers'
import { importFromExcel, exportToExcelTemplate } from '@/api/examPapers'
import { NUpload, type FormRules, type UploadFileInfo } from 'naive-ui'
import { NDrawer, NDrawerContent, NButton, NSpin, NInput } from 'naive-ui'
import { useMessage, NFormItem, NForm } from 'naive-ui'
import { ref } from 'vue'

const formRef = ref<InstanceType<typeof NForm>>()

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const downloadLoading = ref(false)
const model = ref<ImportExamPaperFromExcelInput>({ file: null! })

let callback: VoidFunction

async function open(cb: VoidFunction) {
  callback = cb
  active.value = true
}

function handleAfterLeave() {
  loading.value = false
  model.value = {} as ImportExamPaperFromExcelInput
}

function handleChange(options: { file: UploadFileInfo }) {
  const file = options.file.file
  if (file) {
    model.value.file = file
  }
}

async function handleSaveClick() {
  try {
    loading.value = true
    await formRef.value?.validate()
    await importFromExcel(model.value)
    callback()
    active.value = false
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handleDownloadTemplateClick() {
  try {
    downloadLoading.value = true
    await exportToExcelTemplate()
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    downloadLoading.value = false
  }
}

defineExpose({ open })

const rules: FormRules = {
  examPaperName: {
    trigger: ['blur', 'input'],
    message: '请输入题目',
    max: 256,
  },
  file: {
    required: true,
    message: '请选择文件',
  },
}
</script>

<template>
  <NDrawer v-model:show="active" :width="502" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>导入试卷</template>
      <NSpin :show="loading">
        <NForm ref="formRef" :rules="rules" :model="model">
          <NFormItem label="试卷名" path="examPaperName">
            <NInput v-model:value="model.examPaperName" placeholder="请输入试卷名"></NInput>
          </NFormItem>
          <NFormItem label="下载Excel导入模板" ignore-path-change>
            <NButton type="primary" :loading="downloadLoading" @click="handleDownloadTemplateClick">
              下载模板
            </NButton>
          </NFormItem>
          <NFormItem label="选择Excel" path="file">
            <NUpload :default-upload="false" :max="1" @change="handleChange" accept=".xlsx">
              <NButton type="info">选择文件</NButton>
            </NUpload>
          </NFormItem>
        </NForm>
      </NSpin>
      <template #footer>
        <NButton :loading="loading" type="primary" @click="handleSaveClick">导入</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
