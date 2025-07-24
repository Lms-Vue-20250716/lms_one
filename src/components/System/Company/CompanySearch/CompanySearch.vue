<script setup>
import router from '@/router';
import { useModalState } from '@/stores/modalState';
import { onMounted, ref } from 'vue';

const searchTitle = ref('');
const searchStDate = ref('');
const searchEdDate = ref('');
const modalState = useModalState();

const handlerSearch = () => {
  const query = [];

  !searchTitle.value || query.push(`title=${searchTitle.value}`);
  !searchStDate.value || query.push(`joinDate=${searchStDate.value}`);
  !searchEdDate.value || query.push(`joinDate=${searchEdDate.value}`);

  const queryString = query.length > 0 ? `?${query.join('&')}` : '';

  router.push(queryString);
};
const handleEnter = (e) => {
  if (e.key === 'Enter') {
    handlerSearch();
  }
};
onMounted(() => {
  window.location.search && router.replace(window.location.pathname);
});
</script>
<template>
  <div class="company-container">
    <div class="input-box">
      회사명: <input v-model.lazy="searchTitle" @keydown="handleEnter" /> 가입일자:
      <input v-model="searchStDate" type="date" />~
      <input v-model="searchEdDate" type="date" />
      <button @click="handlerSearch">검색</button>
      <button @click="modalState.$patch({ isOpen: true })">등록</button>
    </div>
  </div>
</template>
<style>
@import './styled.css';
</style>
