<script setup lang="ts">
import type { AnswerBoardQuestionWithIndex } from './data'
import { NTag, NIcon, NEllipsis } from 'naive-ui'
import { CheckmarkCircle, CloseCircleOutline, CheckmarkCircleOutline } from '@vicons/ionicons5'
import { inject, type Ref } from 'vue'

withDefaults(
  defineProps<{
    title?: string
    options: AnswerBoardQuestionWithIndex[]
  }>(),
  { title: '标题' },
)
const emit = defineEmits<{
  select: [value: AnswerBoardQuestionWithIndex]
}>()

const selected = inject<Ref<number>>('selected')

function renderAnswerText(item: AnswerBoardQuestionWithIndex) {
  if (item.questionType === 3) {
    return item.answer === '1' ? '√' : '×'
  } else {
    return item.answer
  }
}

function handleClick(item: AnswerBoardQuestionWithIndex) {
  emit('select', item)
}
</script>

<template>
  <div class="sheet-list">
    <h4 class="py-2">{{ title }}</h4>
    <ul
      role="list"
      class="flex flex-row flex-wrap items-start justify-start justify-items-center gap-2"
    >
      <li
        class="flex w-fit cursor-pointer select-none flex-row justify-around"
        v-for="(item, key) in options"
        :key="key"
        @click="handleClick(item)"
      >
        <template v-if="item.isCorrect != null">
          <NTag round :type="item.isCorrect ? 'success' : 'error'" class="hover:shadow">
            <template #icon>
              <NIcon>
                <CheckmarkCircleOutline v-if="item.isCorrect"></CheckmarkCircleOutline>
                <CloseCircleOutline v-else></CloseCircleOutline>
              </NIcon>
            </template>
            <span>{{ item.number }}.&nbsp;</span>
            <span class="w-1"></span>
            <NEllipsis style="max-width: 100px" :tooltip="false">
              {{ renderAnswerText(item) }}
            </NEllipsis>
          </NTag>
        </template>
        <template v-else>
          <NTag v-if="item.isAnswer" round type="primary" class="hover:shadow">
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
        </template>
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped></style>
