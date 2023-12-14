<script setup lang="ts">
import type { Option, Question } from '@/api/questions'
import type { FormRules } from 'naive-ui'
import { NForm, NFormItem, NInput, NRate } from 'naive-ui'
import { NSpace, NRadio, NRadioGroup } from 'naive-ui'
import { computed, ref } from 'vue'

const props = defineProps<{ data: Question }>()

const formRef = ref<InstanceType<typeof NForm>>()

const model = computed<Question>({
  get: () => props.data,
  set: () => {},
})

const optionsSelected = computed<number | undefined>({
  get: () => model.value.options.find((v) => v.isCorrect)?.optionId,
  set: (v) => {
    model.value.correctAnswer = ''
    model.value.options.forEach((v) => (v.isCorrect = false))
    if (v) {
      const item = model.value.options.find((t) => t.optionId === v)
      if (item) {
        item.isCorrect = true
        model.value.correctAnswer = item.optionCode
      }
    }
  },
})

const rules: FormRules = {
  questionText: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入题目',
  },
  options: {
    type: 'array',
    required: true,
    trigger: 'change',
    message: '请输入选择答案',
    validator: (_rulr, value: Option[]) => {
      return !!value.find((v) => v.isCorrect)
    },
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
    <NFormItem label="答案" path="options">
      <NRadioGroup v-model:value="optionsSelected">
        <NSpace>
          <NRadio v-for="(item, key) in model.options" :value="item.optionId" :key="key">
            {{ item.optionCode }}.&nbsp;{{ item.optionText }}
          </NRadio>
        </NSpace>
      </NRadioGroup>
    </NFormItem>
  </NForm>
</template>

<style lang="scss" scoped></style>
