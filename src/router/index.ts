import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import StudentLayout from '@/layout/StudentLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/login/LoginView.vue'
import { createDiscreteApi } from 'naive-ui'
import { useCurrentUser } from '@/stores/user'

const { loadingBar } = createDiscreteApi(['loadingBar'])

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/certificate/:examinationId/:userId',
      props: (route) => ({
        examinationId: Number(route.params.examinationId),
        userId: Number(route.params.userId),
      }),
      component: () => import('../views/CertificateView.vue'),
    },
    {
      path: '/open',
      component: StudentLayout,
      children: [
        { path: '/home', name: 'home', component: HomeView },
        {
          path: '/login',
          name: 'login',
          props: (route) => ({
            redirect: route.query.redirect,
          }),
          component: LoginView,
        },
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
            examPaperId: route.query.examPaperId && Number(route.query.examPaperId),
            examinationId: route.query.examinationId && Number(route.query.examinationId),
            answerBoardId: route.query.answerBoardId && Number(route.query.answerBoardId),
            difficultyLevel: route.query.difficultyLevel && Number(route.query.difficultyLevel),
            examPaperName: route.query.examPaperName,
          }),
          component: () => import('../views/answer/AnswerView.vue'),
        },
        {
          path: 'answer-detail/:answerBoardId',
          props: (route) => ({ answerBoardId: Number(route.params.answerBoardId) }),
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
        {
          path: 'history',
          props: (route) => ({
            studentId: route.query.studentId && Number(route.query.studentId),
            studentName: route.query.studentName,
            examinationId: route.query.examinationId && Number(route.query.examinationId),
            examinationName: route.query.examinationName,
          }),
          component: () => import('../views/admin/history/HistoryList.vue'),
        },
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

router.beforeEach((to, from, next) => {
  if (to.matched.some((v) => v.path === '/student')) {
    const isAuthenticated = checkUserAuthentication()
    if (!isAuthenticated) {
      return toLogin(to, next)
    }
    next()
  } else if (to.matched.some((v) => v.path === '/admin')) {
    const isAuthenticated = checkUserAuthentication()
    if (!isAuthenticated) {
      return toLogin(to, next)
    }
    const currentUser = useCurrentUser()
    const roles = currentUser.user?.roles
    if (!roles || !roles.includes('admin')) {
      return toLogin(to, next)
    }
    next()
  } else {
    next()
  }
})

/**
 * 检查是否登录
 */
function checkUserAuthentication() {
  const currentUser = useCurrentUser()
  return !!currentUser.user
}

function toLogin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  return next({ name: 'login', query: { redirect: to.fullPath } })
}

export default router
