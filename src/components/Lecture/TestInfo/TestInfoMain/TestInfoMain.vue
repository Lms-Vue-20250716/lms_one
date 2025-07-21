<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useModalState } from '@/stores/modalState';
import TestInfoModal from '../TestInfoModal/TestInfoModal.vue';
import TestQuestionInfoDetailModal from '../TestInfoModal/testQuestionInfoDetailModal.vue';

const route = useRoute();
const testInfoList = ref([]);
const testInfoCount = ref(0);
const detailId = ref(0);
const modalState = useModalState();

// 시험문제 모달 관련 상태
const testQuestionModal = ref(null);
const testQuestionModalData = ref({ testId: '', lecId: '' });

const testInfoSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);

  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  axios.post(`/api/lecture/testInfoListBody.do`, param).then((res) => {
    testInfoList.value = res.data.list;
    testInfoCount.value = res.data.count;
  });
};

const testInfoDetail = (testId, lecId) => {
  modalState.$patch({ isOpen: true, type: 'test_info' });
  detailId.value = { testId, lecId };
};

const viewTestQuestions = (testId, lecId) => {
  testQuestionModalData.value = { testId, lecId };
  if (testQuestionModal.value) {
    testQuestionModal.value.openModal(testId, lecId);
  }
};

// 시험문제 모달에서 검색을 호출할 때 사용
const onTestQuestionPostSuccess = () => {
  testInfoSearch();
};

watch(
  () => {
    return route.query;
  },
  () => {
    testInfoSearch();
  },
);

onMounted(() => {
  testInfoSearch();
});
</script>

<template>
  <div class="testInfo-main-container">
    <table class="testInfo-table">
      <thead class="testInfo-table-header">
        <tr>
          <th>강의</th>
          <th>강사</th>
          <th>강의실</th>
          <th>시험 시작일</th>
          <th>시험 종료일</th>
          <th>시험 등록일</th>
          <th>시험문제보기</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="testInfoCount > 0">
          <tr
            v-for="testInfo in testInfoList"
            :key="testInfo.testInfoId"
            class="testInfo-table-row"
          >
            <td
              class="testInfo-cell cursor-pointer text-blue-600 hover:underline"
              @click="testInfoDetail(testInfo.testId, testInfo.lecId)"
            >
              {{ testInfo.lecName }}
            </td>
            <td class="testInfo-cell">
              {{ testInfo.lecInstructorName }}
            </td>
            <td class="testInfo-cell">{{ testInfo.lecRoomName }}</td>
            <td class="testInfo-cell">{{ testInfo.testBeginDate?.substring(0, 19) }}</td>
            <td class="testInfo-cell">{{ testInfo.testEndDate?.substring(0, 19) }}</td>
            <td class="testInfo-cell">{{ testInfo.testRegDate.substring(0, 10) }}</td>
            <td class="testInfo-cell">
              <button
                class="cursor-pointer text-blue-600 hover:underline"
                @click="viewTestQuestions(testInfo.testId, testInfo.lecId)"
              >
                시험문제보기
              </button>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="7" class="testInfo-empty-row">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation
      :items-per-page="5"
      :total-items="testInfoCount"
      :on-page-change="testInfoSearch"
    />
  </div>

  <!-- 기존 시험정보 모달 -->
  <TestInfoModal
    v-if="modalState.isOpen && modalState.type == 'test_info'"
    :detail-id="detailId"
    @post-success="testInfoSearch"
    @un-mounted-modal="detailId = $event"
  />

  <!-- 시험문제 상세 모달 -->
  <TestQuestionInfoDetailModal
    ref="testQuestionModal"
    :user-type="$userType"
    :login-id="$loginId"
    @post-success="onTestQuestionPostSuccess"
  />
</template>

<style>
@import './styled.css';
</style>
