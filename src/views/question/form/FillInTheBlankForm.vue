<script setup lang="ts">
import type { Question } from '@/api/questions'
import { NForm, NFormItem, NInput } from 'naive-ui'
import { computed, ref } from 'vue'

const props = defineProps<{ data: Question }>()

const formRef = ref<InstanceType<typeof NForm>>()

const model = computed<Question>({
  get: () => props.data,
  set: () => {},
})

const rules = {
  questionText: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入题目',
  },
  correctAnswer: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入答案',
  },
}

defineExpose({
  validate: async () => {
    await formRef.value!.validate()
  },
})
</script>

<template>
  <NForm ref="formRef" :rules="rules" :model="model">
    <NFormItem label="题目" path="questionText">
      <NInput v-model:value="model.questionText" placeholder="请输入题目"></NInput>
    </NFormItem>
    <NFormItem label="答案" path="correctAnswer">
      <NInput v-model:value="model.correctAnswer" placeholder="请输入答案"></NInput>
    </NFormItem>
  </NForm>
</template>

<style lang="scss" scoped></style>
