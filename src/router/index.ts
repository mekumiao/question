import { createRouter, createWebHistory } from 'vue-router'
import StudentLayout from '@/layout/StudentLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/login/LoginView.vue'
import { checkUserAuthentication, info as fetchInfo } from '@/api/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/open',
      component: StudentLayout,
      children: [
        { path: '/home', name: 'home', component: HomeView },
        { path: '/login', name: 'login', component: LoginView },
      ],
    },
    {
      path: '/student',
      component: StudentLayout,
      children: [
        { path: 'answer', component: () => import('../views/answer/AnswerView.vue') },
        { path: 'personal', component: () => import('../views/user/PersonalView.vue') },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layout/AdminLayout.vue'),
      redirect: '/admin/dashboard',
      children: [
        { path: 'dashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'exam', component: () => import('../views/exam/ExamList.vue') },
        { path: 'question', component: () => import('../views/question/QuestionList.vue') },
        { path: 'student', component: () => import('../views/student/StudentList.vue') },
        { path: 'user', component: () => import('../views/user/UserList.vue') },
        { path: 'role', component: () => import('../views/role/RoleList.vue') },
        { path: 'history', component: () => import('../views/history/HistoryList.vue') },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  //需要登录
  if (to.matched.some((v) => v.path === '/student')) {
    const isAuthenticated = await checkUserAuthentication()
    if (isAuthenticated) {
      next()
    } else {
      next('/login')
    }
  } else if (to.matched.some((v) => v.path === '/admin')) {
    const info = await fetchInfo()
    console.log(info)
    if (info.role.includes('admin')) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
