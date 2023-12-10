<script setup lang="ts">
import type { Options, OptionsType } from './data'

const props = withDefaults(
  defineProps<{
    title?: string
    type: OptionsType
    options: Options[]
  }>(),
  { title: '标题' }
)
const emit = defineEmits<{
  select: [value: Options, type: OptionsType]
}>()

function handleClick(item: Options) {
  emit('select', item, props.type)
}
</script>

<template>
  <div class="sheet-list">
    <h2>{{ title }}</h2>
    <ul role="list" class="m-1 flex flex-row items-start justify-start justify-items-center">
      <li
        class="mx-1 flex w-fit cursor-pointer select-none flex-row justify-around rounded bg-gray-400 px-1"
        :class="{ activate: item.answer !== undefined }"
        v-for="(item, key) in options"
        :key="key"
        @click="handleClick(item)"
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
