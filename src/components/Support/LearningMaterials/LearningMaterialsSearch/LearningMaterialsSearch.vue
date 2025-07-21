<script setup>
import router from '@/router';
import { useModalState } from '@/stores/modalState';
import { onMounted, ref } from 'vue';

const searchTitle = ref('');
const searchDate = ref('');
const modalState = useModalState();
const searchTag = ref('title');

const handlerSearch = () => {
  const query = [];

  !searchTitle.value || query.push(`title=${searchTitle.value}`);
  !searchDate.value || query.push(`lecId=${searchDate.value}`);
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
      <select v-model="searchTag" class="rounded border px-2 py-1">
        <option value="title">제목</option>
        <option value="lecId">작성자</option>
      </select>
      <input v-model.lazy="searchTitle" @keydown="handleEnter" />
      <button @click="handlerSearch">검색</button>
      <button @click="modalState.$patch({ isOpen: true })">신규</button>
    </div>
  </div>
</template>
