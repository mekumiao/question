<script setup lang="tsx">
import { reactive, inject, computed } from 'vue'
import type { Component, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NDropdown, NIcon, NSwitch, NEl, NAvatar, NButton } from 'naive-ui'
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
import { logout } from '@/api/account'
import icon from '@/assets/img/icon.png'
import { useCurrentUser } from '@/stores/user'
import { joinFileUrl } from '@/api/files'

const route = useRoute()
const router = useRouter()
const currentUser = useCurrentUser()
const isDark = inject<Ref<boolean>>('isDark')

const data = reactive({
  menus: [
    {
      path: '/home',
      text: '首页',
    },
    {
      path: '/student/examination',
      text: '考试',
    },
    {
      path: '/student/mock-exam',
      text: '模拟',
    },
    {
      path: '/student/practice',
      text: '练习',
    },
    {
      path: '/student/answer-history',
      text: '记录',
    },
    // {
    //   path: '/student/4',
    //   text: '错题重做',
    // },
  ],
})

const menuListData: ((
  | DropdownOption
  | DropdownGroupOption
  | DropdownDividerOption
  | DropdownRenderOption
) & { isAdmin?: boolean })[] = [
  {
    label: '个人中心',
    key: 'personal center',
    icon: renderIcon(UserIcon),
  },
  {
    label: '控制面板',
    key: 'control panel',
    icon: renderIcon(ControlPanelIcon),
    isAdmin: true,
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

const menuList = computed(() => {
  return menuListData.filter(
    (v) => v.isAdmin !== true || currentUser.user?.roles.includes('admin') === true,
  )
})

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
    currentUser.setUser()
    await router.push({ name: 'login' })
  }
}
</script>

<template>
  <NEl
    class="sticky top-0 z-10"
    style="
      background-color: var(--body-color);
      transition: background-color 0.3s var(--cubic-bezier-ease-in-out);
    "
  >
    <header
      class="flex flex-row items-center justify-between justify-items-center rounded p-2 shadow"
      style="height: var(--header-height)"
    >
      <div class="icon ms-5 flex flex-row p-2"></div>
      <nav class="flex flex-row items-center justify-center space-x-4">
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
        <RouterLink to="/login" v-if="!currentUser.user">
          <NButton type="info" size="medium">登录</NButton>
        </RouterLink>
        <NDropdown v-else trigger="click" :options="menuList" @select="handleAvatarMenuSelect">
          <div
            class="ms-5 flex cursor-pointer flex-col items-center justify-center rounded p-1 shadow hover:shadow-2xl"
          >
            <NAvatar
              round
              size="medium"
              :src="
                currentUser.user.avatar ||
                (currentUser.user.avatarFileId && joinFileUrl(currentUser.user.avatarFileId)) ||
                icon
              "
            ></NAvatar>
            <div class="w-16 truncate text-center text-xs font-bold">
              {{ currentUser.user?.nickName }}
            </div>
          </div>
        </NDropdown>
      </nav>
    </header>
  </NEl>
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
