import Login from '@/views/Auth/Login.vue';
import DashBoard from '@/views/DashBoard/DashBoard.vue';
import LectureManageList from '@/views/Lecture/LectureManageList.vue';
import List from '@/views/Lecture/List.vue';
import Test from '@/views/Lecture/Test.vue';
import TestInfo from '@/views/Lecture/TestInfo.vue';
import NotFound from '@/views/NotFound/NotFound.vue';
import Notice from '@/views/Support/Notice.vue';
import Statistics from '@/views/User/Statistics/Statistics.vue';
import QnA from '@/views/Support/QnA.vue';
import Attendance from '@/views/Lecture/Attendance.vue';
import Resume from '@/views/User/Resume/Resume.vue';
import { createRouter, createWebHistory } from 'vue-router';
import SurveyManage from '@/views/Support/SurveyManage.vue';
import Student from '@/views/Manage/Student.vue';
import Survey from '@/views/Support/Survey.vue';
import Tutor from '@/views/Manage/Tutor.vue';
import Classroom from '@/views/System/Classroom.vue';
import Counsel from '@/views/Manage/Counsel.vue';
import LearningMaterials from '@/views/Support/LearningMaterials.vue';
import Commoncode from '@/views/System/Commoncode.vue';
import Equipment from '@/views/System/Equipment.vue';
import Company from '@/views/System/Company.vue';

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
            {
              path: 'learning-materials',
              name: 'learning-materials',
              component: LearningMaterials,
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
              component: List,
            },
            {
              path: 'lecture-manage-list',
              name: 'lecture-manage-list',
              component: LectureManageList,
            },
            {
              path: 'attendance',
              name: 'attendance',
              component: Attendance,
            },
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
        {
          path: 'user',
          name: 'user',
          children: [
            {
              path: 'statistics',
              name: 'statistics',
              component: Statistics,
            },
            {
              path: 'resume',
              name: 'resume',
              component: Resume,
            },
          ],
        },
        {
          path: 'manage',
          name: 'manage',
          children: [
            {
              path: 'student',
              name: 'student',
              component: Student,
            },
            {
              path: 'tutor',
              name: 'tutor',
              component: Tutor,
            },
            {
              path: 'counsel',
              name: 'counsel',
              component: Counsel,
            },
          ],
        },
        {
          path: 'system',
          name: 'system',
          children: [
            {
              path: 'classroom',
              name: 'classroom',
              component: Classroom,
            },
            {
              path: 'commoncode',
              name: 'commoncode',
              component: Commoncode,
            },
            {
              path: 'equipment',
              name: 'equipment',
              component: Equipment,
            },
            {
              path: 'company',
              name: 'company',
              component: Company,
            },
          ],
        },
      ],
    },
  ],
});

export default router;
