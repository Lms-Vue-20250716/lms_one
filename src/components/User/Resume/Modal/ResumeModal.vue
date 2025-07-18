<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref } from 'vue';


const modalState = useModalState();
const companySelectList = ref([]);

const companySelectBox = () => {
  axios.post('/api/user/company-list').then((res) => {
    console.log(res);
    companySelectList.value = res.data;
  });
};

onMounted(() => {
  companySelectBox();
});
</script>
<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-form">
          <!-- 기업 선택 -->
          <strong>이메일 전송할 기업 선택</strong><br />
          <select name="company">
            <option>전체</option>
            <option v-for="company in companySelectList" :key="company.companyId">
              {{ company.companyName }}
            </option>
          </select>
          <!-- 회사 목록 -->
          <strong>선택된 기업 목록</strong>
          <table class="col">
            <thead>
              <tr>
                <th>기업명</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <!-- s : 여기에 내용입력 -->
          <strong>학생 목록</strong>
          <table class="row"></table>
        </div>

        <table class="col">
          <thead>
            <tr>
              <th scope="col"><input type="checkbox" /></th>
              <th scope="col">이름</th>
              <th scope="col">학번</th>
              <th scope="col">전화번호</th>
              <th scope="col">이메일</th>
              <th scope="col">이력서</th>
              <th scope="col">이력서 관리</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="button-container">
          <button>전송</button>
          <button @click="modalState.$patch({ isOpen: false, type: null })">취소</button>
          <button @click="modalState.$patch({ isOpen: false, type: null })">닫기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
