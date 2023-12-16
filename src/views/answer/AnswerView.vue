<script setup lang="ts">
import AnswerContent from './AnswerContent.vue'

const examId = 4
</script>

<template>
  <div class="answer-view">
    <AnswerContent :exam-id="examId"></AnswerContent>
  </div>
</template>

<style lang="scss" scoped></style>
