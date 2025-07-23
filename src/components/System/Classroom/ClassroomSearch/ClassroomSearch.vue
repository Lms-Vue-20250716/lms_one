<script setup>
import router from '@/router';
import { useModalState } from '@/stores/modalState';
import { onMounted, ref } from 'vue';

const searchTitle = ref('');
const searchPersonnel = ref('');
const modalState = useModalState();

// 검색 버튼을 클릭을 할 때, 검색 데이터가 queryParam에 들어가게끔 하는 함수
const handlerSearch = () => {
  const query = [];

  // 1. searchTitle의 값이 있을 경우, 쿼리라는 array에 담아 둘 겁니다.
  !searchTitle.value || query.push(`title=${searchTitle.value}`);
  !searchPersonnel.value || query.push(`personnel=${searchPersonnel.value}`);

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
      강의실 이름: <input v-model.lazy="searchTitle" @keydown="handleEnter" />
      정원:
      <input v-model.lazy="searchPersonnel" type="number" />
      <button @click="handlerSearch">검색</button>
      <button @click="modalState.$patch({ isOpen: true })">신규</button>
    </div>
  </div>
</template>

<!-- style scoped는 해당 컴포넌트에서만 스타일을 적용시키는 방법이다.
    그러나, scoped는 컴파일 시점에 고유한 속성을 컴포넌트 요소에 추가하는데,
    외부 css 파일은 이 고유 속성을 알지 못하므로 스타일이 적용안된다.

    scoped을 사용하지 않고, css파일을 import 하거나, <style scoped> 안에 css를 구성해야한다.
-->
<style>
@import './styled.css';
</style>
