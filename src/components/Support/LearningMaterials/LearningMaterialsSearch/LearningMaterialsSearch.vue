<script setup>
import router from '@/router';
import { useModalState } from '@/stores/modalState';
import { useUserInfo } from '@/stores/loginInfoState';
import { computed, onMounted, ref } from 'vue';

const searchTitle = ref('');
const searchDate = ref('');
const modalState = useModalState();
const searchTag = ref('title');
const userStore = useUserInfo();

// 사용자 권한 체크
const canCreateMaterial = computed(() => userStore.user?.userType === 'T');

const initializeUser = async () => {
  await userStore.initializeFromSession();
  console.log('현재 사용자 정보:', userStore.user);
  console.log('사용자 타입:', userStore.user?.userType);
};

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

const openNewMaterialModal = () => {
  if (!canCreateMaterial.value) {
    alert('권한이 없습니다.');
    return;
  }
  modalState.$patch({ isOpen: true });
};

onMounted(async () => {
  await initializeUser(); // 사용자 정보 초기화
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
      <button v-if="canCreateMaterial" @click="openNewMaterialModal">신규</button>
    </div>
  </div>
</template>
