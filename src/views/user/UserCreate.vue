<script setup lang="ts">
import { create as fetchCreate } from '@/api/users'
import { NDrawer, NDrawerContent, NButton, NSpin, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { NForm, NFormItem, NInput } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import type { UserInput } from '@/api/users'

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const model = ref<UserInput>({
  email: '',
  nickName: '',
  password: '',
  confirmPassword: '',
  roles: [],
})

let callback: VoidFunction

async function open(cb: VoidFunction) {
  callback = cb
  active.value = true
}

function handleAfterLeave() {
  loading.value = false
  model.value = {} as UserInput
}

async function handleSaveClick() {
  try {
    loading.value = true
    await fetchCreate(model.value)
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
        <h4>创建用户</h4>
      </template>
      <NSpin :show="loading">
        <NForm>
          <NFormItem label="昵称">
            <NInput v-model:value="model.nickName"></NInput>
          </NFormItem>
          <NFormItem label="邮箱">
            <NInput v-model:value="model.email"></NInput>
          </NFormItem>
          <NFormItem label="密码">
            <NInput v-model:value="model.password" type="password"></NInput>
          </NFormItem>
          <NFormItem label="确认密码">
            <NInput v-model:value="model.confirmPassword" type="password"></NInput>
          </NFormItem>
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
