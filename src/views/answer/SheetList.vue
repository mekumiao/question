<script setup lang="ts">
import type { AnswerOption } from './data'
import { NTag, NIcon, NEllipsis } from 'naive-ui'
import { CheckmarkCircle } from '@vicons/ionicons5'
import { inject, type Ref } from 'vue'

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

const selected = inject<Ref<number>>('selected')

function renderAnswerText(item: AnswerOption) {
  if (item.answer) {
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
  }
}

function handleClick(item: AnswerOption) {
  emit('select', item)
}
</script>

<template>
  <div class="sheet-list">
    <h4>{{ title }}</h4>
    <ul
      role="list"
      class="m-1 flex flex-row flex-wrap items-start justify-start justify-items-center"
    >
      <li
        class="mx-1 flex w-fit cursor-pointer select-none flex-row justify-around"
        v-for="(item, key) in options"
        :key="key"
        @click="handleClick(item)"
      >
        <NTag v-if="item.answer !== undefined" round type="success" class="hover:shadow">
          <template #icon>
            <NIcon><CheckmarkCircle></CheckmarkCircle></NIcon>
          </template>
          <span>{{ item.number }}.&nbsp;</span>
          <span class="w-1"></span>
          <NEllipsis style="max-width: 100px" :tooltip="false">
            {{ renderAnswerText(item) }}
          </NEllipsis>
        </NTag>
        <NTag v-else-if="selected === item.questionId" round type="warning" class="hover:shadow">
          <span>{{ item.number }}</span>
        </NTag>
        <NTag v-else round type="info" class="hover:shadow">
          <span>{{ item.number }}</span>
        </NTag>
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped></style>
