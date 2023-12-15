<script setup lang="ts">
import router from '@/router'
import { reactive, h } from 'vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import BtAvatar from '@/components/BtAvatar.vue'
import { NDropdown, NIcon } from 'naive-ui'
import type {
  DropdownOption,
  DropdownGroupOption,
  DropdownDividerOption,
  DropdownRenderOption,
} from 'naive-ui'
import {
  PersonCircleOutline as UserIcon,
  BuildOutline as ControlPanelIcon,
  LogOutOutline as LogoutIcon,
} from '@vicons/ionicons5'
import { logout } from '@/api/users'

const route = useRoute()

const data = reactive({
  menus: [
    {
      path: '/home',
      text: '首页',
    },
    {
      path: '/student/answer',
      text: '开始考试',
    },
    {
      path: '/student/2',
      text: '模拟考试',
    },
    {
      path: '/student/3',
      text: '考试记录',
    },
    {
      path: '/student/4',
      text: '错题重做',
    },
    {
      path: '/student/5',
      text: '我要练习',
    },
  ],
})

const menuList: (
  | DropdownOption
  | DropdownGroupOption
  | DropdownDividerOption
  | DropdownRenderOption
)[] = [
  {
    label: '个人中心',
    key: 'personal center',
    icon: renderIcon(UserIcon),
  },
  {
    label: '控制面板',
    key: 'control panel',
    icon: renderIcon(ControlPanelIcon),
  },
  {
    type: 'divider',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutIcon),
  },
]

function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

function handleClick(path: string) {
  router.push(path)
}

async function handleAvatarMenuSelect(key: string | number) {
  if (key === 'personal center') {
    router.push({ path: '/student/personal' })
  } else if (key === 'control panel') {
    router.push({ path: '/admin' })
  } else if (key === 'logout') {
    await logout()
    router.replace({ name: 'login' })
  }
}
</script>

<template>
  <header
    class="flex flex-row items-center justify-between justify-items-center rounded p-2"
    style="background-color: var(--vt-c-white)"
  >
    <div class="icon ms-5 flex flex-row p-2"></div>
    <nav class="flex flex-row">
      <ul class="flex flex-row items-center justify-start text-lg font-bold">
        <li
          class="mx-2 cursor-pointer"
          :class="{ activate: item.path === route.path }"
          v-for="(item, key) in data.menus"
          :key="key"
          @click="handleClick(item.path)"
        >
          {{ item.text }}
        </li>
      </ul>

      <NDropdown trigger="click" :options="menuList" @select="handleAvatarMenuSelect">
        <div
          class="ms-5 flex cursor-pointer flex-col items-center justify-center rounded p-1 shadow hover:shadow-2xl"
        >
          <BtAvatar name="别听鬼故事"></BtAvatar>
          <div class="w-16 truncate text-xs font-bold">别听鬼故事</div>
        </div>
      </NDropdown>
    </nav>
  </header>
</template>

<style lang="css" scoped>
.activate {
  color: var(--color-theme);
  border-bottom: 4px solid var(--color-theme);
}

.icon {
  background-image: url('@/assets/img/icon.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 4rem;
  height: 4rem;
}
</style>
