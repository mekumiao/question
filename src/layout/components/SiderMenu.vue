<script setup lang="tsx">
import { NMenu } from 'naive-ui'
import { ref, type Component, onMounted } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  BookmarkOutline,
  // People,
  PeopleOutline,
  RibbonOutline,
  // SchoolOutline,
  // Server,
  TimeOutline,
} from '@vicons/ionicons5'
import { DashboardOutlined } from '@vicons/antd'
import { RouterLink, type RouteLocationRaw, useRoute } from 'vue-router'

const collapsed = ref(false)
const selectedKey = ref<string>()
const menuInstRef = ref<InstanceType<typeof NMenu>>()
const route = useRoute()

onMounted(() => {
  selectAndExpand(route.fullPath)
})

function renderMenuLabel(label: string, to?: RouteLocationRaw) {
  if (to) {
    return () => <RouterLink to={to}>{label}</RouterLink>
  } else {
    return label
  }
}

function renderIcon(icon: Component) {
  return () => <NIcon component={icon}></NIcon>
}

function selectAndExpand(key: string) {
  selectedKey.value = key
  menuInstRef.value?.showOption(key)
}

const menuOptions: MenuOption[] = [
  {
    label: renderMenuLabel('仪表板', { path: '/admin/dashboard' }),
    key: '/admin/dashboard',
    icon: renderIcon(DashboardOutlined),
  },
  {
    // label: renderMenuLabel('用户管理'),
    // key: 'user-management',
    // icon: renderIcon(People),
    // children: [
    // {
    label: renderMenuLabel('用户列表', { path: '/admin/user' }),
    key: '/admin/user',
    icon: renderIcon(PeopleOutline),
    // },
    // {
    //   label: renderMenuLabel('学生列表', { path: '/admin/student' }),
    //   key: '/admin/student',
    //   icon: renderIcon(SchoolOutline),
    // },
    // ],
  },
  // {
  //   label: renderMenuLabel('题库管理'),
  //   key: 'qbank-management',
  //   icon: renderIcon(Server),
  //   children: [
  {
    label: renderMenuLabel('题目列表', { path: '/admin/question' }),
    key: '/admin/question',
    icon: renderIcon(BookmarkOutline),
  },
  {
    label: renderMenuLabel('试卷列表', { path: '/admin/exam-paper' }),
    key: '/admin/exam-paper',
    icon: renderIcon(RibbonOutline),
  },
  {
    label: renderMenuLabel('答题历史', { path: '/admin/history' }),
    key: '/admin/history',
    icon: renderIcon(TimeOutline),
  },
  //   ],
  // },
]
</script>

<template>
  <aside class="sticky top-0">
    <NMenu
      ref="menuInstRef"
      v-model:value="selectedKey"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :accordion="true"
    />
  </aside>
</template>

<style lang="css" scoped></style>
