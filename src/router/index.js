import Login from '@/views/Auth/Login.vue';
import DashBoard from '@/views/DashBoard/DashBoard.vue';
import LectureList from '@/views/Lecture/List.vue';
import Test from '@/views/Lecture/Test.vue';
import TestInfo from '@/views/Lecture/TestInfo.vue';
import NotFound from '@/views/NotFound/NotFound.vue';
import Notice from '@/views/Support/Notice.vue';
import Statistics from '@/views/User/Statistics/Statistics.vue';
import QnA from '@/views/Support/QnA.vue';
import Attendance from '@/views/Lecture/Attendance.vue';
import { createRouter, createWebHistory } from 'vue-router';
import SurveyManage from '@/views/Support/SurveyManage.vue';
import Survey from '@/components/Support/Survey/Student/Survey.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/vue',
      component: DashBoard,
      children: [
        {
          path: 'support',
          name: 'support',
          children: [
            {
              path: 'notice',
              name: 'notice',
              component: Notice,
            },
            {
              path: 'qna',
              name: 'qna',
              component: QnA,
            },
            {
              path: 'manage-survey',
              name: 'manage-survey',
              component: SurveyManage,
            },
            {
              path: 'lecture-survey',
              name: 'lecture-survey',
              component: Survey,
            },
          ],
        },
        {
          path: 'lecture',
          name: 'lecture',
          children: [
            {
              path: 'list',
              name: 'list',
              component: LectureList,
            },
            {
              path: 'attendance',
              name: 'attendance',
              component: Attendance,
            },
          ],
        },
        {
          path: 'user',
          name: 'user',
          children: [
            {
              path: 'statistics',
              name: 'statistics',
              component: Statistics,
            },
          ],
        },
        {
          path: 'lecture',
          name: 'lecture',
          children: [
            {
              path: 'test-info',
              name: 'test-info',
              component: TestInfo,
            },
            {
              path: 'test',
              name: 'test',
              component: Test,
            },
          ],
        },
      ],
    },
  ],
});

export default router;
