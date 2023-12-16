<script setup lang="ts">
import type { AnswerOption } from './data'

withDefaults(
  defineProps<{
    title?: string
    options: AnswerOption[]
  }>(),
  { title: '标题' },
)
const emit = defineEmits<{
  select: [value: AnswerOption]
}>()

function renderAnswerText(item: AnswerOption) {
  if (item.questionType === 1) {
    const option = item.options?.find((v) => v.optionId === item.answer)
    return option?.optionCode
  } else if (item.questionType === 2) {
    const option = item.options
      ?.filter((v) => (item.answer as number[]).includes(v.optionId))
      .map((v) => v.optionCode)
    return option?.join(',')
  } else if (item.questionType === 3) {
    return item.answer === '1' ? '√' : '×'
  } else if (item.questionType === 4) {
    return item.answer
  }
  return '__'
}

function handleClick(item: AnswerOption) {
  emit('select', item)
}
</script>

<template>
  <div class="sheet-list">
    <h2>{{ title }}</h2>
    <ul role="list" class="m-1 flex flex-row items-start justify-start justify-items-center">
      <li
        class="mx-1 flex w-fit cursor-pointer select-none flex-row justify-around rounded bg-gray-400 px-2"
        :class="{ activate: item.answer !== undefined }"
        v-for="(item, key) in options"
        :key="key"
        @click="handleClick(item)"
      >
        <span>{{ item.number }}.&nbsp;</span>
        <span class="w-1"></span>
        <span>{{ renderAnswerText(item) }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped>
.activate {
  background-color: var(--color-theme);
  color: var(--color-text-white);
}
</style>
