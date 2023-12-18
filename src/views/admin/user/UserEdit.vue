<script setup lang="ts">
import { get as fetchItem, update as fetchUpdate } from '@/api/users'
import {
  NDrawer,
  NDrawerContent,
  NButton,
  NSpin,
  NSpace,
  NCheckbox,
  NCheckboxGroup,
} from 'naive-ui'
import { NForm, NFormItem, NInput } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { createDefaultModel } from './data'
import { ref } from 'vue'
import type { User } from '@/api/users'

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const model = ref<User>(createDefaultModel())

let callback: VoidFunction

async function open(userId: string, cb: VoidFunction) {
  callback = cb
  active.value = true
  try {
    loading.value = true
    model.value = await fetchItem(userId)
  } finally {
    loading.value = false
  }
}

function handleAfterLeave() {
  loading.value = false
  model.value = createDefaultModel()
}

async function handleSaveClick() {
  try {
    loading.value = true
    model.value = await fetchUpdate(model.value.userId, model.value)
    active.value = false
    callback?.()
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>

<template>
  <NDrawer v-model:show="active" :width="502" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>
        <NSpace vertical>
          <h4>编辑用户</h4>
          <h5>账号:&nbsp;{{ model.userName }}</h5>
        </NSpace>
      </template>
      <NSpin :show="loading">
        <NForm>
          <NFormItem label="名称"><NInput v-model:value="model.nickName"></NInput></NFormItem>
          <NFormItem label="角色">
            <NCheckboxGroup v-model:value="model.roles">
              <NCheckbox value="admin" label="管理员"></NCheckbox>
            </NCheckboxGroup>
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
