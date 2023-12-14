<script setup lang="ts">
import type { Question } from '@/api/questions'
import { NForm, NFormItem, NInput, NRate } from 'naive-ui'
import { NSpace, NRadio, NRadioGroup } from 'naive-ui'
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
    message: '请选择答案',
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
    <NFormItem label="难度" path="difficultyLevel">
      <NRate v-model:value="model.difficultyLevel" :count="3"></NRate>
    </NFormItem>
    <NFormItem label="答案" path="correctAnswer">
      <NRadioGroup v-model:value="model.correctAnswer">
        <NSpace>
          <NRadio :value="'1'">对</NRadio>
          <NRadio :value="'0'">错</NRadio>
        </NSpace>
      </NRadioGroup>
    </NFormItem>
  </NForm>
</template>

<style lang="scss" scoped></style>
