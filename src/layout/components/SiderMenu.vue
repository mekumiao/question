<script setup lang="ts">
import { NMenu, NLayoutSider } from 'naive-ui'
import { h, ref, type Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  BookmarkOutline,
  People,
  PeopleOutline,
  RibbonOutline,
  SchoolOutline,
  Server,
  TimeOutline,
} from '@vicons/ionicons5'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

function renderMenuLabel(label: string, to?: RouteLocationRaw) {
  if (to) {
    return () => h(RouterLink, { to: to }, { default: () => label })
  } else {
    return label
  }
}

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: renderMenuLabel('用户管理'),
    key: 'user-management',
    icon: renderIcon(People),
    children: [
      {
        label: renderMenuLabel('用户列表', { path: '/admin/user' }),
        key: 'user',
        icon: renderIcon(PeopleOutline),
      },
      {
        label: renderMenuLabel('学生列表', { path: '/admin/student' }),
        key: 'student',
        icon: renderIcon(SchoolOutline),
      },
    ],
  },
  {
    label: renderMenuLabel('题库管理'),
    key: 'qbank-management',
    icon: renderIcon(Server),
    children: [
      {
        label: renderMenuLabel('题目列表', { path: '/admin/question' }),
        key: 'question',
        icon: renderIcon(BookmarkOutline),
      },
      {
        label: renderMenuLabel('试卷列表', { path: '/admin/exam' }),
        key: 'exam',
        icon: renderIcon(RibbonOutline),
      },
      {
        label: renderMenuLabel('答题历史', { path: '/admin/history' }),
        key: 'history',
        icon: renderIcon(TimeOutline),
      },
    ],
  },
]

const collapsed = ref(false)
</script>

<template>
  <div class="sider-menu">
    <NLayoutSider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <NMenu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </NLayoutSider>
  </div>
</template>

<style lang="css" scoped></style>
