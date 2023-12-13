<script setup lang="ts">
import type { Question } from '@/api/questions'
import { get as fetchItem, update as fetchUpdate } from '@/api/questions'
import { NDrawer, NDrawerContent, NButton, NSpin } from 'naive-ui'
import { useMessage } from 'naive-ui'
import SingleChoiceForm from './form/SingleChoiceForm.vue'
import MultipleChoiceForm from './form/MultipleChoiceForm.vue'
import { ref } from 'vue'

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const model = ref<Question>(createDefaultModel())

function createDefaultModel() {
  return {
    questionId: 0,
    questionText: '',
    questionType: 0,
    correctAnswer: '',
    options: [],
  }
}

let callback: VoidFunction

async function open(questionId: number, cb: VoidFunction) {
  callback = cb
  active.value = true
  try {
    loading.value = true
    model.value = await fetchItem(questionId)
  } finally {
    loading.value = false
  }
}

function handleAfterLeave() {
  loading.value = false
  model.value = createDefaultModel()
}

async function handleSaveClick() {
  try {
    loading.value = true
    model.value = await fetchUpdate(model.value.questionId, model.value)
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
  } finally {
    loading.value = false
    active.value = false
    callback?.()
  }
}

defineExpose({ open })
</script>

<template>
  <NDrawer v-model:show="active" :width="502" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>编辑题目&nbsp;&nbsp;ID:&nbsp;{{ model.questionId }}</template>
      <NSpin :show="loading">
        <SingleChoiceForm v-if="model.questionType === 0" :data="model"></SingleChoiceForm>
        <MultipleChoiceForm v-if="model.questionType === 1" :data="model"></MultipleChoiceForm>
      </NSpin>
      <template #footer>
        <NButton :loading="loading" @click="handleSaveClick">保存</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
