<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const surveyResultList = ref([]);
const surveyResultCnt = ref(0);

const getSurveySearchList = (cPage = 1) => {
  const param = new URLSearchParams();
  param.append('currentPage', cPage);
  param.append('pageSize', 10);
  axios.post('/api/support/getResultListReact.do', param).then((res) => {
    surveyResultList.value = res.data.fixedRes;
    surveyResultCnt.value = res.data.resultCnt;
  });
};

const getSurveyResultString = (result) => {
  const resultObj = {
    0: '평가 없음',
    1: '매우 나쁨',
    2: '나쁨',
    3: '보통',
    4: '좋음',
    5: '매우 좋음',
  };
  return resultObj[result];
};

onMounted(() => {
  getSurveySearchList();
});
</script>

<template>
  <table class="notice-table">
    <thead class="notice-table-header">
      <tr>
        <th>No.</th>
        <th>과목명</th>
        <th>강사이름</th>
        <th>평균</th>
        <th>응답인원</th>
        <th>완료율</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="surveyResultCnt > 0">
        <tr v-for="result in surveyResultList" :key="result.lecId" class="notice-table-row">
          <td class="notice-cell">{{ result.lecId }}</td>
          <td class="notice-cell">{{ result.lecName }}</td>
          <td class="notice-cell">{{ result.lecInstructorName }}</td>
          <td class="notice-cell">{{ getSurveyResultString(result.avgScore) }}</td>
          <td class="notice-cell">{{ result.respondentCount }}</td>
          <td class="notice-cell">{{ result.completionRate }}%</td>
        </tr>
      </template>
    </tbody>
  </table>
  <PageNavigation
    :items-per-page="10"
    :total-items="surveyResultCnt"
    :on-page-change="getSurveySearchList"
  />
</template>

<style>
@import './styled.css';
</style>
