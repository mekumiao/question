<script setup lang="ts">
import type { User } from '@/api/users'
import type { FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
import type { ChangePassword, InfoUpdate } from '@/api/account'
import { info as fetchInfo, changePassword, update as fetchUpdateInfo, logout } from '@/api/account'
import { useMessage, NButton, NAlert, NUpload } from 'naive-ui'
import { NTabs, NTabPane, NForm, NFormItemRow, NInput } from 'naive-ui'
import { onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { useCurrentUser } from '@/stores/user'
import { useRouter } from 'vue-router'
import { joinFileUrl, upload as uploadFile } from '@/api/files'

const router = useRouter()
const currentUser = useCurrentUser()
const infoFormRef = ref<InstanceType<typeof NForm>>()
const passwordFormRef = ref<InstanceType<typeof NForm>>()

const message = useMessage()
const loading = ref(false)
const model = reactive<{ info: InfoUpdate; secure: ChangePassword & { confirmPassword: string } }>({
  info: {
    nickName: '',
  },
  secure: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
})
const user = ref<User>()
const avatarFile = shallowRef<UploadFileInfo>()
const previewFileList = ref<UploadFileInfo[]>([])

watch(
  () => model.info.avatarFileId,
  (v) => {
    if (v && v > 0) {
      previewFileList.value[0] = {
        id: v.toString(),
        name: '.png',
        status: 'finished',
        url: joinFileUrl(v),
      }
    }
  },
)

onMounted(async () => {
  const result = await fetchInfo()
  user.value = result
  model.info = { nickName: result.nickName, avatarFileId: result.avatarFileId ?? undefined }
  model.secure = { oldPassword: '', newPassword: '', confirmPassword: '' }
})

async function handleSaveClick() {
  if (!user.value) return
  try {
    loading.value = true
    if (infoFormRef.value) {
      await infoFormRef.value.validate()
      if (avatarFile.value && avatarFile.value.file) {
        // 上传头像
        const fileInfo = await uploadFile({
          fileName: avatarFile.value.file.name,
          file: avatarFile.value.file,
        })
        model.info.avatarFileId = fileInfo.fileId
      }
      user.value = await fetchUpdateInfo(model.info)
      currentUser.setUser(user.value)
    } else if (passwordFormRef.value) {
      await passwordFormRef.value.validate()
      await changePassword(model.secure)
      await logout()
      currentUser.setUser()
      await router.push('/login')
    }
    message.success('保存成功')
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handleAvatarChange(options: {
  file: UploadFileInfo
  fileList: Array<UploadFileInfo>
  event?: Event
}) {
  if (options.file.status === 'pending') {
    avatarFile.value = options.file
  } else if (options.file.status === 'removed') {
    // 设置为0表示删除头像
    model.info.avatarFileId = 0
  }
}

function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return (
    !!model.secure.newPassword &&
    model.secure.newPassword.startsWith(value) &&
    model.secure.newPassword.length >= value.length
  )
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === model.secure.newPassword
}

const rules: FormRules = {
  nickName: [
    {
      required: true,
      message: '请输入昵称',
    },
    {
      max: 20,
      message: '昵称最多支持20个字符',
      trigger: ['input', 'blur'],
    },
  ],
  oldPassword: [
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
  newPassword: [
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
  <div class="mx-auto flex flex-col items-center px-5 pt-5" style="width: 500px">
    <NTabs type="line" animated placement="left" size="large">
      <NTabPane name="signin" tab="基本信息">
        <NForm ref="infoFormRef" :rules="rules" :model="model.info">
          <NFormItemRow label="邮箱(账号)">
            <NAlert type="info">{{ user?.userName }}</NAlert>
          </NFormItemRow>
          <NFormItemRow label="昵称" path="nickName">
            <NInput v-model:value="model.info.nickName"></NInput>
          </NFormItemRow>
          <NFormItemRow label="头像" ignore-path-change>
            <NUpload
              :default-upload="false"
              :multiple="false"
              :max="1"
              list-type="image-card"
              :default-file-list="previewFileList"
              @change="handleAvatarChange"
            />
          </NFormItemRow>
        </NForm>
      </NTabPane>
      <NTabPane name="signup" tab="安全信息">
        <NForm ref="passwordFormRef" :rules="rules" :model="model.secure">
          <NFormItemRow label="原密码" path="oldPassword">
            <NInput
              v-model:value="model.secure.oldPassword"
              type="password"
              show-password-on="click"
            ></NInput>
          </NFormItemRow>
          <NFormItemRow label="新密码" path="newPassword">
            <NInput
              v-model:value="model.secure.newPassword"
              type="password"
              show-password-on="click"
            ></NInput>
          </NFormItemRow>
          <NFormItemRow label="确认新密码" path="confirmPassword">
            <NInput
              v-model:value="model.secure.confirmPassword"
              type="password"
              show-password-on="click"
            ></NInput>
          </NFormItemRow>
        </NForm>
      </NTabPane>
    </NTabs>
    <div class="flex w-full flex-row justify-end">
      <NButton type="primary" @click="handleSaveClick" :loading="loading">保存</NButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
