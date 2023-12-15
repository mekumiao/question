<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { login } from '@/api/users'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

const data = reactive({
  form: { email: 'admin@qq.com', password: 'Az.123123!' },
  rules: {
    email: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入邮箱',
    },
    password: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入密码',
    },
  },
})
const formRef = ref<FormInst>()
const message = useMessage()
const router = useRouter()

async function handleLoginClick(e: MouseEvent) {
  e.preventDefault()
  try {
    await formRef.value?.validate()
    await login(data.form.email, data.form.password)
    message.success('登录成功！')
    router.replace({ name: 'home' })
  } catch (error) {
    console.error(error)
    if (error instanceof AxiosError) {
      message.error('登录失败，请检查邮箱或密码')
    } else if (error instanceof Error) {
      message.error(error.message)
    }
  }
}
</script>

<template>
  <div class="login-view flex flex-row justify-center">
    <div class="mt-20 rounded-lg bg-white px-20 py-10 shadow-lg">
      <NForm ref="formRef" :model="data.form" :rules="data.rules">
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="data.form.email" placeholder="请输入邮箱" />
        </NFormItem>
        <NFormItem label="密码" path="password">
          <NInput v-model:value="data.form.password" type="password" placeholder="请输入密码" />
        </NFormItem>
        <div class="flex justify-end">
          <NButton type="primary" block @click="handleLoginClick">登录</NButton>
        </div>
      </NForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
