<script setup>
import router from '@/router';
import { onMounted, ref } from 'vue';

const commonGroup = ref('');
const groupCode = ref('');
const detailCode = ref('');

const handlerSearch = () => {
  const query = [];
  if (commonGroup.value) {
    query.push(`commonGroup=${encodeURIComponent(commonGroup.value)}`);
  }
  if (groupCode.value) {
    query.push(`groupCode=${encodeURIComponent(groupCode.value)}`);
  }
  if (detailCode.value) {
    query.push(`detailCode=${encodeURIComponent(detailCode.value)}`);
  }
  const queryString = query.length > 0 ? `?${query.join('&')}` : '';
  router.push(queryString);
};
const handleEnter = (e) => {
  if (e.key === 'Enter') {
    console.log('enter');
    handlerSearch();
  }
};
onMounted(() => {
  window.location.search && router.replace(window.location.pathname);
});
</script>
<template>
  <div class="notice-container">
    <div class="input-box">
      <span>
        분류:
        <select v-model="commonGroup">
          <option value="">분류란을 선택하세요</option>
          <option value="equip">장비</option>
          <option value="loc">지역</option>
        </select>
      </span>
      <span>
        그룹코드:
        <select v-model="groupCode">
          <option value="">그룹코드를 선택하세요</option>
          <option value="com">컴퓨터</option>
          <option value="ms">마우스</option>
          <option value="msp">마우스패드</option>
          <option value="kb">키보드</option>
          <option value="mt">모니터</option>
          <option value="dk">책상</option>
          <option value="chr">의자</option>
          <option value="wb">화이트보드</option>
          <option value="etc">기타</option>
        </select>
      </span>
      시리얼코드:
      <input v-model.lazy="detailCode" @keydown="handleEnter" />
      <button @click="handlerSearch">검색</button>
    </div>
  </div>
</template>
<style>
@import './styled.css';
</style>
