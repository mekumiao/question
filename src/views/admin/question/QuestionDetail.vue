<script setup lang="ts">
import type { Question } from '@/api/questions'
import { get as fetchQuestion } from '@/api/questions'
import { NDrawer, NDrawerContent, NSpin } from 'naive-ui'
import { NSpace, NRadio, NRadioGroup } from 'naive-ui'
import { createDefaultModel } from './data'
import { ref } from 'vue'

const model = ref<Question>(createDefaultModel())
const active = ref(false)
const loading = ref(false)

async function open(questionId: number) {
  active.value = true
  model.value = await fetchQuestion(questionId)
}

function handleAfterLeave() {
  loading.value = false
  model.value = createDefaultModel()
}

defineExpose({ open })
</script>

<template>
  <NDrawer v-model:show="active" :width="502" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>查看题目&nbsp;&nbsp;ID:&nbsp;{{ model.questionId }}</template>
      <NSpin :show="loading">
        <ul role="list">
          <li class="flex flex-col justify-start">
            <span class="p-1 font-bold">题目</span>
            <span class="w-full rounded border border-solid border-gray-400 px-1 py-3 shadow-lg">
              {{ model.questionText }}
            </span>
          </li>
          <li class="flex flex-col justify-start">
            <span class="p-1 font-bold">答案</span>
            <span class="w-full rounded border border-solid border-gray-400 px-1 py-3 shadow-lg">
              <NRadioGroup :value="0">
                <NSpace>
                  <NRadio v-for="(item, key) in model.options" :value="item.optionId" :key="key">
                    {{ item.optionCode }}.&nbsp;{{ item.optionText }}
                  </NRadio>
                </NSpace>
              </NRadioGroup>
            </span>
          </li>
        </ul>
      </NSpin>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
