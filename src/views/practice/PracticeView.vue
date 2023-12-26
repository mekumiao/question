<script setup lang="ts">
import type { ExamPaper } from '@/api/examPapers'
import { NForm, NFormItem, type FormRules, NInput, NEmpty, NSpin, useMessage } from 'naive-ui'
import { NCard, NRate, NList, NListItem, NThing, NPagination, NButton } from 'naive-ui'
import { getMeExamPaperList } from '@/api/students'
import { onMounted, reactive, ref } from 'vue'
import type { RandomGenerationInput } from '@/api/answerBoard'

const message = useMessage()

const loading = ref(false)
const examPapers = ref<ExamPaper[]>([])
const randomGenerationData = ref<RandomGenerationInput>({ difficultyLevel: 3 })
const pagination = reactive({
  page: 1,
  pageSize: 9,
  itemCount: 0,
  // @ts-ignore
  prefix({ itemCount }) {
    return `Total: ${itemCount}`
  },
})

const menus = reactive({
  list: [
    {
      key: 'practice',
      title: '真题练习',
      description:
        '真题练习是提高考试准备水平的有效途径，通过熟悉考试格式、评估知识水平和强化记忆，帮助学习者提高应试技能。',
    },
    {
      key: 'random',
      title: '随机练习',
      description:
        '随机练习通过引入变化和多样性，促使学习者在不同主题间切换，提高全面理解、灵活性和适应能力。',
    },
  ],
  selectKey: 'practice',
})

onMounted(() => {
  handlePageChange(1)
})

async function handlePageChange(page: number) {
  try {
    loading.value = true
    const result = await getMeExamPaperList({
      offset: (page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    })
    examPapers.value = result.items
    pagination.itemCount = result.total
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
    console.log(error)
  } finally {
    loading.value = false
  }
}

const randomRules: FormRules = {
  examPaperName: [
    {
      type: 'string',
      max: 50,
      message: '请输入试卷名称',
      trigger: ['input', 'blur'],
    },
  ],
}
</script>

<template>
  <div class="grid grid-cols-6 gap-2 px-2">
    <NList class="col-span-2 h-fit" hoverable clickable bordered>
      <NListItem
        v-for="(item, key) in menus.list"
        :key="key"
        @click="() => (menus.selectKey = item.key)"
        :class="{ 'border-4 border-solid border-blue-500': item.key === menus.selectKey }"
      >
        <NThing :title="item.title" :description="item.description"></NThing>
      </NListItem>
    </NList>
    <NSpin :show="loading" class="col-span-4" v-if="menus.selectKey === 'practice'">
      <NEmpty
        :description="loading ? '加载中...' : '没有找到任何可用试卷'"
        v-if="examPapers.length === 0"
      >
        <template #extra>
          <NButton size="small" @click="handlePageChange(1)">尝试刷新</NButton>
        </template>
      </NEmpty>
      <template v-else>
        <div
          class="grid grid-cols-3 grid-rows-3 gap-2 ps-4"
          style="height: calc(100vh - var(--header-height) - 50px)"
        >
          <NCard v-for="(item, key) in examPapers" :key="key" class="col-span-1 row-span-1">
            <div class="flex h-full flex-col justify-between">
              <ul class="flex flex-col items-start justify-center space-y-2">
                <li class="flex flex-row items-center justify-start">
                  <span>试卷:&nbsp;</span><span class="font-bold">{{ item.examPaperName }}</span>
                </li>
                <li class="flex flex-row items-center justify-start">
                  <span>难度:&nbsp;</span>
                  <NRate readonly size="small" :value="item.difficultyLevel" :count="3"></NRate>
                </li>
                <li class="flex flex-row items-center justify-start">
                  <span>题目总数:&nbsp;</span
                  ><span class="font-bold">{{ item.totalQuestions }}&nbsp;题</span>
                </li>
              </ul>
              <div class="flex w-full flex-row justify-end">
                <RouterLink
                  :to="{
                    path: `/student/answer/practice`,
                    query: { examPaperId: item.examPaperId },
                  }"
                >
                  <NButton ghost type="primary" size="small">进入练习</NButton>
                </RouterLink>
              </div>
            </div>
          </NCard>
        </div>
        <div class="col-span-6 flex flex-row justify-end">
          <NPagination
            v-model:page="pagination.page"
            :item-count="pagination.itemCount"
            simple
            @update:page="handlePageChange"
          />
        </div>
      </template>
    </NSpin>
    <NCard class="col-span-4 w-fit p-5" v-else-if="menus.selectKey === 'random'">
      <NForm ref="randomFormRef" :rules="randomRules" :model="randomGenerationData">
        <NFormItem label="给本次练习取个名吧" path="examPaperName">
          <NInput v-model:value="randomGenerationData.examPaperName"></NInput>
        </NFormItem>
        <NFormItem label="允许出现低于或等于此难度级别的题目" ignore-path-change>
          <NRate
            size="medium"
            v-model:value="randomGenerationData.difficultyLevel"
            :count="3"
          ></NRate>
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex flex-row justify-end">
          <RouterLink :to="{ path: '/student/answer/random', query: randomGenerationData }">
            <NButton size="small" type="primary" ghost>进入练习</NButton>
          </RouterLink>
        </div>
      </template>
    </NCard>
  </div>
</template>

<style lang="scss" scoped></style>
