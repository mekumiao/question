<script setup lang="ts">
import { importFromExcel, exportToExcelTemplate } from '@/api/questions'
import { NUpload, type FormRules, type UploadFileInfo } from 'naive-ui'
import { NDrawer, NDrawerContent, NButton, NSpin } from 'naive-ui'
import { useMessage, NFormItem, NForm } from 'naive-ui'
import { ref } from 'vue'

const formRef = ref<InstanceType<typeof NForm>>()

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const downloadLoading = ref(false)
const model = ref<{ file?: File }>({})

let callback: VoidFunction

async function open(cb: VoidFunction) {
  callback = cb
  active.value = true
}

function handleAfterLeave() {
  loading.value = false
  model.value = {}
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
    await formRef.value!.validate()
    await importFromExcel(model.value.file!)
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
  file: {
    required: true,
    message: '请选择文件',
  },
}
</script>

<template>
  <NDrawer v-model:show="active" :width="502" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>导入题目</template>
      <NSpin :show="loading">
        <NForm ref="formRef" :rules="rules" :model="model">
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
