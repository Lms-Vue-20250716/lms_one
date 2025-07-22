<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import { useModalState } from '@/stores/modalState';
// import { useUserInfo } from '@/stores/userInfo';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TestModal from '../TestModal/TestModal.vue';

const route = useRoute();
// const userStore = useUserInfo();
const testList = ref([]);
const testCount = ref(0);
const detailId = ref(0);
const modalState = useModalState();
const modalMode = ref('');
const testModalProps = ref({});

const testSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);

  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  axios.post(`/api/lecture/testListBody.do`, param).then((res) => {
    testList.value = res.data.list;
    testCount.value = res.data.count;
  });
};

// 시험 응시 모달
const testTakeModal = (testId, lecId, studentId) => {
  modalMode.value = 'take';
  testModalProps.value = {
    testId: testId,
    lecId: lecId,
    studentId: studentId,
    mode: 'take',
  };
  detailId.value = { testId, lecId, studentId };
  modalState.$patch({ isOpen: true, type: 'test' });
};

// 시험 결과 모달
const testResultModal = (testId, lecId, studentId) => {
  modalMode.value = 'result';
  testModalProps.value = {
    testId: testId,
    lecId: lecId,
    studentId: studentId,
    mode: 'result',
  };
  detailId.value = { testId, lecId, studentId };
  modalState.$patch({ isOpen: true, type: 'test' });
};

const handlePostSuccess = () => {
  testSearch();
};

watch(
  () => {
    return route.query;
  },
  () => {
    testSearch();
  },
);

onMounted(() => {
  testSearch();
});
</script>

<template>
  <div class="test-main-container">
    <table class="test-table">
      <thead class="test-table-header">
        <tr>
          <th>강의</th>
          <th>강사</th>
          <th>강의실</th>
          <th>시험 시작일</th>
          <th>시험 종료일</th>
          <th>시험응시</th>
          <th>시험응시결과</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="testCount > 0">
          <tr v-for="test in testList" :key="test.testId" class="test-table-row">
            <td class="test-cell">{{ test.lecName }}</td>
            <td class="test-cell">{{ test.lecInstructorName }}</td>
            <td class="test-cell">{{ test.lecRoomName }}</td>
            <td class="test-cell">{{ test.testBeginDate?.substring(0, 19) }}</td>
            <td class="test-cell">{{ test.testEndDate?.substring(0, 19) }}</td>
            <td class="test-cell">
              <template v-if="test.testAvailable && test.submitYn === 'N'">
                <button
                  class="btnType blue cursor-pointer"
                  @click="testTakeModal(test.testId, test.lecId, test.lecStudentId)"
                >
                  시험응시
                </button>
              </template>

              <template v-if="test.testAvailable && test.submitYn === 'Y'">
                <button
                  class="btnType blue cursor-pointer"
                  @click="testTakeModal(test.testId, test.lecId, test.lecStudentId)"
                >
                  시험응시완료
                </button>
              </template>

              <template v-if="!test.testAvailable && test.submitYn === 'Y'">
                <span class="btnType blue">시험응시종료</span>
              </template>

              <template v-if="!test.testAvailable && test.submitYn === 'N'">
                <span class="btnType blue">시험미응시</span>
              </template>
            </td>
            <td class="test-cell">
              <template v-if="test.testAvailable && test.scoreYn === 'N'">
                <span class="btnType blue">시험응시예정</span>
              </template>

              <template v-if="test.testAvailable && test.scoreYn === 'Y'">
                <button
                  class="btnType blue cursor-pointer"
                  @click="testResultModal(test.testId, test.lecId, test.lecStudentId)"
                >
                  시험응시결과
                </button>
              </template>

              <template v-if="!test.testAvailable && test.scoreYn === 'Y'">
                <button
                  class="btnType gray cursor-pointer"
                  @click="testResultModal(test.testId, test.lecId, test.lecStudentId)"
                >
                  시험종료
                </button>
              </template>

              <template v-if="!test.testAvailable && test.scoreYn === 'N'">
                <span class="btnType gray">시험미응시</span>
              </template>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="7" class="test-empty-row">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation :items-per-page="5" :total-items="testCount" :on-page-change="testSearch" />
  </div>

  <TestModal
    v-if="modalState.isOpen && modalState.type === 'test'"
    :detail-id="detailId.testId"
    :mode="modalMode"
    :test-id="testModalProps.testId"
    :lec-id="testModalProps.lecId"
    :student-id="testModalProps.studentId"
    @post-success="handlePostSuccess"
    @un-mounted-modal="detailId = $event"
  />
</template>

<style>
@import './styled.css';
</style>
