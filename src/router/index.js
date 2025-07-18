import Login from '@/views/Auth/Login.vue';
import DashBoard from '@/views/DashBoard/DashBoard.vue';
import LectureList from '@/views/Lecture/List.vue';
import NotFound from '@/views/NotFound/NotFound.vue';
import Notice from '@/views/Support/Notice.vue';
import QnA from '@/views/Support/QnA.vue';
import Attendance from '@/views/Lecture/Attendance.vue';
import { createRouter, createWebHistory } from 'vue-router';

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
      ],
    },
  ],
});

export default router;
