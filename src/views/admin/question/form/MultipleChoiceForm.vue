<script setup lang="ts">
import type { Question } from '@/api/questions'
import type { FormRules } from 'naive-ui'
import { NForm, NFormItem, NInput, NRate } from 'naive-ui'
import { NSpace, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { computed, ref } from 'vue'

const props = defineProps<{ data: Question }>()

const formRef = ref<InstanceType<typeof NForm>>()

const model = computed<Question>({
  get: () => props.data,
  set: () => {},
})

const optionsSelected = computed<string[]>({
  get: () => model.value.correctAnswer.split(''),
  set: (v) => {
    model.value.correctAnswer = v.sort().join('')
  },
})

const rules: FormRules = {
  questionText: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入题目',
  },
  correctAnswer: {
    required: true,
    trigger: 'change',
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
    <NFormItem label="难度" path="difficultyLevel">
      <NRate v-model:value="model.difficultyLevel" :count="3"></NRate>
    </NFormItem>
    <NFormItem label="题目" path="questionText">
      <NInput v-model:value="model.questionText" type="textarea" placeholder="请输入题目"></NInput>
    </NFormItem>
    <NFormItem label="答案" path="correctAnswer">
      <NCheckboxGroup v-model:value="optionsSelected">
        <NSpace>
          <NCheckbox v-for="(item, key) in model.options" :value="item.optionCode" :key="key">
            {{ item.optionCode }}.&nbsp;{{ item.optionText }}
          </NCheckbox>
        </NSpace>
      </NCheckboxGroup>
    </NFormItem>
  </NForm>
</template>

<style lang="scss" scoped></style>
