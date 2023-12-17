<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ avatar?: string }>()

const style = computed(() => {
  if (props.avatar) {
    return {
      'background-image': `url('${props.avatar}')`,
      'background-color': props.avatar,
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': 'cover',
    }
  }
  return {}
})
</script>

<template>
  <div
    class="bt-avatar flex h-14 w-14 select-none items-center justify-center rounded-full"
    :style="style"
  ></div>
</template>

<style lang="css" scoped>
.bt-avatar {
  background-image: url('@/assets/img/jdg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
