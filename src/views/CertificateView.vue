<script setup lang="ts">
import { NAlert, NAvatar, NCard, NRate, NResult, NButton } from 'naive-ui'
import icon from '@/assets/img/icon.png'
import { formatSeconds } from '@/utils'
import { onMounted, ref } from 'vue'
import { getCertificate, type Certificate } from '@/api/examination'
import { joinFileUrl } from '@/api/files'

const props = defineProps<{ examinationId: number; userId: number }>()

const loading = ref(false)
const cert = ref<Certificate>()

onMounted(async () => {
  try {
    loading.value = true
    cert.value = await getCertificate(props.examinationId, props.userId)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-row justify-center">
    <div v-if="!cert">
      <div v-if="loading">加载中...</div>
      <div v-else>
        <NResult status="404" title="404" description="生活总归带点荒谬">
          <template #footer>
            <NButton @click="$router.back()">返回上一页</NButton>
          </template>
        </NResult>
      </div>
    </div>
    <NCard v-else class="mt-10 w-fit px-10 py-5">
      <template #header>
        <div class="flex flex-col items-center gap-2">
          <NAvatar
            round
            :src="cert.avatar || joinFileUrl(cert.avatarFileId) || icon"
            style="width: 8rem; height: 8rem"
          ></NAvatar>
          <h3>{{ cert.examinationName }}</h3>
        </div>
      </template>
      <div class="flex flex-col gap-2">
        <span v-if="cert.isSuccess" class="font-bold">
          恭喜&nbsp;
          <span class="text-lg font-bold">{{ cert.nickName || cert.userName }}</span>
          &nbsp;考试通过，获得荣誉证书！
        </span>
        <span v-else class="font-bold">
          很遗憾&nbsp;
          <span class="text-lg font-bold">{{ cert.nickName || cert.userName }}</span>
          &nbsp;考试未通过，获得鼓励证书！
        </span>
        <NAlert type="info" class="relative">
          <ul class="flex flex-col gap-2 font-light">
            <li class="text-xs">考试ID:&nbsp;{{ cert.examinationId }}</li>
            <li class="text-xs">用户ID:&nbsp;{{ cert.userId }}</li>
            <li class="text-xs">耗时:&nbsp;{{ formatSeconds(cert.timeTakenSeconds) }}</li>
            <li class="flex flex-row items-center text-xs">
              得分:&nbsp;<NRate size="small" readonly :value="cert.score" :count="5"></NRate>
            </li>
          </ul>
          <div
            class="absolute flex flex-row items-center justify-center rounded-full border-4 border-solid font-bold"
            :class="[cert.isSuccess ? 'text-green-600' : 'text-red-600']"
            style="width: 6rem; height: 6rem; top: 3rem; right: -2rem; transform: rotate(45deg)"
          >
            {{ cert.isSuccess ? '考试通过' : '考试未通过' }}
          </div>
        </NAlert>
      </div>
    </NCard>
  </div>
</template>

<style lang="scss" scoped></style>
