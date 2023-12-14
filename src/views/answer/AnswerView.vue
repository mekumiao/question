<script setup lang="ts">
import BtClock from '@/components/BtClock.vue'
import SheetList from './SheetList.vue'
import { NButton } from 'naive-ui'
import { reactive } from 'vue'
import type { Options, OptionsType } from './data'

const data = reactive({
  topic: {
    answer: '',
    number: 1,
    remark: '士大夫士大夫士大夫士大夫士大夫，士大夫士大夫士大夫士大夫士大夫？',
    options: [
      {
        label: '方法',
        value: 'A',
      },
      {
        label: '方法',
        value: 'B',
      },
      {
        label: '方法',
        value: 'C',
      },
      {
        label: '方法',
        value: 'D',
      },
    ],
  },
  sheet: {
    singleChoice: [
      {
        number: 1,
        answer: 'A',
      },
      {
        number: 2,
        answer: undefined,
      },
      {
        number: 3,
        answer: 'B',
      },
      {
        number: 4,
        answer: undefined,
      },
    ],
    multipleChoice: [
      {
        number: 3,
        answer: ['A', 'B', 'C'],
      },
      {
        number: 4,
        answer: ['A', 'B', 'C'],
      },
    ],
    trueFalse: [
      {
        number: 5,
        answer: true,
      },
      {
        number: 6,
        answer: false,
      },
    ],
    fillInTheBlank: [
      {
        number: 7,
        answer: '答：',
      },
      {
        number: 8,
        answer: undefined,
      },
    ],
  },
})

function handleOptionsClick(answer: string) {
  data.topic.answer = answer
}

function handleSheetSelect(value: Options, type: OptionsType) {
  if (type === 'SingleChoice') {
    const item = data.sheet.singleChoice.find((v) => v.number === value.number)
    item && typeof item.answer === 'string' && handleOptionsClick(item.answer)
  }
}
</script>

<template>
  <div class="answer-view grid grid-cols-5 gap-2">
    <div class="col-span-3 rounded bg-white p-3">
      <BtClock></BtClock>
      <div class="mt-2">
        <h4 class="my-5">{{ data.topic.number }}.&nbsp;{{ data.topic.remark }}</h4>
        <ul
          class="flex flex-row justify-around rounded border border-solid border-gray-400 p-3 text-start"
        >
          <li
            class="w-fit cursor-pointer rounded px-1"
            :class="{ 'activate text-white': data.topic.answer === item.value }"
            v-for="(item, key) in data.topic.options"
            :key="key"
            @click="handleOptionsClick(item.value)"
          >
            {{ item.value }}.&nbsp;{{ item.label }}
          </li>
        </ul>
        <div class="mt-3 flex flex-row justify-end">
          <NButton>上一题</NButton>
          <NButton type="success">下一题/交卷</NButton>
        </div>
      </div>
    </div>
    <div class="col-span-2 rounded bg-white p-3">
      <div class="mx-3">
        <SheetList
          title="一、单选题"
          type="SingleChoice"
          :options="data.sheet.singleChoice"
          @select="handleSheetSelect"
        ></SheetList>
        <SheetList
          title="二、多选题"
          type="MultipleChoice"
          :options="data.sheet.multipleChoice"
          @select="handleSheetSelect"
        ></SheetList>
        <SheetList
          title="三、判断题"
          type="TrueFalse"
          :options="data.sheet.trueFalse"
          @select="handleSheetSelect"
        ></SheetList>
        <SheetList
          title="四、填空题"
          type="FillInTheBlank"
          :options="data.sheet.fillInTheBlank"
          @select="handleSheetSelect"
        ></SheetList>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.activate {
  background-color: var(--color-theme);
}
</style>
