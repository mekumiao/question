<script setup lang="ts">
import { create as fetchCreate } from '@/api/users'
import { NDrawer, NDrawerContent, NButton, NSpin, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { NForm, NFormItem, NInput, useMessage, NAutoComplete } from 'naive-ui'
import type { FormItemRule, FormRules } from 'naive-ui'
import { computed, ref } from 'vue'
import type { UserInput } from '@/api/users'

type FormModel = UserInput & { confirmPassword: string }

const formRef = ref<InstanceType<typeof NForm>>()

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const model = ref<FormModel>({
  email: '',
  nickName: '',
  password: '',
  confirmPassword: '',
  roles: [],
})

function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return (
    !!model.value.password &&
    model.value.password.startsWith(value) &&
    model.value.password.length >= value.length
  )
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === model.value.password
}
const rules: FormRules = {
  nickName: [
    {
      required: true,
      message: '请输入昵称',
      trigger: ['input', 'blur'],
    },
    {
      max: 10,
      message: '昵称最多支持10个字符',
      trigger: ['input', 'blur'],
    },
  ],
  email: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入邮箱')
        } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
          return new Error('请输入正确邮箱')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur'],
    },
    {
      min: 6,
      max: 16,
      message: '密码长度在6~16之间',
      trigger: ['input', 'blur'],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
}

const autoCompleteOptions = computed(() => {
  return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
    const prefix = model.value.email.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    }
  })
})

let callback: VoidFunction

async function open(cb: VoidFunction) {
  callback = cb
  active.value = true
}

function handleAfterLeave() {
  loading.value = false
  model.value = {
    email: '',
    nickName: '',
    password: '',
    confirmPassword: '',
    roles: [],
  }
}

async function handleSaveClick() {
  try {
    loading.value = true
    await formRef.value?.validate()
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
        <NForm ref="formRef" :rules="rules" :model="model">
          <NFormItem label="昵称" path="nickName">
            <NInput v-model:value="model.nickName"></NInput>
          </NFormItem>
          <NFormItem label="邮箱" path="email">
            <NAutoComplete v-model:value="model.email" :options="autoCompleteOptions" />
          </NFormItem>
          <NFormItem label="密码" path="password">
            <NInput
              v-model:value="model.password"
              type="password"
              show-password-on="click"
            ></NInput>
          </NFormItem>
          <NFormItem label="确认密码" path="confirmPassword">
            <NInput
              v-model:value="model.confirmPassword"
              type="password"
              show-password-on="click"
            ></NInput>
          </NFormItem>
          <NFormItem label="角色" path="roles">
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
