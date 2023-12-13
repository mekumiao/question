<script setup lang="ts">
import type { Question } from '@/api/questions'
import { NForm, NFormItem, NInput } from 'naive-ui'
import { NSpace, NRadio, NRadioGroup } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{ data: Question }>()

const model = computed<Question>({
  get: () => props.data,
  set: () => {},
})

const optionsSelected = computed<number | undefined>({
  get: () => model.value.options.filter((v) => v.isCorrect).map((v) => v.optionId)[0],
  set: (v) => {
    model.value.correctAnswer = ''
    model.value.options.forEach((v) => (v.isCorrect = false))
    if (v) {
      const item = model.value.options.filter((t) => t.optionId === v)[0]
      item.isCorrect = true
      model.value.correctAnswer = item.optionCode
    }
  },
})

const rules = {
  questionText: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入题目',
  },
}
</script>

<template>
  <NForm :rules="rules" :model="model">
    <NFormItem label="题目" path="questionText">
      <NInput v-model:value="model.questionText" placeholder="请输入题目"></NInput>
    </NFormItem>
    <NFormItem label="选项" path="options">
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

<!-- <NSpin :show="loading">
  <NForm :rules="rules" :model="model">
    <NFormItem label="ID:" path="questionId" label-placement="left">
      {{ model.questionId }}
    </NFormItem>
    <NFormItem label="题目" path="questionText">
      <NInput v-model:value="model.questionText" placeholder="请输入题目"></NInput>
    </NFormItem>
    <NFormItem label="答案" path="correctAnswer">
      <NInput v-model:value="model.correctAnswer" placeholder="请输入答案"></NInput>
    </NFormItem>
    <NFormItem v-if="model.questionType === 0" label="选项" path="options">
      <NRadioGroup v-model:value="model.optionsSelected">
        <NSpace>
          <NRadio v-for="(item, key) in model.options" :value="item.optionId" :key="key">
            {{ item.optionCode }}.&nbsp;{{ item.optionText }}
          </NRadio>
        </NSpace>
      </NRadioGroup>
    </NFormItem>
    <NFormItem v-else-if="model.questionType === 1" label="选项" path="options">
      <NCheckboxGroup v-model:value="model.optionsMultipleSelected">
        <NSpace>
          <NCheckbox v-for="(item, key) in model.options" :value="item.optionId" :key="key">
            {{ item.optionCode }}.&nbsp;{{ item.optionText }}
          </NCheckbox>
        </NSpace>
      </NCheckboxGroup>
    </NFormItem>
  </NForm>
</NSpin> -->
