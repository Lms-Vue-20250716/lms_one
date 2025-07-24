<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';

const searchTitle = ref('');
const searchStDate = ref('');
const searchEdDate = ref('');
const searchTag = ref('lecName');

const handlerSearch = () => {
  const query = [];

  !searchTag.value || query.push(`searchTag=${searchTag.value}`);
  !searchTitle.value || query.push(`searchTitle=${searchTitle.value}`);
  !searchStDate.value || query.push(`searchStDate=${searchStDate.value}`);
  !searchEdDate.value || query.push(`searchEdDate=${searchEdDate.value}`);

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
      <select v-model="searchTag">
        <option value="lecName">강의명</option>
        <option value="lecInstructorName">강사명</option>
        <option value="lecRoomName">강의실</option>
      </select>
      <input v-model="searchTitle" />
      <input v-model="searchStDate" type="date" />
      <input v-model="searchEdDate" type="date" />
      <button @click="handlerSearch">검색</button>
    </div>
  </div>
</template>

<style scoped>
@import './styled.css';
</style>
