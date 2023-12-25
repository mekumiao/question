import { createRouter, createWebHistory } from 'vue-router'
import StudentLayout from '@/layout/StudentLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/login/LoginView.vue'
import { checkUserAuthentication, info as fetchInfo } from '@/api/users'
import { createDiscreteApi } from 'naive-ui'

const { loadingBar } = createDiscreteApi(['loadingBar'])

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
        {
          path: 'examination',
          component: () => import('../views/examination/ExaminationView.vue'),
        },
        { path: 'mock-exam', component: () => import('../views/mock-exam/MockExamView.vue') },
        { path: 'personal', component: () => import('../views/personal/PersonalView.vue') },
        { path: 'practice', component: () => import('../views/practice/PracticeView.vue') },
        {
          path: 'answer-history',
          component: () => import('../views/answer-history/AnswerHistoryView.vue'),
        },
        {
          path: 'answer/:type',
          props: (route) => ({
            type: route.params.type,
            examPaperId: Number(route.query.examPaperId),
            examinationId: Number(route.query.examinationId),
            answerBoardId: Number(route.query.answerBoardId),
          }),
          component: () => import('../views/answer/AnswerView.vue'),
        },
        {
          path: 'answer-detail/:answerBoardId',
          props: (route) => ({ answerBoardId: Number(route.params['answerBoardId']) }),
          component: () => import('../views/answer/AnswerDetail.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layout/AdminLayout.vue'),
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/admin/dashboard/DashboardView.vue'),
        },
        {
          path: 'exam-paper',
          component: () => import('../views/admin/exam-paper/ExamPaperList.vue'),
        },
        { path: 'question', component: () => import('../views/admin/question/QuestionList.vue') },
        { path: 'user', component: () => import('../views/admin/user/UserList.vue') },
        { path: 'role', component: () => import('../views/admin/role/RoleList.vue') },
        { path: 'student', component: () => import('../views/admin/history/StudentList.vue') },
        { path: 'history', component: () => import('../views/admin/history/HistoryList.vue') },
        {
          path: 'examination',
          component: () => import('../views/admin/examination/ExaminationList.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  loadingBar.start()
  next()
})

router.afterEach(() => {
  loadingBar.finish()
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((v) => v.path === '/student')) {
    const isAuthenticated = await checkUserAuthentication()
    if (!isAuthenticated) {
      return next('/login')
    }
    next()
  } else if (to.matched.some((v) => v.path === '/admin')) {
    const isAuthenticated = await checkUserAuthentication()
    if (!isAuthenticated) {
      return next('/login')
    }
    const info = await fetchInfo()
    if (!info.role.includes('admin')) {
      return next('/login')
    }
    next()
  } else {
    next()
  }
})

export default router
