<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const { lecId, loginId } = defineProps({
  lecId: { type: Number, default: 0 },
  loginId: { type: String, default: '' },
});
const surveyResultDetail = ref([]);
const modalState = useModalState();

const getSurveyResultString = (result) => {
  const resultObj = { 1: '매우 나쁨', 2: '나쁨', 3: '보통', 4: '좋음', 5: '매우 좋음' };
  return resultObj[result];
};

const getAvg = (intArr) => {
  return Math.round(
    intArr.reduce((pre, cur) => {
      return pre + cur;
    }) / intArr.length,
  );
};

onMounted(() => {
  const param = new URLSearchParams();
  param.append('lecId', lecId);
  param.append('loginId', loginId);
  axios.post('/api/support/getSurveyDetail.do', param).then((res) => {
    const temp = res.data.detail;
    temp.push({
      surveyContent: '평균',
      surveyId:
        Math.max(
          ...temp.map((x) => {
            return x.surveyId;
          }),
        ) + 1,
      surveyResult: getAvg(
        res.data.detail.map((x) => {
          return x.surveyResult;
        }),
      ),
    });
    surveyResultDetail.value = temp;
  });
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-container">
        <table class="notice-table">
          <thead class="notice-table-header">
            <tr>
              <th>문항</th>
              <th>답변</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="result in surveyResultDetail"
              :key="result.surveyId"
              class="notice-table-row"
            >
              <td class="notice-cell">{{ result.surveyContent }}</td>
              <td class="notice-cell">{{ getSurveyResultString(result.surveyResult) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="button-container">
          <button type="button" @click="modalState.$patch({ isOpen: false })">나가기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
@import './styled.css';
</style>
