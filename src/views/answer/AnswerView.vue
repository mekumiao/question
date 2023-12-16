<script setup lang="ts">
import AnswerPanel from './AnswerPanel.vue'

const examId = 4
</script>

<template>
  <div class="answer-view">
    <AnswerPanel :exam-id="examId"></AnswerPanel>
  </div>
</template>

<style lang="scss" scoped></style>
