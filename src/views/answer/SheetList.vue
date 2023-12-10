<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    type: 'single' | 'multiple' | 'panduan' | 'tiankong'
    options: { number: number; answer: string | undefined | string[] | boolean }[]
  }>(),
  { title: '标题' }
)
const emit = defineEmits<{
  select: [value: { number: number; answer: string | undefined | string[] | boolean }]
}>()

function select() {}
</script>

<template>
  <div class="sheet-list">
    <h2>{{ title }}</h2>
    <ul role="list" class="m-1 flex flex-row items-start justify-start justify-items-center">
      <li
        class="mx-1 flex w-fit flex-row justify-around rounded bg-gray-400 px-1"
        :class="{ activate: item.answer !== undefined }"
        v-for="(item, key) in options"
        :key="key"
      >
        <span>{{ item.number }}.&nbsp;</span>
        <span v-if="item.answer === undefined">__</span>
        <span v-else-if="type === 'single'">{{ item.answer }}</span>
        <span v-else-if="type === 'multiple'">{{ (item.answer as string[]).join(',') }}</span>
        <span v-else-if="type === 'panduan'">{{ item.answer ? '√' : '×' }}</span>
        <span v-else-if="type === 'tiankong'">{{ item.answer ? '已填' : '未填' }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped>
.activate {
  background-color: var(--color-theme);
  color: var(--color-text-white);
}
</style>
