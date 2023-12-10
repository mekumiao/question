<script setup lang="ts">
import BtClock from '@/components/BtClock.vue'
import SheetList from './SheetList.vue'
import { NButton } from 'naive-ui'
import { reactive } from 'vue'

const data = reactive({
  topic: {
    answer: '',
    number: 1,
    remark: '士大夫士大夫士大夫士大夫士大夫，士大夫士大夫士大夫士大夫士大夫？',
    options: [
      {
        label: '方法',
        value: 'A'
      },
      {
        label: '方法',
        value: 'B'
      },
      {
        label: '方法',
        value: 'C'
      },
      {
        label: '方法',
        value: 'D'
      }
    ]
  },
  sheet: {
    single: [
      {
        number: 1,
        answer: 'A'
      },
      {
        number: 2,
        answer: undefined
      },
      {
        number: 2,
        answer: undefined
      },
      {
        number: 2,
        answer: undefined
      }
    ],
    multiple: [
      {
        number: 3,
        answer: ['A', 'B', 'C']
      },
      {
        number: 4,
        answer: ['A', 'B', 'C']
      }
    ],
    panduan: [
      {
        number: 5,
        answer: true
      },
      {
        number: 6,
        answer: false
      }
    ],
    tiankong: [
      {
        number: 7,
        answer: '答：'
      },
      {
        number: 8,
        answer: undefined
      }
    ]
  }
})

function handleOptionsClick(value: string) {
  data.topic.answer = value
}
</script>

<template>
  <div class="answer-view flex flex-row justify-between">
    <div class="mx-1 w-3/5 rounded bg-white p-3">
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
    <div class="mx-1 w-2/5 rounded bg-white p-3">
      <div class="mx-3">
        <SheetList title="一、单选题" type="single" :options="data.sheet.single"></SheetList>
        <SheetList title="二、多选题" type="multiple" :options="data.sheet.multiple"></SheetList>
        <SheetList title="三、判断题" type="panduan" :options="data.sheet.panduan"></SheetList>
        <SheetList title="四、填空题" type="tiankong" :options="data.sheet.tiankong"></SheetList>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.activate {
  background-color: var(--color-theme);
}
</style>
