<script setup>
import router from '@/router';
import { useModalState } from '@/stores/modalState';
import { onMounted, ref } from 'vue';

const searchTitle = ref('');
const startDate = ref('');
const endDate = ref('');
const modalState = useModalState();

const handlerSearch = () => {
  const query = [];

  !searchTitle.value || query.push(`searchTitle=${searchTitle.value}`);
  !startDate.value || query.push(`startDate=${startDate.value}`);
  !endDate.value || query.push(`endDate=${endDate.value}`);

  const queryString = query.length > 0 ? `?${query.join('&')}` : '';

  router.push(queryString);
};

onMounted(() => {
  window.location.search && router.replace(window.location.pathname);
});
</script>

<template>
  <div class="list-container">
    <div class="input-box">
      상담 제목
      <input v-model="searchTitle" />
      기간
      <input v-model="startDate" type="date" /> ~
      <input v-model="endDate" type="date" />
      <button @click="handlerSearch">검색</button>
      <button @click="modalState.$patch({ isOpen: true, type: 'manageCounselCreate' })">
        신규
      </button>
    </div>
  </div>
</template>

<style scoped>
@import './styled.css';
</style>
