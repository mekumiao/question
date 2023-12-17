<script setup lang="tsx">
import { reactive, inject } from 'vue'
import type { Component, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BtAvatar from '@/components/BtAvatar.vue'
import { NDropdown, NIcon, NSwitch } from 'naive-ui'
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
  MoonOutline,
  SunnyOutline,
} from '@vicons/ionicons5'
import { logout } from '@/api/users'

const route = useRoute()
const router = useRouter()
const isDark = inject<Ref<boolean>>('isDark')

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
  return () => <NIcon component={icon}></NIcon>
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
    class="flex flex-row items-center justify-between justify-items-center rounded p-2 shadow"
  >
    <div class="icon ms-5 flex flex-row p-2"></div>
    <nav class="flex flex-row items-center justify-center">
      <ul role="list" class="flex flex-row items-center justify-start">
        <li
          class="mx-2 cursor-pointer text-lg font-bold"
          :class="{ activate: item.path === route.path }"
          v-for="(item, key) in data.menus"
          :key="key"
        >
          <RouterLink :to="item.path">{{ item.text }}</RouterLink>
        </li>
      </ul>
      <NSwitch title="切换主题" v-model:value="isDark">
        <template #checked-icon>
          <NIcon>
            <MoonOutline></MoonOutline>
          </NIcon>
        </template>
        <template #unchecked-icon>
          <NIcon>
            <SunnyOutline></SunnyOutline>
          </NIcon>
        </template>
      </NSwitch>
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
