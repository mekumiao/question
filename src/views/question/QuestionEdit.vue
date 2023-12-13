<script setup lang="ts">
import type { Question } from '@/api/questions'
import { get as fetchItem, update as fetchUpdate } from '@/api/questions'
import { NDrawer, NDrawerContent, NButton, NSpin } from 'naive-ui'
import { useMessage } from 'naive-ui'
import SingleChoiceForm from './form/SingleChoiceForm.vue'
import MultipleChoiceForm from './form/MultipleChoiceForm.vue'
import TrueFalseForm from './form/TrueFalseForm.vue'
import FillInTheBlankForm from './form/FillInTheBlankForm.vue'
import { ref } from 'vue'

const signleRef = ref<InstanceType<typeof SingleChoiceForm>>()
const multipleRef = ref<InstanceType<typeof MultipleChoiceForm>>()
const trueFalseRef = ref<InstanceType<typeof TrueFalseForm>>()
const fillInTheBlankRef = ref<InstanceType<typeof FillInTheBlankForm>>()

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
    await signleRef.value?.validate()
    await multipleRef.value?.validate()
    await trueFalseRef.value?.validate()
    await fillInTheBlankRef.value?.validate()
    model.value = await fetchUpdate(model.value.questionId, model.value)
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
</script>

<template>
  <NDrawer v-model:show="active" :width="502" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>编辑题目&nbsp;&nbsp;ID:&nbsp;{{ model.questionId }}</template>
      <NSpin :show="loading">
        <SingleChoiceForm
          ref="signleRef"
          v-if="model.questionType === 0"
          :data="model"
        ></SingleChoiceForm>
        <MultipleChoiceForm
          ref="multipleRef"
          v-else-if="model.questionType === 1"
          :data="model"
        ></MultipleChoiceForm>
        <TrueFalseForm
          ref="trueFalseRef"
          v-else-if="model.questionType === 2"
          :data="model"
        ></TrueFalseForm>
        <FillInTheBlankForm
          ref="fillInTheBlankRef"
          v-else-if="model.questionType === 3"
          :data="model"
        ></FillInTheBlankForm>
      </NSpin>
      <template #footer>
        <NButton :loading="loading" @click="handleSaveClick">保存</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
