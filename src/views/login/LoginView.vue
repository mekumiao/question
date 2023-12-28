<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { NTabs, NTabPane, NFormItemRow, NAutoComplete } from 'naive-ui'
import { NButton, NForm, NInput, useMessage, NCard } from 'naive-ui'
import { computed, reactive, ref } from 'vue'
import { login, register as fetchRegister } from '@/api/account'
import { info as fetchInfo } from '@/api/account'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/stores/user'

const props = defineProps<{ redirect?: string }>()

const loginFormRef = ref<FormInst>()
const registerFormRef = ref<FormInst>()
const message = useMessage()
const router = useRouter()
const currentUser = useCurrentUser()

const defaultAccount = {
  email: import.meta.env.VITE_LOGIN_EMAIL ?? '',
  password: import.meta.env.VITE_LOGIN_PASSWORD ?? '',
}

const loading = ref(false)
const selectTab = ref<'signin' | 'signup'>('signin')
const data = reactive({
  model: defaultAccount,
  register: {
    email: '',
    password: '',
    confirmPassword: '',
  },
})

async function handleLoginClick(e: MouseEvent) {
  e.preventDefault()
  try {
    loading.value = true
    await loginFormRef.value?.validate()
    await login(data.model.email, data.model.password)
    const info = await fetchInfo()
    currentUser.setUser(info)
    message.success('登录成功！')
    if (props.redirect && props.redirect.startsWith('/login') === false) {
      await router.replace({ path: props.redirect })
    } else {
      await router.replace({ name: 'home' })
    }
  } catch (error) {
    console.error(error)
    if (error instanceof AxiosError) {
      message.error('登录失败，请检查邮箱或密码')
    } else if (error instanceof Error) {
      message.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

async function handleRegisterClick(e: MouseEvent) {
  e.preventDefault()
  try {
    loading.value = true
    await registerFormRef.value?.validate()
    await fetchRegister(data.register.email, data.register.password)
    message.success('注册成功')
    data.model = {
      email: data.register.email,
      password: '',
    }
    // 清空注册信息
    data.register = {
      email: '',
      password: '',
      confirmPassword: '',
    }
    selectTab.value = 'signin'
  } catch (error) {
    console.error(error)
    if (error instanceof AxiosError) message.error(error.message)
  } finally {
    loading.value = false
  }
}

function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return (
    !!data.register.password &&
    data.register.password.startsWith(value) &&
    data.register.password.length >= value.length
  )
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === data.register.password
}
const rules: FormRules = {
  nickName: [
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
    const prefix = data.register.email.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    }
  })
})
</script>

<template>
  <div class="login-view flex flex-row justify-center">
    <NCard class="m-2 w-fit rounded-lg px-20 py-5 shadow">
      <NTabs
        size="large"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        v-model:value="selectTab"
      >
        <NTabPane name="signin" tab="登录">
          <NForm ref="loginFormRef" :rules="rules" :model="data.model">
            <NFormItemRow label="邮箱" path="email">
              <NInput v-model:value="data.model.email" placeholder="请输入邮箱" />
            </NFormItemRow>
            <NFormItemRow label="密码" path="password">
              <NInput
                v-model:value="data.model.password"
                type="password"
                placeholder="请输入密码"
                show-password-on="click"
              />
            </NFormItemRow>
          </NForm>
          <NButton type="primary" :loading="loading" block strong @click="handleLoginClick">
            登录
          </NButton>
        </NTabPane>
        <NTabPane name="signup" tab="注册">
          <NForm ref="registerFormRef" :model="data.register" :rules="rules" autocomplete="off">
            <NFormItemRow label="邮箱" path="email">
              <NAutoComplete
                v-model:value="data.register.email"
                :options="autoCompleteOptions"
                placeholder="请输入邮箱"
                :input-props="{ name: 'new-account', autocomplete: 'off' }"
              />
            </NFormItemRow>
            <NFormItemRow label="密码" path="password">
              <NInput
                v-model:value="data.register.password"
                type="password"
                show-password-on="click"
                placeholder="请输入密码"
                :input-props="{ name: 'new-password', autocomplete: 'new-password' }"
              ></NInput>
            </NFormItemRow>
            <NFormItemRow label="重复密码" path="confirmPassword">
              <NInput
                v-model:value="data.register.confirmPassword"
                type="password"
                show-password-on="click"
                placeholder="请输入密码"
                :input-props="{ name: 'confirm-password', autocomplete: 'new-password' }"
              ></NInput>
            </NFormItemRow>
          </NForm>
          <NButton type="primary" :loading="loading" block strong @click="handleRegisterClick">
            注册
          </NButton>
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<style lang="scss" scoped></style>
