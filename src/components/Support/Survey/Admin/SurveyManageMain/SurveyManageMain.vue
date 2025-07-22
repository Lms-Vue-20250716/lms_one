<script setup>
import { ref } from 'vue';
import SurveyCompleteList from '../SurveyManageList/SurveyCompleteList.vue';
import SurveyResultList from '../SurveyManageList/SurveyResultList.vue';

const listOption = ref('complete');
</script>

<template>
  <div class="content-box-form">
    <label class="form-label"> 관리 항목<span class="ml-1 text-red-500">*</span> </label>
    <select v-model="listOption" class="form-select">
      <option value="complete">설문 완료 목록 조회</option>
      <option value="result">설문 결과 조회</option>
    </select>
  </div>
  <div class="notice-main-container">
    <SurveyCompleteList v-if="listOption === 'complete'" />

    <SurveyResultList v-if="listOption === 'result'" />
  </div>
</template>

<style scoped>
@import './styled.css';
@import 'tailwindcss';

.content-box-form {
  @apply mx-auto mt-6 flex w-7/8 flex-row items-center gap-4 rounded-xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg;
}

.form-label {
  @apply flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700;
  white-space: nowrap; /* 긴 텍스트 줄바꿈 방지 */
}

.form-select {
  @apply w-[250px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition duration-300 ease-in-out focus:border-blue-400 focus:outline-none;
}
</style>
