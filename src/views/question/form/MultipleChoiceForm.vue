<script setup lang="ts">
import type { Question } from '@/api/questions'
import { NForm, NFormItem, NInput } from 'naive-ui'
import { NSpace, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{ data: Question }>()

const model = computed<Question>({
  get: () => props.data,
  set: () => {},
})

const optionsSelected = computed<number[] | undefined>({
  get: () => model.value.options.filter((v) => v.isCorrect).map((v) => v.optionId),
  set: (v) => {
    model.value.correctAnswer = ''
    model.value.options.forEach((v) => (v.isCorrect = false))
    if (v) {
      const items = model.value.options.filter((t) => v.includes(t.optionId))
      if (items.length > 0) {
        items.forEach((v) => (v.isCorrect = true))
        model.value.correctAnswer = items.map((v) => v.optionCode).join(',')
      }
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
      <NCheckboxGroup v-model:value="optionsSelected">
        <NSpace>
          <NCheckbox v-for="(item, key) in model.options" :value="item.optionId" :key="key">
            {{ item.optionCode }}.&nbsp;{{ item.optionText }}
          </NCheckbox>
        </NSpace>
      </NCheckboxGroup>
    </NFormItem>
  </NForm>
</template>

<style lang="scss" scoped></style>
