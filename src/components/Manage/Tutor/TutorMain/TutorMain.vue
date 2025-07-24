<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TutorModal from '../TutorModal/TutorModal.vue';

const modalState = useModalState();
const detailId = ref('');

const route = useRoute();
const tutorList = ref([]);
const tutorCount = ref(0);

const tutorSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  axios.post('/api/manage/tutorListBody.do', param).then((res) => {
    tutorList.value = res.data.list;
    tutorCount.value = res.data.count;
    console.log(res.data);
  });
};

const tutorStatusChange = (id, status) => {
  if (confirm('재직 상태를 변경하시겠습니까?')) {
    const param = {
      tutorId: id,
      tutorStatus: status,
    };

    axios.post('/api/manage/update-ins-status', param).then((res) => {
      if (res.data === 'SUCCESS') {
        alert('재직 상태가 변경되었습니다.');
      } else {
        alert('변경 실패');
      }
      tutorSearch();
    });
  } else {
    tutorSearch();
    return;
  }
};

const tutorDetail = (id) => {
  modalState.$patch({ isOpen: true, type: 'manageTutor' });
  detailId.value = id;
};

watch(
  () => route.query,
  () => {
    tutorSearch();
  },
);

onMounted(() => {
  tutorSearch();
});
</script>

<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <thead class="notice-table-header">
        <tr>
          <th>강사번호</th>
          <th>이름</th>
          <th>연락처</th>
          <th>가입일자</th>
          <th>재직상태</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="tutorCount > 0">
          <tr v-for="tutor in tutorList" :key="tutor.tutorId" class="list-table-row">
            <td>
              {{ tutor.insNumber }}
            </td>
            <td class="font-bold hover:underline" @click="tutorDetail(tutor.insId)">
              {{ tutor.insName }}
            </td>
            <td>{{ tutor.insHp }}</td>
            <td>{{ tutor.insRegDate }}</td>
            <td>
              <select
                v-model="tutor.insStatusYn"
                @change="tutorStatusChange(tutor.insId, tutor.insStatusYn)"
              >
                <option value="N">탈퇴</option>
                <option value="Y">재직</option>
                <option value="W">승인 대기중</option>
              </select>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="4" class="list-empty-row">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation :items-per-page="5" :total-items="tutorCount" :on-page-change="tutorSearch" />
  </div>
  <TutorModal v-if="modalState.isOpen && modalState.type == 'manageTutor'" :detail-id="detailId" />
</template>

<style scoped>
@import './styled.css';
</style>
