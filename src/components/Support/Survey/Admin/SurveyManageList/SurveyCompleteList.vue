<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import SurveyCompleteDetailModal from '../SurveyManageModal/SurveyCompleteDetailModal.vue';
import { useModalState } from '@/stores/modalState';

const surveyCompleteCnt = ref(0);
const surveyCompletedList = ref([]);
const modalState = useModalState();
const selectedLecId = ref(0);
const selectedLoginId = ref('');

const getSurveyCompletedList = (cPage = 1) => {
  const param = new URLSearchParams();
  param.append('currentPage', cPage);
  param.append('pageSize', 10);
  axios.post('/api/support/getCompletedList', param).then((res) => {
    surveyCompletedList.value = res.data.resultList;
    surveyCompleteCnt.value = res.data.resultCnt;
  });
};

const handleSurveyDetail = (lecId, loginId) => {
  modalState.$patch({ isOpen: true });
  selectedLecId.value = lecId;
  selectedLoginId.value = loginId;
};

onMounted(() => {
  getSurveyCompletedList();
});

function buttonStyle(color) {
  return {
    width: '30%',
    height: '80%',
    color: 'white',
    backgroundColor: color,
    border: '0',
    margin: '0',
    padding: '0',
  };
}
</script>

<template>
  <table class="notice-table">
    <thead class="notice-table-header">
      <tr>
        <th>No.</th>
        <th>과목명</th>
        <th>학생ID</th>
        <th>학생명</th>
        <th>상세보기</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="surveyCompleteCnt > 0">
        <tr
          v-for="survey in surveyCompletedList"
          :key="survey.lecId + survey.loginId"
          class="notice-table-row"
        >
          <td class="notice-cell">{{ survey.lecId }}</td>
          <td class="notice-cell">{{ survey.lecName }}</td>
          <td class="notice-cell">{{ survey.loginId }}</td>
          <td class="notice-cell">{{ survey.stName }}</td>
          <td class="notice-cell">
            <button
              :style="buttonStyle('#5367d9')"
              @click="handleSurveyDetail(survey.lecId, survey.loginId)"
            >
              보기
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <PageNavigation
    :items-per-page="10"
    :total-items="surveyCompleteCnt"
    :on-page-change="getSurveyCompletedList"
  />
  <SurveyCompleteDetailModal
    v-if="modalState.isOpen"
    :lec-id="selectedLecId"
    :login-id="selectedLoginId"
  />
</template>

<style>
@import './styled.css';
</style>
