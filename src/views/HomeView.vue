<script setup lang="ts">
import { NCard, NCarousel } from 'naive-ui'
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import dashboard from '@/assets/prod/dashboard.png'
import examination from '@/assets/prod/examination.png'
import practice from '@/assets/prod/practice.png'
import answer from '@/assets/prod/answer.png'
import dashboardDark from '@/assets/prod/dashboard_dark.png'
import examinationDark from '@/assets/prod/examination_dark.png'
import practiceDark from '@/assets/prod/practice_dark.png'
import answerDark from '@/assets/prod/answer_dark.png'

const isDark = useDark()
const list = [dashboard, examination, practice, answer]
const listDark = [dashboardDark, examinationDark, practiceDark, answerDark]
const imgList = computed<string[]>(() => (!isDark.value ? list : listDark))
</script>

<template>
  <div class="grid grid-cols-5 gap-2 p-2">
    <div class="col-span-3">
      <NCarousel autoplay show-arrow :interval="3000">
        <img
          class="carousel-img rounded border-0"
          v-for="(item, key) in imgList"
          :key="key"
          :src="item"
        />
      </NCarousel>
    </div>
    <NCard class="col-span-2" title="题库管理系统">
      支持在线考试，题目导入，试卷导入，学生答题记录浏览等功能。
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.carousel-img {
  width: 100%;
  object-fit: cover;
}
</style>
