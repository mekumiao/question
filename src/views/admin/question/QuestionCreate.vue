<script setup lang="ts">
import type { OptionCreate, QuestionCreate } from '@/api/questions'
import { create as fetchCreate } from '@/api/questions'
import { NCheckboxGroup, NCheckbox, type FormRules } from 'naive-ui'
import { NDrawer, NDrawerContent, NButton, NSpin, NDynamicInput, NInput } from 'naive-ui'
import { useMessage, NRadioGroup, NRadio, NFormItem, NForm, NRate, NSpace } from 'naive-ui'
import { createQuestionTypeOptions } from './data'
import { reactive, ref } from 'vue'
import { numberToUpperCaseLetter } from '@/utils'

const formRef = ref<InstanceType<typeof NForm>>()

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const data = reactive<{
  model: QuestionCreate
  current: { single: string; multiple: string[]; truefalse: string; fillblank: string }
}>({
  model: defaultModel(),
  current: defaultCurrent(),
})

const [, ...options] = createQuestionTypeOptions()
const questionTypeOptions = ref(options)

let callback: VoidFunction

async function open(cb: VoidFunction) {
  callback = cb
  active.value = true
}

function defaultModel(): QuestionCreate {
  return {
    questionText: '',
    questionType: 1,
    correctAnswer: '',
    difficultyLevel: 1,
    options: [
      { optionCode: 'A', optionText: '' },
      { optionCode: 'B', optionText: '' },
      { optionCode: 'C', optionText: '' },
      { optionCode: 'D', optionText: '' },
    ],
  }
}
function defaultCurrent() {
  return {
    single: '',
    multiple: [],
    truefalse: '',
    fillblank: '',
  }
}

function handleAfterLeave() {
  loading.value = false
  data.model = defaultModel()
  data.current = defaultCurrent()
}

function ensureCorrectAnswer() {
  if (data.model.questionType === 1) {
    data.model.correctAnswer = data.current.single
  } else if (data.model.questionType === 2) {
    data.model.correctAnswer = data.current.multiple.sort().join('')
  } else if (data.model.questionType === 3) {
    data.model.correctAnswer = data.current.truefalse
  } else if (data.model.questionType === 4) {
    data.model.correctAnswer = data.current.fillblank.trim()
  }
}

async function handleSaveClick() {
  try {
    loading.value = true
    ensureCorrectAnswer()
    await formRef.value?.validate()
    await fetchCreate(data.model)
    active.value = false
    callback?.()
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handleCreateOption(): OptionCreate {
  return { optionCode: '', optionText: '' }
}

function handleUpdateOption() {
  data.model.options.forEach((v, i) => (v.optionCode = numberToUpperCaseLetter(i + 1)))
}

defineExpose({ open })

const rules: FormRules = {
  questionText: [
    { required: true, message: '请输入题目' },
    {
      max: 256,
      message: '题目最长支持256个字符',
    },
  ],
  correctAnswer: [
    {
      required: true,
      message: '请输入答案',
    },
    {
      max: 256,
      message: '答案最长支持256个字符',
    },
  ],
  options: [
    {
      validator() {
        if (data.model.questionType === 1 || data.model.questionType === 2) {
          if (!data.model.options.every((v) => v.optionText)) {
            return new Error('请填入选项值')
          } else if (!data.model.correctAnswer) {
            return new Error('请选择答案')
          }
        }
        return true
      },
    },
  ],
}
</script>

<template>
  <NDrawer v-model:show="active" :width="502" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>创建题目</template>
      <NSpin :show="loading">
        <NForm ref="formRef" :rules="rules" :model="data.model">
          <NFormItem label="题目" path="questionText">
            <NInput
              v-model:value="data.model.questionText"
              type="textarea"
              placeholder="请输入题目"
            ></NInput>
          </NFormItem>
          <NFormItem label="难度" path="difficultyLevel">
            <NRate v-model:value="data.model.difficultyLevel" :count="3"></NRate>
          </NFormItem>
          <NFormItem label="题型">
            <NRadioGroup class="pb-4" v-model:value="data.model.questionType">
              <NRadio v-for="(item, key) in questionTypeOptions" :value="item.value" :key="key">
                {{ item.label }}
              </NRadio>
            </NRadioGroup>
          </NFormItem>
          <NFormItem v-if="data.model.questionType === 1" label="选项" path="options">
            <NRadioGroup v-model:value="data.current.single">
              <NDynamicInput
                v-model:value="data.model.options"
                show-sort-button
                placeholder="请输入选项"
                @create="handleCreateOption"
                @update:value="handleUpdateOption"
              >
                <template #create-button-default>添加选项</template>
                <template #default="{ value }">
                  <div class="flex flex-row items-baseline gap-2">
                    <span>{{ value.optionCode }}.&nbsp;</span>
                    <NRadio :value="value.optionCode"></NRadio>
                    <NInput v-model:value="value.optionText"></NInput>
                  </div>
                </template>
                <template #action>
                  <span></span>
                </template>
              </NDynamicInput>
            </NRadioGroup>
          </NFormItem>
          <NFormItem v-if="data.model.questionType === 2" label="选项" path="options">
            <NCheckboxGroup v-model:value="data.current.multiple">
              <NDynamicInput
                v-model:value="data.model.options"
                show-sort-button
                placeholder="请输入选项"
                @create="handleCreateOption"
                @update:value="handleUpdateOption"
              >
                <template #create-button-default>添加选项</template>
                <template #default="{ value }">
                  <div class="flex flex-row items-baseline gap-2">
                    <span>{{ value.optionCode }}.&nbsp;</span>
                    <NCheckbox :value="value.optionCode"></NCheckbox>
                    <NInput v-model:value="value.optionText"></NInput>
                  </div>
                </template>
                <template #action>
                  <span></span>
                </template>
              </NDynamicInput>
            </NCheckboxGroup>
          </NFormItem>
          <NFormItem v-else-if="data.model.questionType === 3" label="答案" path="correctAnswer">
            <NRadioGroup v-model:value="data.current.truefalse">
              <NSpace>
                <NRadio :value="'1'">√</NRadio>
                <NRadio :value="'0'">×</NRadio>
              </NSpace>
            </NRadioGroup>
          </NFormItem>
          <NFormItem v-else-if="data.model.questionType === 4" label="答案" path="correctAnswer">
            <NInput
              v-model:value="data.current.fillblank"
              type="textarea"
              placeholder="请输入答案"
            ></NInput>
          </NFormItem>
        </NForm>
      </NSpin>
      <template #footer>
        <NButton :loading="loading" type="primary" @click="handleSaveClick">保存</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
