<script setup>
import router from '@/router';
import { useModalState } from '@/stores/modalState';
import { onMounted, ref } from 'vue';

const searchTitle = ref('');
const searchStDate = ref('');
const searchEdDate = ref('');
const searchTag = ref('lecName');
const modalState = useModalState();

const handlerSearch = () => {
  const query = [];

  if (searchTitle.value) {
    query.push(`searchTitle=${encodeURIComponent(searchTitle.value)}`);
    query.push(`searchTag=${encodeURIComponent(searchTag.value)}`);
  }

  if (searchStDate.value) {
    query.push(`searchStDate=${encodeURIComponent(searchStDate.value)}`);
  }

  if (searchEdDate.value) {
    query.push(`searchEdDate=${encodeURIComponent(searchEdDate.value)}`);
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
const openRegisterModal = () => {
  modalState.$patch({ isOpen: true, type: 'test' });
};
onMounted(() => {
  window.location.search && router.replace(window.location.pathname);
});
</script>
<template>
  <div class="notice-container">
    <div class="input-box">
      <select v-model="searchTag" class="rounded border px-2 py-1">
        <option value="lecName">강의명</option>
        <option value="lecRoomName">강의실</option>
        <option value="lecInstructorName">강사명</option>
      </select>
      <input v-model.lazy="searchTitle" @keydown="handleEnter" />
      <input v-model="searchStDate" type="date" />
      <input v-model="searchEdDate" type="date" />
      <button @click="handlerSearch">검색</button>
      <button @click="openRegisterModal">등록</button>
    </div>
  </div>
</template>
<style>
@import './styled.css';
</style>
