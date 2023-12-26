<script setup lang="ts">
import { get as fetchItem, update as fetchUpdate } from '@/api/users'
import { NForm, NInput, type FormItemRule, type FormRules } from 'naive-ui'
import { NCheckboxGroup, NTabs, NTabPane, NFormItemRow } from 'naive-ui'
import { NDrawer, NDrawerContent, NButton, NSpin, NSpace, NCheckbox } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import type { UserUpdate, User } from '@/api/users'

type FormModel = UserUpdate & { confirmPassword?: string }

const infoFormRef = ref<InstanceType<typeof NForm>>()
const passwordFormRef = ref<InstanceType<typeof NForm>>()

const message = useMessage()
const active = ref(false)
const loading = ref(false)
const model = ref<FormModel>({})
const userIdRef = ref<number>(0)
const user = ref<User>()

let callback: VoidFunction

async function open(userId: number, cb: VoidFunction) {
  callback = cb
  active.value = true
  try {
    loading.value = true
    const result = await fetchItem(userId)
    user.value = result
    model.value = {
      nickName: result.nickName,
      roles: result.roles,
    }
    userIdRef.value = userId
  } finally {
    loading.value = false
  }
}

function handleAfterLeave() {
  loading.value = false
  model.value = {}
}

async function handleSaveClick() {
  try {
    loading.value = true
    if (infoFormRef.value) {
      await infoFormRef.value.validate()
      await fetchUpdate(userIdRef.value, { ...model.value, password: undefined })
    } else if (passwordFormRef.value) {
      await passwordFormRef.value.validate()
      await fetchUpdate(userIdRef.value, { password: model.value.password })
    }
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
      max: 10,
      message: '昵称最多支持10个字符',
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
</script>

<template>
  <NDrawer v-model:show="active" :width="502" @after-leave="handleAfterLeave">
    <NDrawerContent>
      <template #header>
        <NSpace vertical>
          <h4>编辑用户</h4>
          <h5>邮箱:&nbsp;{{ user?.userName }}</h5>
        </NSpace>
      </template>
      <NSpin :show="loading">
        <NTabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <NTabPane name="signin" tab="基本信息">
            <NForm ref="infoFormRef" :rules="rules" :model="model">
              <NFormItemRow label="昵称">
                <NInput v-model:value="model.nickName"></NInput>
              </NFormItemRow>
              <NFormItemRow label="角色">
                <NCheckboxGroup v-model:value="model.roles">
                  <NCheckbox value="admin" label="管理员"></NCheckbox>
                </NCheckboxGroup>
              </NFormItemRow>
            </NForm>
          </NTabPane>
          <NTabPane name="signup" tab="安全信息">
            <NForm ref="passwordFormRef" :rules="rules" :model="model">
              <NFormItemRow label="密码" path="password">
                <NInput
                  v-model:value="model.password"
                  type="password"
                  show-password-on="click"
                ></NInput>
              </NFormItemRow>
              <NFormItemRow label="确认密码" path="confirmPassword">
                <NInput
                  v-model:value="model.confirmPassword"
                  type="password"
                  show-password-on="click"
                ></NInput>
              </NFormItemRow>
            </NForm>
          </NTabPane>
        </NTabs>
      </NSpin>
      <template #footer>
        <NButton :loading="loading" type="primary" @click="handleSaveClick">保存</NButton>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped></style>
