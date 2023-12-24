<script setup lang="tsx">
import type { ExaminationUpdate } from '@/api/examination'
import type { FormRules } from 'naive-ui'
import { update as fetchUpdate, get as fetchItem } from '@/api/examination'
import { NTimePicker } from 'naive-ui'
import { NDrawer, NDrawerContent, NButton, NSpin, NInput, NInputNumber } from 'naive-ui'
import { useMessage, NRadioGroup, NRadio, NFormItem, NForm, NRate } from 'naive-ui'
import { createExaminationTypeOptions } from './data'
import { computed, reactive, ref } from 'vue'

const formRef = ref<InstanceType<typeof NForm>>()

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const data = reactive<{
  examinationId: number
  model: ExaminationUpdate
}>({
  examinationId: 0,
  model: defaultModel(),
})

const [, ...options] = createExaminationTypeOptions()
const examinationTypeOptions = ref(options)

const durationSeconds = computed({
  get() {
    return (data.model.durationSeconds ?? 0) * 1000 - 28800000
  },
  set(v) {
    data.model.durationSeconds = (v + 28800000) / 1000
  },
})

let callback: VoidFunction

async function open(examinationId: number, cb: VoidFunction) {
  callback = cb
  active.value = true
  try {
    loading.value = true
    const result = await fetchItem(examinationId)
    data.model = result
    data.examinationId = examinationId
  } finally {
    loading.value = false
  }
}

function defaultModel(): ExaminationUpdate {
  return {
    examinationName: '',
    examinationType: 1,
    difficultyLevel: 1,
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
    await fetchUpdate(data.examinationId, data.model)
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
  durationSeconds: [
    {
      required: true,
      type: 'number',
      min: 1,
      message: '请设置考试时间',
    },
  ],
}
</script>

<template>
  <NDrawer v-model:show="active" width="60%" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>编辑考试</template>
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
        </NForm>
      </NSpin>
      <template #footer>
        <NButton :loading="loading" type="primary" @click="handleSaveClick">保存</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
