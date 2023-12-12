import { createRouter, createWebHistory } from 'vue-router'
import StudentLayout from '@/layout/StudentLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/login/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/student/home',
    },
    {
      path: '/open',
      component: StudentLayout,
      children: [{ path: 'login', alias: '/login', component: LoginView }],
    },
    {
      path: '/student',
      component: StudentLayout,
      children: [
        { path: 'home', component: HomeView },
        { path: 'answer', component: () => import('../views/answer/AnswerView.vue') },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layout/AdminLayout.vue'),
      children: [
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

export default router
