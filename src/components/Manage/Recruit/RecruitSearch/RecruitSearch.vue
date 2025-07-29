<script setup>
import router from '@/router';
import { onMounted, ref } from 'vue';

const studentName = ref('');
const startDate = ref('');
const endDate = ref('');

const handleRecruit = () => {
  const query = [];
  !studentName.value || query.push(`studentName=${studentName.value}`);
  !startDate.value || query.push(`searchStDate=${startDate.value}`);
  !endDate.value || query.push(`searchEdDate=${endDate.value}`);

  if (startDate.value > endDate.value) {
    alert('잘못된 입사일자 조회입니다. 조회 날짜를 확인해주세요');
    startDate.value = '';
    endDate.value = '';
    return;
  }

  const queryString = query.length > 0 ? `?${query.join('&')}` : '';
  router.push(queryString);
};

const handleEnter = (e) => {
  if (e.key === 'Enter') {
    handleRecruit();
  }
};

onMounted(() => {
  window.location.search && router.replace(window.location.pathname);
});
</script>
<template>
  <div class="list-container">
    <div class="input-box">
      학생명
      <input v-model.lazy="studentName" type="text" @keydown="handleEnter" />
      입사일자
      <input v-model="startDate" type="date" />
      ~
      <input v-model="endDate" type="date" />
      <button @click="handleRecruit">검색</button>
    </div>
  </div>
</template>
<style>
@import './styled.css';
</style>
